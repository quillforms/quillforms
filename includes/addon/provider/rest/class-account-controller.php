<?php
/**
 * Account_Controller class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

use QuillForms\Abstracts\REST_Controller;
use QuillForms\Addon\Provider\Account_API;
use QuillForms\Addon\Provider\Provider;
use WP_Error;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Account_Controller abstract class.
 *
 * @since 1.3.0
 */
abstract class Account_Controller extends REST_Controller {

	/**
	 * Provider
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Credentials schema
	 *
	 * @var array
	 */
	protected $credentials_schema = array();

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider  = $provider;
		$this->rest_base = "addons/{$this->provider->slug}/accounts";

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register controller routes
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\w]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Retrieves the item's schema, conforming to JSON Schema.
	 *
	 * @since 1.3.0
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
					'required' => true,
				),
				'credentials' => array(
					'type'       => 'object',
					'required'   => true,
					'properties' => $this->credentials_schema,
				),
			),
		);
		return $schema;
	}

	/**
	 * Retrieves a collection of items.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) { // phpcs:ignore
		$accounts = $this->provider->accounts->get_accounts();
		return new WP_REST_Response( $accounts, 200 );
	}

	/**
	 * Checks if a given request has access to get items.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Retrieves one item from the collection.
	 *
	 * @since 4.7.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $request ) {
		$id          = $request->get_param( 'id' );
		$account_api = $this->provider->accounts->connect( $id );
		if ( is_wp_error( $account_api ) ) {
			quillforms_get_logger()->error(
				$account_api->get_error_message(),
				array(
					'source'     => static::class . '->' . __FUNCTION__,
					'code'       => $account_api->get_error_code(),
					'account_id' => $id,
				)
			);
			return $account_api;
		}

		$details = $this->get_account_details( $account_api );
		if ( is_wp_error( $details ) ) {
			return $details;
		}
		return new WP_REST_Response( $details, 200 );
	}

	/**
	 * Get account details to be used in get_item
	 *
	 * @param Account_API $account_api Account API.
	 * @return array|WP_Error
	 */
	abstract protected function get_account_details( $account_api );

	/**
	 * Checks if a given request has access to get a specific item.
	 *
	 * @since 4.7.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Creates one item from the collection.
	 * This function creates an account or updates it if its id exists.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		$account_data = array(
			'name'        => $request['name'],
			'credentials' => $request['credentials'],
		);

		// get real account id from the api, random id if there isn't.
		$account_id = $this->get_account_id( $request['credentials'] );
		if ( is_wp_error( $account_id ) ) {
			return $account_id;
		}

		// if account already exists.
		$account_exists = in_array( $account_id, array_keys( $this->provider->accounts->get_accounts() ), true );
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
	 * Get real account id from the api, or random id if there isn't.
	 *
	 * @param array $credentials Credentials.
	 * @return string|WP_Error
	 */
	abstract protected function get_account_id( $credentials );

	/**
	 * Checks if a given request has access to create items.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Deletes one item from the collection.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$this->provider->accounts->remove_account( $request['id'] );
		return new WP_REST_Response();
	}

	/**
	 * Checks if a given request has access to delete a specific item.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to delete the item, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
