<?php
/**
 * REST_System_Status_Controller class.
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\REST_API\Controllers\V1;

use QuillForms\Abstracts\REST_Controller;
use QuillForms\System_Status\System_Status;
use Throwable;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST_System_Status_Controller class.
 *
 * @since 1.6.0
 */
class REST_System_Status_Controller extends REST_Controller {

	/**
	 * REST Base
	 *
	 * @since 1.6.0
	 *
	 * @var string
	 */
	protected $rest_base = 'system-status';

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
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}

	/**
	 * Retrieves settings.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) { // phpcs:ignore
		try {
			$report = System_Status::instance()->get_report();
		} catch ( Throwable $e ) {
			quillforms_get_logger()->critical(
				esc_html__( 'Cannot generate system status report', 'quillforms' ),
				array(
					'code'      => 'cannot_generate_system_status_report',
					'exception' => array(
						'code'    => $e->getCode(),
						'message' => $e->getMessage(),
						'trace'   => $e->getTraceAsString(),
					),
				)
			);
			return new WP_Error( 'cannot_generate_system_status_report', esc_html__( 'Cannot generate system status report, check log', 'quillforms' ) );
		}

		return new WP_REST_Response( $report, 200 );
	}

	/**
	 * Checks if a given request has access to get settings.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
