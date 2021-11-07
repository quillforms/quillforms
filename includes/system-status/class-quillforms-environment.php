<?php
/**
 * Class: QuillForms_Environment
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\System_Status;

use ActionScheduler;
use ActionScheduler_Store;
use ActionScheduler_Versions;
use QuillForms\Managers\Addons_Manager;
use QuillForms\Settings;

/**
 * QuillForms_Environment Class
 *
 * @since 1.6.0
 */
class QuillForms_Environment {

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
		$is_upload_dir_writable = $this->is_upload_dir_writable();

		$quillforms_report = array(
			array(
				'label'     => esc_html__( 'QuillForms', 'quillforms' ),
				'label_raw' => 'QuillForms',
				'items'     => array(
					array(
						'label'     => esc_html__( 'Version', 'quillforms' ),
						'label_raw' => 'Version',
						'value'     => QUILLFORMS_VERSION,
					),
					array(
						'label'     => esc_html__( 'Locale', 'quillforms' ),
						'label_raw' => 'Locale',
						'value'     => $this->get_locale(),
					),
					array(
						'label'     => esc_html__( 'Upload folder', 'quillforms' ),
						'label_raw' => 'Upload folder',
						'value'     => $this->get_upload_dir(),
					),
					array(
						'label'     => esc_html__( 'Upload folder permissions', 'quillforms' ),
						'label_raw' => 'Upload folder permissions',
						'value'     => $is_upload_dir_writable ? '✔ ' . esc_html__( 'Writable', 'quillforms' ) : '✘ ' . esc_html__( 'Not writable', 'quillforms' ),
						'value_raw' => $is_upload_dir_writable,
					),
					array(
						'label'     => esc_html__( 'Log level', 'quillforms' ),
						'label_raw' => 'Log level',
						'value'     => Settings::get( 'log_level', 'info' ),
					),
				),
			),
			array(
				'label'     => esc_html__( 'QuillForms database', 'quillforms' ),
				'label_raw' => 'QuillForms database',
				'items'     => $this->get_database_report_items(),
			),
			array(
				'label'     => esc_html__( 'Registered Addons', 'quillforms' ),
				'label_raw' => 'Registered Addons',
				'items'     => $this->get_registered_addons_items(),
			),
			array(
				'label'     => esc_html__( 'Action Scheduler', 'quillforms' ),
				'label_raw' => 'Action scheduler',
				'items'     => $this->action_scheduler_report_items(),
			),
		);

		/**
		 * Each item must has label & value keys, and may has label_raw & value_raw
		 */
		$quillforms_report = apply_filters( 'quillforms_system_status_quillforms_report', $quillforms_report );

		return $quillforms_report;
	}

	/**
	 * Get database report items
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	private function get_database_report_items() {
		$database_items = array(
			array(
				'label'     => esc_html__( 'Version', 'quillforms' ),
				'label_raw' => 'Version',
				'value'     => $this->get_database_version(),
			),
		);
		foreach ( $this->get_database_tables() as $table => $exists ) {
			$database_items[] = array(
				'label' => $table,
				'value' => $exists ? '✔' : '✘',
			);
		}
		return $database_items;
	}

	/**
	 * Get registered addons items
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	private function get_registered_addons_items() {
		$addons       = Addons_Manager::instance()->get_all_registered();
		$addons_items = array();
		foreach ( $addons as $slug => $addon ) {
			$addons_items[] = array(
				'label' => $addon->name,
				'value' => "$slug - $addon->version",
			);
		}
		return $addons_items;
	}

	/**
	 * Get action scheduler report items
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	private function action_scheduler_report_items() {
		$action_scheduler_info = $this->get_action_scheduler_info();
		if ( $action_scheduler_info ) {
			$action_scheduler_items = array(
				array(
					'label'     => esc_html__( 'Version', 'quillforms' ),
					'label_raw' => 'Version',
					'value'     => $action_scheduler_info['version'],
				),
				array(
					'label'     => esc_html__( 'Path', 'quillforms' ),
					'label_raw' => 'Path',
					'value'     => $action_scheduler_info['path'],
				),
				array(
					'label'     => esc_html__( 'Data Store', 'quillforms' ),
					'label_raw' => 'Data store',
					'value'     => $action_scheduler_info['datastore'],
				),
			);
		} else {
			$action_scheduler_items = array(
				array(
					'label'     => esc_html__( 'Version', 'quillforms' ),
					'label_raw' => 'Version',
					'value'     => '✘ ' . esc_html__( 'Not Installed', 'quillforms' ),
					'value_raw' => false,
				),
			);
		}
		return $action_scheduler_items;
	}

	/**
	 * Get upload dir
	 *
	 * @since 1.6.0
	 *
	 * @return string
	 */
	public function get_upload_dir() {
		return wp_upload_dir()['basedir'] . '/QuillForms/';
	}

	/**
	 * Is upload dir writable
	 *
	 * @since 1.6.0
	 *
	 * @return boolean
	 */
	public function is_upload_dir_writable() {
		$upload_path = $this->get_upload_dir();
		if ( ! is_dir( $upload_path ) ) {
			wp_mkdir_p( $upload_path );
		}
		return wp_is_writable( $upload_path );
	}

	/**
	 * Get locale
	 *
	 * @since 1.6.0
	 *
	 * @return string
	 */
	public function get_locale() {
		return apply_filters( 'plugin_locale', get_locale(), 'quillforms' );
	}

	/**
	 * Get database version
	 *
	 * @since 1.6.0
	 *
	 * @return string
	 */
	public function get_database_version() {
		return get_option( 'quillforms_version' );
	}

	/**
	 * Get database tables
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_database_tables() {
		global $wpdb;

		// It is not possible to get the database name from some classes that replace wpdb (e.g., HyperDB)
		// and that is why this if condition is needed.
		if ( ! defined( 'DB_NAME' ) ) {
			return array();
		}

		// plugin tables.
		$tables = array(
			'quillforms_themes',
			'quillforms_task_meta',
			'quillforms_log',
		);

		// get all database tables.
		$database_table_information = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT table_name
			FROM information_schema.TABLES
			WHERE table_schema = %s
			ORDER BY table_name ASC;',
				DB_NAME
			)
		);
		$database_tables            = array_map(
			function( $result ) {
				return $result->table_name;
			},
			$database_table_information
		);

		// check if tables exist.
		$result = array();
		foreach ( $tables as $table ) {
			$result[ $table ] = in_array( $wpdb->prefix . $table, $database_tables, true );
		}

		return $result;
	}

	/**
	 * Get action scheduler info
	 *
	 * @since 1.6.0
	 *
	 * @return array|false
	 */
	public function get_action_scheduler_info() {
		if ( ! class_exists( 'ActionScheduler_Versions' ) || ! class_exists( 'ActionScheduler' ) ) {
			return false;
		}

		return array(
			'version'   => ActionScheduler_Versions::instance()->latest_version(),
			'path'      => ActionScheduler::plugin_path( '' ),
			'datastore' => get_class( ActionScheduler_Store::instance() ),
		);
	}

}
