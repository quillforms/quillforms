<?php
/**
 * Install: class QF_Install
 *
 * @since 1.0.0
 * @package QuillForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class QF_Install is responsible for main set up and creating needed database tables.
 *
 * @since 1.0.0
 */
class QF_Install {

	/**
	 * Init
	 *
	 * @since 1.0.0
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'check_version' ), 5 );
	}

	/**
	 * Check Quill forms version and run the updater is required.
	 *
	 * This check is done on all requests and runs if the versions do not match.
	 */
	public static function check_version() {
		if ( version_compare( get_option( 'quillforms_version' ), QuillForms::instance()->version, '<' ) ) {
			self::install();
			do_action( 'quillforms_updated' );
		}
	}

	/**
	 * Install QuillForms
	 *
	 * @since 1.0.0
	 * @static
	 */
	public static function install() {
		// Check if we are not already running this routine.
		if ( 'yes' === get_transient( 'qf_installing' ) ) {
			return;
		}

		// If we made it till here nothing is running yet, lets set the transient now.
		set_transient( 'qf_installing', 'yes', MINUTE_IN_SECONDS * 10 );

		self::create_tables();
		self::update_qf_version();

		delete_transient( 'qf_installing' );

	}

	/**
	 * Create DB Tables
	 *
	 * @since 1.0.0
	 */
	public static function create_tables() {
		global $wpdb;

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		$collate = '';

		if ( $wpdb->has_cap( 'collation' ) ) {
			$collate = $wpdb->get_charset_collate();
		}

		$sql = "
			CREATE TABLE {$wpdb->prefix}quillforms_themes (
			    ID mediumint(8) unsigned NOT NULL auto_increment,
				theme_data longtext NOT NULL,
				title varchar(50) NOT NULL,
				author bigint(20) unsigned NOT NULL default '0',
				date_created datetime NOT NULL default '0000-00-00 00:00:00',
				date_updated datetime default '0000-00-00 00:00:00',
				PRIMARY KEY  (ID)
			);
			CREATE TABLE {$wpdb->prefix}quillforms_log (
				log_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				timestamp datetime NOT NULL,
				level smallint(4) NOT NULL,
				source varchar(200) NOT NULL,
				message longtext NOT NULL,
				context longtext NULL,
				PRIMARY KEY (log_id),
				KEY level (level)
			) $collate;";

		dbDelta( $sql );

	}

	/**
	 * Update QuillForms version to current.
	 *
	 * @since 1.0.0
	 */
	private static function update_qf_version() {
		delete_option( 'quillforms_version' );
		add_option( 'quillforms_version', QuillForms::instance()->version );
	}

}

QF_Install::init();
