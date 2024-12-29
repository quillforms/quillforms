<?php

/**
 * Install: class Install
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms;
use QuillForms\Site\License;

use QuillForms\Managers\Addons_Manager;

/**
 * Class Install is responsible for main set up.
 * create needed database tables.
 * assign capabilities to user roles.
 *
 * @since 1.0.0
 */
class Install {


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
		self::deactivate_old_entries_addon();
		if ( version_compare( get_option( 'quillforms_version' ), QUILLFORMS_VERSION, '<' ) ) {
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
		if ( 'yes' === get_transient( 'quillforms_installing' ) ) {
			return;
		}

		// If we made it till here nothing is running yet, lets set the transient now.
		set_transient( 'quillforms_installing', 'yes', MINUTE_IN_SECONDS * 10 );

		Core::register_quillforms_post_type();
		Capabilities::assign_capabilities_for_user_roles();
		self::version_4_migration();
		self::create_tables();
		self::version_1_7_5_migration();
		self::version_3_5_7_migration();
		self::create_cron_jobs();
		self::update_quillforms_version();

		delete_transient( 'quillforms_installing' );
	}

	/**
	 * Create DB Tables
	 *
	 * @since 1.0.0
	 */
	public static function create_tables() {
		global $wpdb;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE {$wpdb->prefix}quillforms_themes (
			    ID mediumint(8) unsigned NOT NULL auto_increment,
				theme_properties longtext NOT NULL,
				theme_title varchar(50) NOT NULL,
				theme_author bigint(20) unsigned NOT NULL default '0',
				date_created datetime NOT NULL,
				date_updated datetime,
				PRIMARY KEY  (ID)
			) $charset_collate;
			CREATE TABLE {$wpdb->prefix}quillforms_task_meta (
				ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				action_id BIGINT UNSIGNED,
				hook varchar(255) NOT NULL,
				group_slug varchar(255) NOT NULL,
				value longtext NOT NULL,
				date_created datetime NOT NULL,
				PRIMARY KEY  (ID),
				KEY action_id (action_id)
			) $charset_collate;
			CREATE TABLE {$wpdb->prefix}quillforms_entries (
				ID bigint(20) unsigned NOT NULL auto_increment,
				form_id bigint(20) unsigned NOT NULL,
				is_starred tinyint(1) DEFAULT 0,
				is_read tinyint(1) DEFAULT 0,
				status varchar(50) DEFAULT 'completed',
				hash_id varchar(255) DEFAULT NULL,
				date_created datetime NOT NULL,
				date_updated datetime NOT NULL,
				PRIMARY KEY  (ID),
				KEY form_id (form_id)
			) $charset_collate;
			CREATE TABLE {$wpdb->prefix}quillforms_entry_records (
				ID bigint(20) unsigned NOT NULL auto_increment,
				form_id bigint(20) unsigned NOT NULL,
				entry_id bigint(20) unsigned NOT NULL,
				record_type varchar(50) NOT NULL,
				record_id varchar(50) NOT NULL,
				record_value longtext NOT NULL,
				PRIMARY KEY  (ID),
				KEY entry_id (entry_id)
			) $charset_collate;
			CREATE TABLE {$wpdb->prefix}quillforms_entry_meta (
				ID bigint(20) unsigned NOT NULL auto_increment,
				form_id bigint(20) unsigned,
				entry_id bigint(20) unsigned NOT NULL,
				meta_key varchar(50) NOT NULL,
				meta_value longtext NOT NULL,
				PRIMARY KEY  (ID),
				KEY entry_id (entry_id),
				KEY meta_key (meta_key)
			) $charset_collate;
			CREATE TABLE {$wpdb->prefix}quillforms_pending_submissions (
				ID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				form_id BIGINT UNSIGNED,
				step varchar(255) NOT NULL,
				entry longtext NOT NULL,
				form_data longtext NOT NULL,
				date_created datetime NOT NULL,
				hash_id varchar(50) DEFAULT NULL,
				PRIMARY KEY  (ID),
				KEY form_id (form_id)
			) $charset_collate;
			CREATE TABLE {$wpdb->prefix}quillforms_log (
				log_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				timestamp datetime NOT NULL,
				level smallint(4) NOT NULL,
				source varchar(200) NOT NULL,
				message longtext NOT NULL,
				context longtext NULL,
				PRIMARY KEY (log_id),
				KEY level (level)
			) $charset_collate;";

		dbDelta( $sql );
	}

