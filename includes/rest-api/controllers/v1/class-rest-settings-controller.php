<?php
/**
 * REST_Settings_Controller class.
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\REST_API\Controllers\V1;

use QuillForms\Abstracts\REST_Controller;
use QuillForms\Settings;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST_Settings_Controller class.
 *
 * @since 1.6.0
 */
class REST_Settings_Controller extends REST_Controller {

	/**
	 * REST Base
	 *
	 * @since 1.6.0
	 *
	 * @var string
	 */
	protected $rest_base = 'settings';

	/**
	 * Register the routes for the controller.
	 *
	 * @since 1.6.0
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
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_schema() {
		$schema = array(
			'$schema'              => 'http://json-schema.org/draft-04/schema#',
			'title'                => 'settings',
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => array(
				'general' => array(
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => array(
						'providers_sync_entry_process'  => array(
							'type'    => 'boolean',
							'default' => false,
						),
						'log_level'                     => array(
							'type'    => 'string',
							'default' => 'info',
						),
						'override_quillforms_slug' => array(
							'type' => 'boolean',
							'default' => false
						),
						'quillforms_slug' => array(
							'type' => 'string',
							'default' => ''
						),
						'disable_collecting_user_ip'    => array(
							'type'    => 'boolean',
							'default' => false,
						),
						'disable_collecting_user_agent' => array(
							'type'    => 'boolean',
							'default' => false,
						),
						'google_maps_api_key'           => array(
							'type'    => 'string',
							'default' => '',
						),
					),
				),

				'emails' => array(
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => array(
						'emails_header_image'           => array(
							'type'    => 'string',
							'default' => '',
						),
						'emails_background_color' => array(
							'type' => 'string',
							'default' => "#e9eaec"
						)
					),
				),
			),
		);
		return $schema;
	}

	/**
	 * Retrieves settings.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get( $request ) { // phpcs:ignore
		$groups   = $request->get_param( 'groups' )
			? explode( ',', $request->get_param( 'groups' ) )
			: array();
		$settings = Settings::get_all();

		$result = array();
		foreach ( $this->get_schema()['properties'] as $group_key => $group_schema ) {
			if ( in_array( $group_key, $groups, true ) ) {
				$result[ $group_key ] = array();
				foreach ( $group_schema['properties'] as $setting_key => $setting_schema ) {
					$result[ $group_key ][ $setting_key ] = $settings[ $setting_key ] ?? $setting_schema['default'];
				}
			}
		}

		return new WP_REST_Response( $result, 200 );
	}

	/**
	 * Checks if a given request has access to get settings.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Updates settings.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update( $request ) {
		$settings = $request->get_json_params();
		Settings::update_many( $settings );
		return new WP_REST_Response( array( 'success' => true ), 200 );
	}

	/**
	 * Checks if a given request has access to update settings.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
