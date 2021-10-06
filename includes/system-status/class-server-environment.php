<?php
/**
 * Class: QuillForms_Environment
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\System_Status;

/**
 * QuillForms_Environment Class
 *
 * @since 1.6.0
 */
class Server_Environment {

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
		global $wpdb;

		$curl_installed = false;
		$curl_version   = '';
		if ( function_exists( 'curl_version' ) ) {
			$curl_installed = true;
			$curl_version   = curl_version();
			$curl_version   = $curl_version['version'] . ', ' . $curl_version['ssl_version'];
		} elseif ( extension_loaded( 'curl' ) ) {
			$curl_installed = true;
		}

		$server_report = array(
			array(
				'label'     => esc_html__( 'Web Server', 'quillforms' ),
				'label_raw' => 'Web Server',
				'items'     => array(
					array(
						'label'     => esc_html__( 'Software', 'quillforms' ),
						'label_raw' => 'Software',
						'value'     => esc_html( $_SERVER['SERVER_SOFTWARE'] ?? '' ),
					),
					array(
						'label'     => esc_html__( 'Port', 'quillforms' ),
						'label_raw' => 'Port',
						'value'     => esc_html( $_SERVER['SERVER_PORT'] ?? '' ),
					),
					array(
						'label'     => esc_html__( 'Document Root', 'quillforms' ),
						'label_raw' => 'Document Root',
						'value'     => esc_html( $_SERVER['DOCUMENT_ROOT'] ?? '' ),
					),
				),
			),
			array(
				'label'     => esc_html__( 'PHP', 'quillforms' ),
				'label_raw' => 'PHP',
				'items'     => array(
					array(
						'label'     => esc_html__( 'Version', 'quillforms' ),
						'label_raw' => 'Version',
						'value'     => esc_html( phpversion() ),
					),
					array(
						'label'     => esc_html__( 'Memory Limit', 'quillforms' ) . ' (memory_limit)',
						'label_raw' => 'Memory Limit',
						'value'     => esc_html( ini_get( 'memory_limit' ) ),
					),
					array(
						'label'     => esc_html__( 'Maximum Execution Time', 'quillforms' ) . ' (max_execution_time)',
						'label_raw' => 'Maximum Execution Time',
						'value'     => esc_html( ini_get( 'max_execution_time' ) ),
					),
					array(
						'label'     => esc_html__( 'Maximum File Upload Size', 'quillforms' ) . ' (upload_max_filesize)',
						'label_raw' => 'Maximum File Upload Size',
						'value'     => esc_html( ini_get( 'upload_max_filesize' ) ),
					),
					array(
						'label'     => esc_html__( 'Maximum File Uploads', 'quillforms' ) . ' (max_file_uploads)',
						'label_raw' => 'Maximum File Uploads',
						'value'     => esc_html( ini_get( 'max_file_uploads' ) ),
					),
					array(
						'label'     => esc_html__( 'Maximum Post Size', 'quillforms' ) . ' (post_max_size)',
						'label_raw' => 'Maximum Post Size',
						'value'     => esc_html( ini_get( 'post_max_size' ) ),
					),
					array(
						'label'     => esc_html__( 'Maximum Input Variables', 'quillforms' ) . ' (max_input_vars)',
						'label_raw' => 'Maximum Input Variables',
						'value'     => esc_html( ini_get( 'max_input_vars' ) ),
					),
					array(
						'label'     => esc_html__( 'UTC Time', 'quillforms' ),
						'label_raw' => 'UTC time',
						'value'     => gmdate( 'Y-m-d H:i:s' ),
					),
					array(
						'label'     => esc_html__( 'Local Time', 'quillforms' ),
						'label_raw' => 'Local time',
						'value'     => date( 'Y-m-d H:i:s' ), // phpcs:ignore
					),
					array(
						'label'     => esc_html__( 'cURL', 'quillforms' ),
						'label_raw' => 'cURL',
						'value'     => $curl_installed ? ( $curl_version ? $curl_version : esc_html__( 'Installed but cannot get version', 'quillforms' ) ) : esc_html__( 'Not installed', 'quillforms' ),
						'value_raw' => $curl_installed ? ( $curl_version ? $curl_version : 'Cannot get version' ) : 'Not installed',
					),
					array(
						'label'        => esc_html__( 'Mcrypt', 'quillforms' ),
						'label_raw'    => 'Mcrypt',
						'value'        => function_exists( 'mcrypt_encrypt' ) ? '✔' : '✘',
						'value_export' => function_exists( 'mcrypt_encrypt' ),
					),
					array(
						'label'        => esc_html__( 'Mbstring', 'quillforms' ),
						'label_raw'    => 'Mbstring',
						'value'        => function_exists( 'mb_strlen' ) ? '✔' : '✘',
						'value_export' => function_exists( 'mb_strlen' ),
					),
					array(
						'label'     => esc_html__( 'Loaded Extensions', 'quillforms' ),
						'label_raw' => 'Loaded Extensions',
						'value'     => implode( ', ', get_loaded_extensions() ),
					),
				),
			),
			array(
				'label'     => esc_html__( 'MySQL', 'quillforms' ),
				'label_raw' => 'MySQL',
				'items'     => array(
					array(
						'label'     => esc_html__( 'Server', 'quillforms' ),
						'label_raw' => 'Server',
						'value'     => esc_html( mysqli_get_server_info( $wpdb->dbh ) ), // phpcs:ignore
					),
					array(
						'label'     => esc_html__( 'Version', 'quillforms' ),
						'label_raw' => 'Version',
						'value'     => esc_html( $wpdb->db_version() ),
					),
					array(
						'label'     => esc_html__( 'Database Character Set', 'quillforms' ),
						'label_raw' => 'Database Character Set',
						'value'     => esc_html( $wpdb->get_var( 'SELECT @@character_set_database' ) ),
					),
					array(
						'label'     => esc_html__( 'Database Collation', 'quillforms' ),
						'label_raw' => 'Database Collation',
						'value'     => esc_html( $wpdb->get_var( 'SELECT @@collation_database' ) ),
					),
					array(
						'label'     => esc_html__( 'UTC Time', 'quillforms' ),
						'label_raw' => 'UTC time',
						'value'     => $wpdb->get_var( 'SELECT utc_timestamp()' ),
					),
					array(
						'label'     => esc_html__( 'Local Time', 'quillforms' ),
						'label_raw' => 'Local time',
						'value'     => $wpdb->get_var( 'SELECT localtime()' ),
					),
				),
			),
		);

		/**
		 * Each item must has label & value keys, and may has label & value_locale
		 */
		$server_report = apply_filters( 'quillforms_system_status_server_report', $server_report );

		return $server_report;
	}


}
