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
		// set addons updates data.
		add_filter( 'pre_set_site_transient_update_plugins', array( $this, 'init_addons_updates' ) );

		// filter addon plugins info.
		add_filter( 'plugins_api', array( $this, 'filter_plugins_api' ), 10, 3 );

		// add additional messages to addon plugin row.
		foreach ( Store::instance()->get_all_addons( true ) as $plugin ) {
			add_action(
				'in_plugin_update_message-' . $plugin['plugin_file'],
				function() use ( $plugin ) {
					$this->add_in_plugin_update_message( $plugin );
				},
				10
			);
		}

		// clear addons updates cache on upgrader process complete.
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
	 * Init addon updates
	 *
	 * @since 1.21.0
	 *
	 * @param object $transient Transient to filter.
	 * @return object
	 */
	public function init_addons_updates( $transient ) {
		$updates_data = $this->get_addons_updates();

		foreach ( Store::instance()->get_all_addons( true ) as $addon_slug => $plugin ) {
			if ( $plugin['is_installed'] ) {
				$plugin_basename = plugin_basename( $plugin['full_plugin_file'] );

				$new_version = $updates_data[ $addon_slug ]->new_version ?? null;
				if ( $new_version && version_compare( $plugin['version'], $new_version, '<' ) ) {
					$transient->response[ $plugin_basename ] = $updates_data[ $addon_slug ];
					unset( $transient->no_update[ $plugin_basename ] );
				} else {
					$transient->no_update[ $plugin_basename ] = $updates_data[ $addon_slug ];
					unset( $transient->response[ $plugin_basename ] );
				}
			}
		}

		return $transient;
	}

	/**
	 * Filter plugins_api
	 *
	 * @since 1.21.0
	 *
	 * @param false|object|array $result Result.
	 * @param string             $action Action.
	 * @param object             $args Args.
	 * @return false|object|array
	 */
	public function filter_plugins_api( $result, $action, $args ) {
		if ( 'plugin_information' !== $action || empty( $args->slug ) ) {
			return $result;
		}

		$updates_data      = $this->get_addons_updates();
		$addon_update_data = quillforms_objects_find( $updates_data, 'slug', $args->slug );
		if ( $addon_update_data ) {
			return $addon_update_data;
		}

		return $result;
	}

	/**
	 * Get addons updates data
	 *
	 * @since 1.21.0
	 *
	 * @return array
	 */
	private function get_addons_updates() {
		// get updates payload.
		$payload = array(
			'edd_action' => 'get_version',
			'products'   => array(),
			'versions'   => Site::instance()->get_api_versions_param(),
		);

		$license     = get_option( 'quillforms_license' );
		$license_key = ! empty( $license ) ? $license['key'] : '';

		foreach ( Store::instance()->get_all_addons( true ) as $addon_slug => $plugin ) {
			if ( $plugin['is_installed'] ) {
				$payload['products'][ $addon_slug ] = array(
					'action'  => 'get_version',
					'license' => $license_key,
					'item_id' => "{$addon_slug}_addon",
					'version' => $plugin['version'],
					'slug'    => basename( $plugin['full_plugin_file'], '.php' ),
					'author'  => 'quillforms.com',
					'url'     => home_url(),
					'beta'    => false,
				);
			}
		}

		// check transient cache.
		$hash      = md5( wp_json_encode( $payload ) );
		$cache_key = 'quillforms_addons_updates';
		$transient = get_transient( $cache_key );
		if ( $transient && hash_equals( $hash, $transient['hash'] ) ) {
			return $transient['data'];
		}

		// get updates from the site api.
		$response = Site::instance()->api_request( $payload );
		if ( ! $response['success'] || ! $response['data'] ) {
			return array();
		}

		// prepare data.
		$data = array();
		foreach ( $response['data'] as $addon_slug => $item ) {
			if ( Store::instance()->get_addon( $addon_slug ) ) {
				$data[ $addon_slug ] = (object) array();
				foreach ( $item as $key => $value ) {
					$data[ $addon_slug ]->{$key} = maybe_unserialize( $value );
				}
			}
		}

		// set transient cache.
		$transient = array(
			'hash' => $hash,
			'data' => $data,
			'time' => time(),
		);
		set_transient( $cache_key, $transient, 4 * HOUR_IN_SECONDS );

		return $data;
	}

	/**
	 * Add addon update message.
	 *
	 * @since 1.21.0
	 *
	 * @param array $plugin Plugin.
	 * @return void
	 */
	private function add_in_plugin_update_message( $plugin ) {
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
	}

	/**
	 * Clear addons update cache
	 *
	 * @since 1.21.0
	 *
	 * @return void
	 */
	public function clear_addons_update_cache() {
		// delete updates transient.
		delete_transient( 'quillforms_addons_updates' );

		// clear wp plugins cache.
		if ( ! function_exists( 'wp_clean_plugins_cache' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		wp_clean_plugins_cache();
	}

}
