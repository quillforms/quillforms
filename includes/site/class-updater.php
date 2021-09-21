<?php
/**
 * Class: Updater
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Site;

/**
 * Updater Class
 *
 * @since 1.6.0
 */
class Updater {

	/**
	 * Class instance
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
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
		add_action( 'init', array( $this, 'init_addon_updater' ) );
	}

	/**
	 * Initialize updaters for installed store addons
	 *
	 * @return void
	 */
	public function init_addon_updater() {
		// To support auto-updates, this needs to run during the wp_version_check cron job for privileged users.
		$doing_cron = defined( 'DOING_CRON' ) && DOING_CRON;
		if ( ! current_user_can( 'manage_options' ) && ! $doing_cron ) {
			return;
		}

		$license     = get_option( 'quillforms_license' );
		$license_key = ! empty( $license ) ? $license['key'] : '';

		foreach ( Store::instance()->get_all_addons( true ) as $addon_slug => $plugin ) {
			if ( $plugin['is_installed'] ) {
				new EDD_Plugin_Updater(
					'http://172.17.0.1:8040', // TODO: use store url.
					$plugin['full_plugin_file'],
					array(
						'version' => $plugin['version'],
						'license' => $license_key,
						'item_id' => "{$addon_slug}_addon",
						'author'  => 'quillforms.com',
						'beta'    => false,
					)
				);
			}
		}
	}

}
