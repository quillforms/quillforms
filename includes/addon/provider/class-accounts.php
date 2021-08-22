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
	 * @return boolean|WP_Error
	 */
	public function add_account( $account_id, $account_data ) {
		return $this->add_account_data( $account_id, $account_data );
	}

	/**
	 * Update account.
	 *
	 * @since 1.3.0
	 *
	 * @param string $account_id Account id.
	 * @param array  $account_data Account data.
	 * @return boolean|WP_Error
	 */
	public function update_account( $account_id, $account_data ) {
		if ( isset( $this->account_apis[ $account_id ] ) ) {
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
		if ( isset( $this->account_apis[ $account_id ] ) ) {
			unset( $this->account_apis[ $account_id ] );
		}

		return $this->remove_account_data( $account_id );
	}

	/**
	 * Get stored accounts data.
	 *
	 * @return array
	 */
	final protected function get_accounts_data() {
		return $this->provider->settings->get_filtered( 'accounts' ) ?? array();
	}

	/**
	 * Update stored accounts data.
	 *
	 * @param array $data Accounts data.
	 * @return boolean
	 */
	final protected function update_accounts_data( $data ) {
		return $this->provider->settings->update_filtered( array( 'accounts' => $data ) );
	}

	/**
	 * Add account data.
	 *
	 * @since 1.3.0
	 *
	 * @param string $account_id Account id.
	 * @param array  $account_data Account data. Contains name and credentials.
	 * @return boolean|WP_Error
	 */
	final protected function add_account_data( $account_id, $account_data ) {
		$data = $this->get_accounts_data();
		if ( isset( $data[ $account_id ] ) ) {
			return new WP_Error( "quillforms-{$this->provider->slug}-accounts-add-data", 'Account id already exists' );
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
	 * @return boolean|WP_Error
	 */
	final protected function update_account_data( $account_id, $account_data ) {
		$data = $this->get_accounts_data();
		if ( ! isset( $data[ $account_id ] ) ) {
			return new WP_Error( "quillforms-{$this->provider->slug}-accounts-update-data", "Account id doesn't exist" );
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
				$message = esc_html__( 'Cannot find account data.', 'quillforms' );
				quillforms_get_logger()->error(
					$message,
					array(
						'provider'   => $this->provider->slug,
						'account_id' => $account_id,
					)
				);
				return new WP_Error(
					"quillforms-{$this->provider->slug}-accounts-connect-data",
					$message
				);
			}
			// init account api.
			try {
				$this->account_apis[ $account_id ] = $this->init_account_api( $account_id, $accounts_data[ $account_id ] );
			} catch ( Exception $e ) {
				$message = esc_html__( 'Cannot connect to account api.', 'quillforms' );
				quillforms_get_logger()->error(
					$message,
					array(
						'provider'   => $this->provider->slug,
						'account_id' => $account_id,
					)
				);
				return new WP_Error(
					"quillforms-{$this->provider->slug}-accounts-connect-api",
					$message
				);
			}
		}
		return $this->account_apis[ $account_id ];
	}

}
