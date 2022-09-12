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
		add_action(
			'upgrader_process_complete',
			function() {
				update_option( 'quillforms_addons_update_cache_needs_clear', true );
			}
		);
		if ( get_option( 'quillforms_addons_update_cache_needs_clear' ) ) {
			update_option( 'quillforms_addons_update_cache_needs_clear', false );
			$this->clear_addons_update_cache();
		}
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
				// init edd updater class.
				new EDD_Plugin_Updater(
					'https://quillforms.com',
					$plugin['full_plugin_file'],
					array(
						'version' => $plugin['version'],
						'license' => $license_key,
						'item_id' => "{$addon_slug}_addon",
						'author'  => 'quillforms.com',
						'beta'    => false,
					)
				);

				// adding quillforms version to addon api params.
				$full_plugin_file = $plugin['full_plugin_file'];
				add_filter(
					'edd_sl_plugin_updater_api_params',
					function( $api_params, $api_data, $plugin_file ) use ( $full_plugin_file ) {
						if ( $plugin_file === $full_plugin_file ) {
							$api_params = array_merge(
								$api_params,
								Site::instance()->get_api_versions_params()
							);
						}
						return $api_params;
					},
					10,
					3
				);

				add_action(
					'in_plugin_update_message-' . $plugin['plugin_file'],
					function() use ( $plugin ) {
						$license_info = License::instance()->get_license_info();
						$license_page = esc_url( admin_url( 'admin.php?page=quillforms&path=license' ) );

						// invalid license.
						if ( ! $license_info || 'valid' !== $license_info['status'] ) {
							echo '&nbsp;<strong><a href="' . $license_page . '">' . esc_html__( 'Enter valid license key for automatic updates.', 'quillforms' ) . '</a></strong>';
							return;
						}

						// lower plan.
						if ( ! License::instance()->is_plan_accessible( $license_info['plan'], $plugin['plan'] ) ) {
							echo '&nbsp;<strong><a href="' . $license_page . '">' . esc_html__( 'Upgrade your license for automatic updates.', 'quillforms' ) . '</a></strong>';
							return;
						}
					},
					10
				);
			}
		}
	}

	/**
	 * Clear addons update cache
	 *
	 * @since 1.6.0
	 *
	 * @param string|null $license_key License key to clear cache for. if null provided, current license key will be used.
	 * @return boolean
	 */
	public function clear_addons_update_cache( $license_key = null ) {
		if ( null === $license_key ) {
			$license     = get_option( 'quillforms_license' );
			$license_key = empty( $license['key'] ) ? null : $license['key'];
		}

		// clear edd plugin updater cache.
		foreach ( Store::instance()->get_all_addons( true ) as $plugin ) {
			$slug = basename( $plugin['full_plugin_file'], '.php' );
			$beta = false;

			// clear cache with license.
			if ( ! empty( $license_key ) ) {
				$cache_key = 'edd_sl_' . md5( serialize( $slug . $license_key . $beta ) );
				delete_option( $cache_key );
			}

			// clear cache without license.
			$cache_key = 'edd_sl_' . md5( serialize( $slug . $beta ) );
			delete_option( $cache_key );
		}

		// clear wp plugins cache.
		if ( ! function_exists( 'wp_clean_plugins_cache' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		wp_clean_plugins_cache();

		return true;
	}

}
