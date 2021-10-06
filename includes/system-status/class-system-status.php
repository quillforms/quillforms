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
	private function __construct() {}

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

}