	/**
	 * Version 1.7.5 migration
	 * - Fix charset collate for v1.7.4 and below
	 *
	 * @since 1.7.5
	 *
	 * @return void
	 */
	private static function version_1_7_5_migration() {
		 global $wpdb;

		$version = get_option( 'quillforms_version' );
		// skip new installations.
		if ( ! $version ) {
			return;
		}

		// fix charset collate.
		if ( version_compare( $version, '1.7.5', '<' ) ) {
			$charset_collate = '';
			if ( ! empty( $wpdb->charset ) ) {
				$charset_collate = "character set $wpdb->charset";
			}
			if ( ! empty( $wpdb->collate ) ) {
				$charset_collate .= " collate $wpdb->collate";
			}

			if ( $charset_collate ) {
				$wpdb->query("alter table {$wpdb->prefix}quillforms_themes convert to $charset_collate;"); // phpcs:ignore
				$wpdb->query("alter table {$wpdb->prefix}quillforms_task_meta convert to $charset_collate;"); // phpcs:ignore
			}
		}
	}

	/**
	 * Version 3.5.7 migration
	 * Add new columns 'hash_id' and 'token' to quillforms_pending_submissions table (both can be null)
	 *
	 * @since 3.5.7
	 */
	public static function version_3_5_7_migration() {
		global $wpdb;
		$version = get_option( 'quillforms_version' );
		if ( version_compare( $version, '3.5.7', '<' ) ) {
			$sql = "ALTER TABLE {$wpdb->prefix}quillforms_pending_submissions 
					ADD hash_id varchar(50) DEFAULT NULL";
			dbDelta( $sql );
		}
	}

	/**
	 * Version next.version migration
	 * - Add status and hash_id columns to entries table.
	 *
	 * @since next.version
	 *
	 * @return void
	 */
	private static function version_4_migration() {
		global $wpdb;
		error_log( 'version_4_migration' );
		$version = get_option( 'quillforms_version' );
		if ( ! $version ) {
			return;
		}

		// deactivate old entries add-on.
		self::deactivate_old_entries_addon();

		if ( version_compare( $version, '4.0.0', '<' ) ) {
			$entries_table = $wpdb->prefix . 'quillforms_entries';
			if ( $wpdb->get_var( "SHOW TABLES LIKE '$entries_table'" ) !== $entries_table ) {
				return;
			}

			$wpdb->query( "ALTER TABLE {$wpdb->prefix}quillforms_entries ADD COLUMN `status` VARCHAR(50) DEFAULT 'completed' AFTER `is_read`;" );
			$wpdb->query( "ALTER TABLE {$wpdb->prefix}quillforms_entries ADD COLUMN `hash_id` VARCHAR(255) DEFAULT NULL AFTER `status`;" );
		}
	}

	/**
	 * Deactivate old entries add-on
	 *
	 * @since next.version
	 *
	 * @return void
	 */
	private static function deactivate_old_entries_addon() {
		if ( ! function_exists( 'is_plugin_active' ) || ! function_exists( 'deactivate_plugins' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}

		$plugin_path = 'quillforms-entries/quillforms-entries.php';
		if ( is_plugin_active( $plugin_path ) ) {
			deactivate_plugins( $plugin_path );
		}
	}


	// /**
	// * Version 2.13.4 migration
	// *
	// * @since version 2.13.4
	// *
	// * Add branded "powered by"
	// */
	// public static function version_2_13_4_migration() {
	// if (version_compare($version, '3.0.2', '<')) {
	// $license = License::instance()->get_license_info();
	// if( !isset($license) || empty($license) || $license['status'] !== 'valid') return;
	// $forms = get_posts( array(
	// 'post_type' => 'quill_forms',
	// 'posts_per_page' => -1,
	// ) );
	// for all forms add a setting in the form settings to enable the branded powered by if the form is free
	// if( !empty($forms)) {
	// foreach ( $forms as $form ) {
	// $settings = get_post_meta( $form->ID, 'settings', true );
	// if ( !isset($settings) || empty($settings) ) {
	// $settings = array();
	// }
	// if ( ! isset( $settings['displayBranding'] ) ) {
	// $settings['displayBranding'] = false;
	// update_post_meta( $form->ID, 'settings', $settings );
	// }
	// }
	// }
	// }
	// }

	/**
	 * Create cron jobs (clear them first).
	 */
	private static function create_cron_jobs() {
		wp_clear_scheduled_hook( 'quillforms_cleanup_logs' );

		wp_schedule_event( time() + ( 3 * HOUR_IN_SECONDS ), 'daily', 'quillforms_cleanup_logs' );
	}

	/**
	 * Update QuillForms version to current.
	 *
	 * @since 1.0.0
	 */
	private static function update_quillforms_version() {
		delete_option( 'quillforms_version' );
		add_option( 'quillforms_version', QUILLFORMS_VERSION );
	}
}
