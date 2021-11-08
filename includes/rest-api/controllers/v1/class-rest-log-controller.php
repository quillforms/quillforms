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
use WP_REST_Request;
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
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_items' ),
					'permission_callback' => array( $this, 'delete_items_permissions_check' ),
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
		$levels = $request->get_param( 'levels' ) ?? false;
		if ( $levels ) {
			$levels = explode( ',', $levels );
		}

		// check export.
		$export = $request->get_param( 'export' );
		if ( $export ) {
			return $this->export_items( $export, $levels );
		}

		$per_page = $request->get_param( 'per_page' );
		$page     = $request->get_param( 'page' );
		$offset   = $per_page * ( $page - 1 );
		$logs     = Log_Handler_DB::get_all( $levels, $offset, $per_page );

		$total_items = Log_Handler_DB::get_count( $levels );
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
	 * Export items
	 *
	 * @since 1.7.1
	 *
	 * @param string $format Format.
	 * @param array  $levels Levels.
	 * @return void|WP_Error|WP_REST_Response
	 */
	private function export_items( $format, $levels ) {
		$logs = Log_Handler_DB::get_all( $levels );
		if ( empty( $logs ) ) {
			return new WP_Error( 'quillforms_cannot_find_logs', esc_html__( 'Cannot find any logs', 'quillforms' ), array( 'status' => 404 ) );
		}

		$rows = array();

		// header row.
		$header_row = array_keys( $logs[0] );
		$rows[]     = $header_row;

		// logs rows.
		foreach ( $logs as $log ) {
			$log_row = array_values( $log );
			$rows[]  = $log_row;
		}

		switch ( $format ) {
			case 'json':
				$this->export_json( $rows );
				break;
			default:
				return new WP_Error( 'quillforms_unknown_logs_export_format', esc_html__( 'Unknown export format', 'quillforms' ), array( 'status' => 422 ) );
		}
	}

	/**
	 * Export rows as json file
	 *
	 * @param array $rows File rows.
	 * @return void
	 */
	private function export_json( $rows ) {
		$filename = esc_html__( 'Logs export', 'quillforms' ) . '.json';

		if ( ini_get( 'display_errors' ) ) {
			ini_set( 'display_errors', '0' );
		}
		nocache_headers();
		header( 'X-Robots-Tag: noindex', true );
		header( 'Content-Type: application/json' );
		header( 'Content-Description: File Transfer' );
		header( "Content-Disposition: attachment; filename=\"$filename\";" );
		echo json_encode( $rows );
		exit;
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
	 * Delete items from the collection
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_RESPONSE
	 */
	public function delete_items( $request ) {
		if ( isset( $request['ids'] ) ) {
			$ids     = empty( $request['ids'] ) ? array() : explode( ',', $request['ids'] );
			$deleted = (bool) Log_Handler_DB::delete( $ids );
		} else {
			$deleted = (bool) Log_Handler_DB::flush();
		}

		return new WP_REST_Response( array( 'success' => $deleted ), 200 );
	}

	/**
	 * Delete items permission check
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function delete_items_permissions_check( $request ) {
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
