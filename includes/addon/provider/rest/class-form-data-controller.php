<?php
/**
 * Form_Data_Controller class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

use QuillForms\Addon\Provider\Provider;
use WP_Error;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Form_Data_Controller abstract class.
 *
 * @since 1.3.0
 */
abstract class Form_Data_Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'qf/v1';

	/**
	 * Route base.
	 *
	 * @var string
	 */
	protected $rest_base;

	/**
	 * Provider
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Connection schema
	 *
	 * @var array
	 */
	protected $connection_schema;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider  = $provider;
		$this->rest_base = "forms/(?P<form_id>[\d]+)/providers/{$provider->slug}";

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
			"/{$this->rest_base}/enabled",
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_enabled' ),
					'permission_callback' => array( $this, 'get_enabled_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'update_enabled' ),
					'permission_callback' => array( $this, 'update_enabled_permissions_check' ),
					'args'                => rest_get_endpoint_args_for_schema( $this->get_enabled_schema(), WP_REST_Server::CREATABLE ),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/connections",
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_connections' ),
					'permission_callback' => array( $this, 'get_connections_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'update_connections' ),
					'permission_callback' => array( $this, 'update_connections_permissions_check' ),
					'args'                => rest_get_endpoint_args_for_schema( $this->get_connections_schema(), WP_REST_Server::CREATABLE ),
				),
			)
		);
	}

	/**
	 * Retrieves 'enabled' schema, conforming to JSON Schema.
	 *
	 * @since 1.3.0
	 *
	 * @return array
	 */
	public function get_enabled_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'enabled',
			'type'       => 'object',
			'properties' => array(
				'enabled' => array(
					'type'     => 'boolean',
					'required' => true,
				),
			),
		);
		return $schema;
	}

	/**
	 * Retrieves 'connections' schema, conforming to JSON Schema.
	 *
	 * @since 1.3.0
	 *
	 * @return array
	 */
	public function get_connections_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'connections',
			'type'       => 'object',
			'properties' => array(
				'connections' => array(
					'type'                 => 'object',
					'required'             => true,
					'additionalProperties' => array(
						'type'       => 'object',
						'properties' => $this->connection_schema,
					),
				),
			),
		);
		return $schema;
	}

	/**
	 * Retrieves 'enabled'.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_enabled( $request ) {
		$form_id = $request->get_param( 'form_id' );
		$enabled = $this->provider->form_data->get( $form_id, 'enabled' ) ?? false;
		return new WP_REST_Response( array( 'enabled' => $enabled ), 200 );
	}

	/**
	 * Checks if a given request has access to get 'enabled'.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_enabled_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Updates 'enabled'.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_enabled( $request ) {
		$form_id = $request->get_param( 'form_id' );
		$enabled = $request->get_param( 'enabled' );
		$updated = $this->provider->form_data->update( $form_id, array( 'enabled' => $enabled ), true );
		if ( $updated ) {
			return new WP_REST_Response( array( 'success' => true ), 200 );
		} else {
			return new WP_Error( 'quillforms-mailchimp-enabled-update', esc_html__( 'Cannot update enabled!', 'quillforms' ), array( 'status' => 422 ) );
		}
	}

	/**
	 * Checks if a given request has access to get 'enabled'.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_enabled_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Retrieves 'connections'.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_connections( $request ) { // phpcs:ignore
		$form_id     = $request->get_param( 'form_id' );
		$connections = $this->provider->form_data->get( $form_id, 'connections' ) ?? array();
		return new WP_REST_Response( $connections, 200 );
	}

	/**
	 * Checks if a given request has access to get 'connections'.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_connections_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Updates 'connections'.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_connections( $request ) { // phpcs:ignore
		$form_id     = $request->get_param( 'form_id' );
		$connections = $request->get_param( 'connections' );
		$updated     = $this->provider->form_data->update( $form_id, array( 'connections' => $connections ), true );
		if ( $updated ) {
			return new WP_REST_Response( array( 'success' => true ), 200 );
		} else {
			return new WP_Error( 'quillforms-mailchimp-enabled-update', esc_html__( 'Cannot update connections!', 'quillforms' ), array( 'status' => 422 ) );
		}
	}

	/**
	 * Checks if a given request has access to get 'connections'.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_connections_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
