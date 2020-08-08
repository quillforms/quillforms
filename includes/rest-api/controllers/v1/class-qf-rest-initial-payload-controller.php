<?php
/**
 * REST API: Theme Controller
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage REST_API
 */

defined( 'ABSPATH' ) || exit;

/**
 * QF_REST_Initial_State_Controller is REST api controller class for getting initial state.
 *
 * @since 1.0.0
 */
class QF_REST_Initial_Payload_Controller extends QF_REST_Controller {

	/**
	 * REST Base
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $rest_base = 'initial-payload';

	/**
	 * Register the routes for the controller.
	 *
	 * @since 1.0.0
	 */
	public function register_routes() {

		$namespace = $this->namespace;

		$base = $this->rest_base;

		register_rest_route(
			$namespace,
			'/' . $base . '/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'context' => array(
							'default' => 'view',
						),
					),
				),
			)
		);

	}

	/**
	 * Check if a given request has access to get a specific item
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_item_permissions_check( $request ) {
		if ( current_user_can( 'read_quillform', $request['id'] ) ) {
			return true;
		} else {
			return new WP_Error( 'quillforms_rest_cannot_view', __( 'Sorry, you cannot read this resource', 'quillforms' ) );
		}
	}

	/**
	 * Get initial state for a specific form id.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_item( $request ) {
		$form_id = $request['id'];
		$data    = qf_get_initial_payload( $form_id );
		if ( $data ) {
			$response = rest_ensure_response( $data );
			$response->set_status( 201 );
			return new WP_REST_Response( $data, 200 );
		} else {
			return new WP_Error( 'qf_form_not_found', __( 'Form not found', 'quillforms' ) );
		}
	}

}
