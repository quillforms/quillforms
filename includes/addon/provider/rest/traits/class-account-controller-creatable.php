<?php
/**
 * Account_Controller_Creatable trait.
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST\Traits;

use QuillForms\Addon\Provider\Provider;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Account_Controller_Creatable trait.
 *
 * @since 1.6.0
 *
 * @property Provider $provider
 */
trait Account_Controller_Creatable {

	/**
	 * Register creatable route
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	protected function register_creatable_route() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
				),
			)
		);
	}

	/**
	 * Retrieves the item's schema, conforming to JSON Schema.
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_item_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'account',
			'type'       => 'object',
			'properties' => array(
				'id'          => array(
					'type'     => 'string',
					'readonly' => true,
				),
				'name'        => array(
					'type'     => 'string',
					'required' => false,
				),
				'credentials' => array(
					'type'       => 'object',
					'required'   => true,
					'properties' => $this->get_credentials_schema(),
				),
			),
		);
		return $schema;
	}

	/**
	 * Get credentials schema
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	abstract protected function get_credentials_schema();

	/**
	 * Creates one item from the collection.
	 * This function creates an account or updates it if its id exists.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		$account_info = $this->get_account_info( $request );
		if ( is_wp_error( $account_info ) ) {
			return $account_info;
		}

		$account_id   = $account_info['id'];
		$account_data = array(
			'name'        => (string) $account_info['name'],
			'credentials' => $account_info['credentials'] ?? $request['credentials'],
		);

		// if account already exists.
		$account_exists = in_array( $account_id, array_keys( $this->provider->accounts->get_accounts() ) ); // phpcs:ignore
		if ( $account_exists ) {
			$result = $this->provider->accounts->update_account( $account_id, $account_data );
		} else {
			$result = $this->provider->accounts->add_account( $account_id, $account_data );
		}

		if ( empty( $result ) || is_wp_error( $result ) ) {
			return new WP_Error( "quillforms_{$this->provider->slug}_cannot_save_account", esc_html__( 'Cannot save account', 'quillforms' ) );
		}

		return new WP_REST_Response(
			array(
				'id'   => $account_id,
				'name' => $account_data['name'],
			),
			$account_exists ? 200 : 201
		);
	}

	/**
	 * Get account id & name
	 * Can be real id and name(email), or random id & a nick name.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return array|WP_Error array of id & name on success.
	 */
	abstract protected function get_account_info( $request );

	/**
	 * Checks if a given request has access to create items.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
