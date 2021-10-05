<?php
/**
 * Class: System_Status
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\System_Status;

use Throwable;

/**
 * System_Status Class
 *
 * @since 1.6.0
 */
class System_Status {

	/**
	 * Class instance
	 *
	 * @since 1.6.0
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since 1.6.0
	 *
	 * @return self
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.6.0
	 */
	private function __construct() {
		add_action( 'wp_ajax_quillforms_get_system_status_report', array( $this, 'ajax_get_report' ) );
	}

	/**
	 * Get report
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_report() {
		$report = array(
			array(
				'label'     => esc_html__( 'QuillForms Environment', 'quillforms' ),
				'label_raw' => 'QuillForms Environment',
				'items'     => QuillForms_Environment::instance()->get_report(),
			),
			array(
				'label'     => esc_html__( 'Wordpress Environment', 'quillforms' ),
				'label_raw' => 'Wordpress Environment',
				'items'     => WordPress_Environment::instance()->get_report(),
			),
			array(
				'label'     => esc_html__( 'Server Environment', 'quillforms' ),
				'label_raw' => 'Server Environment',
				'items'     => Server_Environment::instance()->get_report(),
			),
		);

		return apply_filters( 'quillforms_system_status_report', $report );
	}

	/**
	 * Handle ajax get report request
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function ajax_get_report() {
		$this->check_ajax_authorization();

		try {
			$report = $this->get_report();
			wp_send_json_success( $report, 200 );
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
			wp_send_json_error( esc_html__( 'Cannot generate system status report, check log', 'quillforms' ) );
		}
	}

	/**
	 * Check ajax request authorization.
	 * Sends error response and exit if not authorized.
	 *
	 * @return void
	 */
	private function check_ajax_authorization() {
		// check for user capability.
		if ( ! current_user_can( 'manage_quillforms' ) ) {
			wp_send_json_error( esc_html__( 'Forbidden', 'quillforms' ), 403 );
			exit;
		}
	}
}
