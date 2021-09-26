<?php
/**
 * REST API: Log Controller
 *
 * @since 1.6.0
 * @package QuillForms
 * @subpackage API
 */

namespace QuillForms\REST_API\Controllers\V1;

use QuillForms\Abstracts\REST_Controller;
use QuillForms\Log_Handlers\Log_Handler_DB;
use WP_Error;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST_Log_Controller is REST api controller class for log
 *
 * @since 1.6.0
 */
class REST_Log_Controller extends REST_Controller {

	/**
	 * REST Base
	 *
	 * @since 1.6.0
	 *
	 * @var string
	 */
	protected $rest_base = 'logs';

	/**
	 * Register the routes for the controller.
	 *
	 * @since 1.6.0
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
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<log_id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Get all logs.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$per_page = $request->get_param( 'per_page' );
		$page     = $request->get_param( 'page' );
		$offset   = $per_page * ( $page - 1 );
		$logs     = Log_Handler_DB::get( $offset, $per_page );

		$total_items = Log_Handler_DB::get_count();
		$total_pages = ceil( $total_items / $per_page );

		$data = array(
			'items'       => $logs,
			'total_items' => $total_items,
			'page'        => $page,
			'per_page'    => $per_page,
			'total_pages' => $total_pages,
		);

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Check if a given request has access to get all items.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Delete one item from the collection
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_RESPONSE
	 */
	public function delete_item( $request ) {
		$deleted = Log_Handler_DB::delete( $request->get_param( 'log_id' ) );

		if ( ! $deleted ) {
			return new WP_Error( 'quillforms_logs_db_error_on_deleting_log', __( 'Error on deleting log in db!', 'quillforms' ), array( 'status' => 422 ) );
		}

		return new WP_REST_Response();
	}

	/**
	 * Delete item permission check
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function delete_item_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
