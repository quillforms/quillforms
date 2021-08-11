<?php
/**
 * API class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\API;

use Exception;
use WP_Error;

/**
 * API abstract class.
 *
 * @since 1.3.0
 */
abstract class API {

	/**
	 * Provider
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Initialized accounts
	 *
	 * @var mixed
	 */
	protected $accounts = array();

	/**
	 * Account class
	 *
	 * @var string
	 */
	protected static $account_class;

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
	 * Get stored accounts data.
	 *
	 * @return array
	 */
	final protected function get_accounts_data() {
		return get_option( "quillforms_{$this->provider->slug}_accounts", array() );
	}

	/**
	 * Update stored accounts data.
	 *
	 * @param array $data Accounts data.
	 * @return boolean
	 */
	final protected function update_accounts_data( $data ) {
		return update_option( "quillforms_{$this->provider->slug}_accounts", $data );
	}

	/**
	 * Get accounts.
	 *
	 * @return array
	 */
	final public function get_accounts() {
		$accounts = array();
		foreach ( $this->get_accounts_data() as $account_id => $account_data ) {
			$accounts[ $account_id ] = array(
				'name' => $account_data['name'] ?: 'Unkown name', //phpcs:ignore
			);
		}
		return $accounts;
	}

	/**
	 * Add account.
	 *
	 * @since 1.3.0
	 *
	 * @param array $data Account data. Contains name and credentials.
	 * @return string|boolean
	 */
	final public function add_account( $data = array() ) {
		// check account data.
		$authenticate = $this->authenticate( $data );
		if ( is_wp_error( $authenticate ) ) {
			return $authenticate;
		}

		$new_account_id                   = uniqid();
		$accounts_data                    = $this->get_accounts_data();
		$accounts_data[ $new_account_id ] = $data;
		$this->update_accounts_data( $accounts_data );

		return $new_account_id;
	}

	/**
	 * Remove account.
	 *
	 * @param string $account_id Account id.
	 * @return boolean
	 */
	public function remove_account( $account_id ) {
		if ( isset( $this->accounts[ $account_id ] ) ) {
			unset( $this->accounts[ $account_id ] );
		}

		$accounts_data = $this->get_accounts_data();
		if ( isset( $accounts_data[ $account_id ] ) ) {
			unset( $accounts_data[ $account_id ] );
			return $this->update_accounts_data( $accounts_data );
		}

		return true;
	}

	/**
	 * Authenticate with the provider API.
	 * Checks if account data is valid
	 *
	 * @since 1.3.0
	 *
	 * @param array $data Account data.
	 * @return boolean|WP_Error
	 */
	abstract protected function authenticate( $data );

	/**
	 * Establish account object to provider API.
	 *
	 * @since 1.3.0
	 *
	 * @param string $account_id Account id.
	 * @return Account|WP_Error
	 */
	public function connect( $account_id ) {
		// TODO: translate error messages.
		if ( ! isset( $this->accounts[ $account_id ] ) ) {
			// init account.
			$accounts_data = $this->get_accounts_data();
			if ( ! isset( $accounts_data[ $account_id ] ) ) {
				return new WP_Error( "quillforms-{$this->provider->slug}-api-connect", 'Cannot find account data', array( 'status' => 422 ) );
			}
			try {
				$this->accounts[ $account_id ] = new static::$account_class( $accounts_data[ $account_id ] ); // phpcs:ignore
			} catch ( Exception $e ) {
				return new WP_Error( "quillforms-{$this->provider->slug}-api-connect", 'Cannot connect to account', array( 'status' => 422 ) );
			}
		}
		return $this->accounts[ $account_id ];
	}

}
