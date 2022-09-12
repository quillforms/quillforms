<?php
/**
 * Accounts class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider;

use Exception;
use WP_Error;

/**
 * Accounts abstract class.
 *
 * @since 1.3.0
 */
abstract class Accounts {

	/**
	 * Provider
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Initialized account APIs
	 *
	 * @var array 'account_id' => Account_API objects
	 */
	protected $account_apis = array();

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider = $provider;
	}

	/**
	 * Initialize new account api
	 *
	 * @param string $account_id Account id.
	 * @param array  $account_data Account data.
	 * @return Account_API object
	 */
	abstract protected function init_account_api( $account_id, $account_data );

	/**
	 * Get accounts.
	 *
	 * @param array $account_data_keys Account data keys to be included.
	 * @return array
	 */
	final public function get_accounts( $account_data_keys = array( 'name' ) ) {
		$accounts = array();
		foreach ( $this->get_accounts_data() as $account_id => $account_data ) {
			$accounts[ $account_id ] = array_filter(
				$account_data,
				function( $key ) use ( $account_data_keys ) {
					return in_array( $key, $account_data_keys, true );
				},
				ARRAY_FILTER_USE_KEY
			);
		}
		return $accounts;
	}

	/**
	 * Add account.
	 *
	 * @since 1.3.0
	 *
	 * @param string $account_id Account id.
	 * @param array  $account_data Account data.
	 * @return boolean
	 */
	public function add_account( $account_id, $account_data ) {
		return $this->add_account_data( $account_id, $account_data );
	}

	/**
	 * Update account.
	 *
	 * @since 1.3.0
	 *
	 * @param string  $account_id Account id.
	 * @param array   $account_data Account data.
	 * @param boolean $disconnect Whether to unset the account api connection or not.
	 * @return boolean
	 */
	public function update_account( $account_id, $account_data, $disconnect = true ) {
		// disconnect.
		if ( $disconnect && isset( $this->account_apis[ $account_id ] ) ) {
			unset( $this->account_apis[ $account_id ] );
		}
		return $this->update_account_data( $account_id, $account_data );
	}

	/**
	 * Remove account.
	 *
	 * @param string $account_id Account id.
	 * @return boolean
	 */
	public function remove_account( $account_id ) {
		// disconnect.
		if ( isset( $this->account_apis[ $account_id ] ) ) {
			unset( $this->account_apis[ $account_id ] );
		}
		if ( $this->provider->accounts_remote_data ) {
			$this->provider->accounts_remote_data->clear_cache( $account_id );
		}
		$this->remove_account_connections( $account_id );

		return $this->remove_account_data( $account_id );
	}

	/**
	 * Remove account connections.
	 *
	 * @param string $account_id Account id.
	 * @return void
	 */
	protected function remove_account_connections( $account_id ) {
		$forms = get_posts(
			array(
				'post_type'   => 'quill_forms',
				'fields'      => 'ids',
				'numberposts' => -1,
			)
		);
		foreach ( $forms as $form_id ) {
			$connections     = $this->provider->form_data->get( $form_id, 'connections' );
			$new_connections = array_filter(
				$connections,
				function( $connection ) use ( $account_id ) {
					return $connection['account_id'] !== $account_id;
				}
			);
			if ( $connections !== $new_connections ) {
				$this->provider->form_data->update( $form_id, array( 'connections' => $new_connections ) );
				quillforms_get_logger()->notice(
					esc_html__( 'Some integration connections are deleted due to deleting the related account.', 'quillforms' ),
					array(
						'code'    => 'account_connections_deleted',
						'form_id' => $form_id,
						'deleted' => array_diff_key( $connections, $new_connections ),
					)
				);
			}
		}
	}

	/**
	 * Establish account api object.
	 *
	 * @since 1.3.0
	 *
	 * @param string $account_id Account id.
	 * @return Account_API|WP_Error
	 */
	public function connect( $account_id ) {
		if ( ! isset( $this->account_apis[ $account_id ] ) ) {
			$accounts_data = $this->get_accounts_data();
			// get account data.
			if ( ! isset( $accounts_data[ $account_id ] ) ) {
				return new WP_Error(
					"quillforms_{$this->provider->slug}_cannot_find_account_data",
					esc_html__( 'Cannot find account data', 'quillforms' )
				);
			}
			// init account api.
			try {
				$this->account_apis[ $account_id ] = $this->init_account_api( $account_id, $accounts_data[ $account_id ] );
			} catch ( Exception $e ) {
				return new WP_Error(
					"quillforms_{$this->provider->slug}_cannot_init_account_api",
					esc_html__( 'Cannot connect to account api', 'quillforms' )
				);
			}
		}
		return $this->account_apis[ $account_id ];
	}

	/**
	 * Get stored accounts data.
	 *
	 * @return array
	 */
	final protected function get_accounts_data() {
		return $this->provider->settings->get( 'accounts' ) ?? array();
	}

	/**
	 * Update stored accounts data.
	 *
	 * @param array $data Accounts data.
	 * @return boolean
	 */
	final protected function update_accounts_data( $data ) {
		return $this->provider->settings->update( array( 'accounts' => $data ) );
	}

	/**
	 * Add account data.
	 *
	 * @since 1.3.0
	 *
	 * @param string $account_id Account id.
	 * @param array  $account_data Account data. Contains name and credentials.
	 * @return boolean
	 */
	final protected function add_account_data( $account_id, $account_data ) {
		$data = $this->get_accounts_data();
		if ( isset( $data[ $account_id ] ) ) {
			quillforms_get_logger()->error(
				esc_html__( 'Account id already exists', 'quillforms' ),
				array(
					'source'     => static::class . '->' . __FUNCTION__,
					'code'       => 'account_id_already_exists',
					'account_id' => $account_id,
				)
			);
			return false;
		}
		$data[ $account_id ] = $account_data;
		return $this->update_accounts_data( $data );
	}

	/**
	 * Update account data.
	 *
	 * @since 1.3.0
	 *
	 * @param string $account_id Account id.
	 * @param array  $account_data Account data. Contains name and credentials.
	 * @return boolean
	 */
	final protected function update_account_data( $account_id, $account_data ) {
		$data = $this->get_accounts_data();
		if ( ! isset( $data[ $account_id ] ) ) {
			quillforms_get_logger()->error(
				esc_html__( 'Cannot find account to update', 'quillforms' ),
				array(
					'source'     => static::class . '->' . __FUNCTION__,
					'code'       => 'cannot_find_account_to_update',
					'account_id' => $account_id,
				)
			);
			return false;
		}
		$data[ $account_id ] = array_replace( $data[ $account_id ], $account_data );
		return $this->update_accounts_data( $data );
	}

	/**
	 * Remove account.
	 *
	 * @param string $account_id Account id.
	 * @return boolean
	 */
	final protected function remove_account_data( $account_id ) {
		$data = $this->get_accounts_data();
		if ( isset( $data[ $account_id ] ) ) {
			unset( $data[ $account_id ] );
			return $this->update_accounts_data( $data );
		}

		return true;
	}

}
