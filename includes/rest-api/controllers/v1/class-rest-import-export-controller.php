<?php
/**
 * REST_Import_Export_Controller class.
 *
 * @since 2.12.2
 * @package QuillForms
 */

namespace QuillForms\REST_API\Controllers\V1;

use QuillForms\Abstracts\REST_Controller;
use QuillForms\Import_Export;
use Throwable;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST_Import_Export_Controller class.
 *
 * @since 2.12.2
 */
class REST_Import_Export_Controller extends REST_Controller {

	/**
	 * REST Base
	 *
	 * @since 2.12.2
	 *
	 * @var string
	 */
	protected $rest_base = 'import-export';

	/**
	 * Register the routes for the controller.
	 *
	 * @since 2.12.2
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/export",
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'export' ),
					'permission_callback' => array( $this, 'import_export_permissions_check' ),
					'args'                => array(),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			"/{$this->rest_base}/import",
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'import' ),
					'permission_callback' => array( $this, 'import_export_permissions_check' ),
					'args'                => array(),
				),
			)
		);
	}

	/**
	 * Exports a forms.
	 *
	 * @since 2.12.2
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function export( $request ) {
		$form_ids = $request->get_param( 'formIds' );

		if ( empty( $form_ids ) ) {
			return new WP_Error(
				'quillforms_rest_invalid_form_ids',
				__( 'Invalid forms.', 'quillforms' ),
				array( 'status' => 400 )
			);
		}

		$exporter = new Import_Export\Exporter( $form_ids );
		$exporter->export();
	}

	/**
	 * Imports a forms.
	 *
	 * @since 2.12.2
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function import( $request ) {
		$file = $request->get_file_params();
		if ( empty( $file['json_file'] ?? null ) ) {
			return new WP_Error(
				'quillforms_rest_invalid_file',
				__( 'Invalid file.', 'quillforms' ),
				array( 'status' => 400 )
			);
		}

		// Check if the file is a json file.
		$file_name = $file['json_file']['name'];
		$ext       = pathinfo( $file_name, PATHINFO_EXTENSION );
		if ( 'json' !== $ext ) {
			return new WP_Error(
				'quillforms_rest_invalid_file_type',
				__( 'Invalid file type.', 'quillforms' ),
				array( 'status' => 400 )
			);
		}

		$file      = $file['json_file'];
		$json_data = file_get_contents( $file['tmp_name'] );
		$json_data = json_decode( $json_data, true );
		$importer  = new Import_Export\Importer( $json_data );
		$forms     = $importer->import();

		if ( is_wp_error( $forms ) ) {
			return $forms;
		}

		$response = array(
			'success' => true,
			'forms'   => $forms,
		);

		return rest_ensure_response( $response );
	}

	/**
	 * Checks if a given request has access to import and export.
	 *
	 * @since 2.12.2
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function import_export_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}
}
