<?php
/**
 * Account_Controller class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

use QuillForms\Abstracts\REST_Controller;
use QuillForms\Addon\Provider\API\Account;
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
	protected $credentials_schema;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider  = $provider;
		$this->rest_base = "providers/{$provider->slug}/accounts";

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
		$accounts = $this->provider->api->get_accounts();
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
		$id      = $request->get_param( 'id' );
		$account = $this->provider->api->connect( $id );
		if ( is_wp_error( $account ) ) {
			return $account;
		}

		$details = $this->get_account_details( $account );
		if ( is_wp_error( $details ) ) {
			return $details;
		}
		return new WP_REST_Response( $details, 200 );
	}

	/**
	 * Get account details to be used in get_item
	 *
	 * @param Account $account Account.
	 * @return array|WP_Error
	 */
	abstract protected function get_account_details( $account );

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
		$result       = $this->provider->api->add_account( $account_data );
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$account_data['id'] = $result;
		return new WP_REST_Response( $account_data, 200 );
	}

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
		$this->provider->api->remove_account( $request['id'] );
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
