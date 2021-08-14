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
			"/{$this->rest_base}",
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get' ),
					'permission_callback' => array( $this, 'get_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'update' ),
					'permission_callback' => array( $this, 'update_permissions_check' ),
					'args'                => rest_get_endpoint_args_for_schema( $this->get_schema(), WP_REST_Server::CREATABLE ),
				),
			)
		);
	}

	/**
	 * Retrieves schema, conforming to JSON Schema.
	 *
	 * @since 1.3.0
	 *
	 * @return array
	 */
	abstract public function get_schema();

	/**
	 * Retrieves form data.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get( $request ) {
		$form_id = $request->get_param( 'form_id' );
		$props   = $request->get_param( 'props' );

		$data = $this->provider->form_data->get_filtered( $form_id ) ?? array();
		if ( $props ) {
			$props = explode( ',', $props );
			$data  = array_filter(
				$data,
				function( $key ) use ( $props ) {
					return in_array( $key, $props, true );
				},
				ARRAY_FILTER_USE_KEY
			);
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Checks if a given request has access to get form data.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Updates form data.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update( $request ) {
		$form_id = $request->get_param( 'form_id' );
		$data    = $request->get_json_params();

		$updated = $this->provider->form_data->update_filtered( $form_id, $data, true );
		if ( $updated ) {
			return new WP_REST_Response( array( 'success' => true ), 200 );
		} else {
			return new WP_Error( 'quillforms-mailchimp-form-data-update', esc_html__( 'Cannot update form data!', 'quillforms' ), array( 'status' => 422 ) );
		}
	}

	/**
	 * Checks if a given request has access to update form data.
	 *
	 * @since 1.3.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
