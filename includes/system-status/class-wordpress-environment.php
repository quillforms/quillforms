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
class WordPress_Environment {

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
		global $wp_version;

		$wp_cron_disabled  = defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON;
		$alternate_wp_cron = defined( 'ALTERNATE_WP_CRON' ) && ALTERNATE_WP_CRON;

		// dropins plugins.
		$dropins_plugins_items = array();
		$dropins_plugins       = $this->get_dropins_plugins();
		foreach ( $dropins_plugins as $plugin ) {
			$dropins_plugins_items[] = array(
				'label' => $plugin['name'],
				'value' => $plugin['plugin'],
			);
		}

		// mu plugins.
		$mu_plugins_items = array();
		$mu_plugins       = $this->get_mu_plugins();
		foreach ( $mu_plugins as $plugin ) {
			$mu_plugins_items[] = $this->get_plugin_report_item( $plugin );
		}

		// active plugins.
		$active_plugins_items = array();
		$active_plugins       = $this->get_active_plugins();
		foreach ( $active_plugins as $plugin ) {
			$active_plugins_items[] = $this->get_plugin_report_item( $plugin );
		}

		// inactive plugins.
		$inactive_plugins_items = array();
		$inactive_plugins       = $this->get_inactive_plugins();
		foreach ( $inactive_plugins as $plugin ) {
			$inactive_plugins_items[] = $this->get_plugin_report_item( $plugin );
		}

		$wordpress_report = array(
			array(
				'label'     => esc_html__( 'WordPress', 'quillforms' ),
				'label_raw' => 'WordPress',
				'items'     => array(
					array(
						'label'     => esc_html__( 'Home URL', 'quillforms' ),
						'label_raw' => 'Home URL',
						'value'     => get_home_url(),
					),
					array(
						'label'     => esc_html__( 'Site URL', 'quillforms' ),
						'label_raw' => 'Site URL',
						'value'     => get_site_url(),
					),
					array(
						'label'     => esc_html__( 'Version', 'quillforms' ),
						'label_raw' => 'Version',
						'value'     => $wp_version,
					),
					array(
						'label'     => esc_html__( 'Locale', 'quillforms' ),
						'label_raw' => 'Locale',
						'value'     => get_locale(),
					),
					array(
						'label'     => esc_html__( 'Multisite', 'quillforms' ),
						'label_raw' => 'Multisite',
						'value'     => is_multisite() ? esc_html__( 'ON', 'quillforms' ) : __( 'OFF', 'quillforms' ),
						'value_raw' => is_multisite(),
					),
					array(
						'label'     => esc_html__( 'Memory Limit', 'quillforms' ),
						'label_raw' => 'Memory Limit',
						'value'     => WP_MEMORY_LIMIT,
					),
					array(
						'label'     => esc_html__( 'GMT Offset', 'quillforms' ),
						'label_raw' => 'GMT Offset',
						'value'     => sprintf( '%+d', get_option( 'gmt_offset' ) ),
					),
					array(
						'label'     => esc_html__( 'Timezone', 'quillforms' ),
						'label_raw' => 'Timezone',
						'value'     => get_option( 'timezone_string' ),
					),
					array(
						'label'     => esc_html__( 'Debug Mode', 'quillforms' ),
						'label_raw' => 'Debug Mode',
						'value'     => WP_DEBUG ? esc_html__( 'ON', 'quillforms' ) : __( 'OFF', 'quillforms' ),
						'value_raw' => WP_DEBUG,
					),
					array(
						'label'     => esc_html__( 'Debug Log', 'quillforms' ),
						'label_raw' => 'Debug Log',
						'value'     => WP_DEBUG_LOG ? esc_html__( 'ON', 'quillforms' ) : __( 'OFF', 'quillforms' ),
						'value_raw' => WP_DEBUG_LOG,
					),
					array(
						'label'     => esc_html__( 'Script Debug Mode', 'quillforms' ),
						'label_raw' => 'Script Debug Mode',
						'value'     => SCRIPT_DEBUG ? esc_html__( 'ON', 'quillforms' ) : __( 'OFF', 'quillforms' ),
						'value_raw' => SCRIPT_DEBUG,
					),
					array(
						'label'     => esc_html__( 'Cron', 'quillforms' ),
						'label_raw' => 'Cron',
						'value'     => ! $wp_cron_disabled ? esc_html__( 'ON', 'quillforms' ) : __( 'OFF', 'quillforms' ),
						'value_raw' => ! $wp_cron_disabled,
					),
					array(
						'label'     => esc_html__( 'Alternate Cron', 'quillforms' ),
						'label_raw' => 'Alternate Cron',
						'value'     => $alternate_wp_cron ? esc_html__( 'ON', 'quillforms' ) : __( 'OFF', 'quillforms' ),
						'value_raw' => $alternate_wp_cron,
					),
				),
			),
			array(
				'label'     => esc_html__( 'Active Theme', 'quillforms' ),
				'label_raw' => 'Active Theme',
				'items'     => $this->get_active_theme_report_items(),
			),
			array(
				'label'     => esc_html__( 'Drop-in Plugins', 'quillforms' ),
				'label_raw' => 'Drop-in Plugins',
				'items'     => $dropins_plugins_items,
			),
			array(
				'label'     => esc_html__( 'MU Plugins', 'quillforms' ),
				'label_raw' => 'MU Plugins',
				'items'     => $mu_plugins_items,
			),
			array(
				'label'     => esc_html__( 'Active Plugins', 'quillforms' ),
				'label_raw' => 'Active Plugins',
				'items'     => $active_plugins_items,
			),
			array(
				'label'     => esc_html__( 'Inactive Plugins', 'quillforms' ),
				'label_raw' => 'Inactive Plugins',
				'items'     => $inactive_plugins_items,
			),
			array(
				'label'     => esc_html__( 'WordPress Database', 'quillforms' ),
				'label_raw' => 'WordPress Database',
				'items'     => $this->get_wordpress_database_report_items(),
			),
		);

		/**
		 * Each item must has label & value keys, and may has label & value_locale
		 */
		$wordpress_report = apply_filters( 'quillforms_system_status_wordpress_report', $wordpress_report );

		return $wordpress_report;
	}

	/**
	 * Get active theme items
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	private function get_active_theme_report_items() {
		$theme_info         = $this->get_theme_info();
		$active_theme_items = array(
			array(
				'label'     => esc_html__( 'Theme', 'quillforms' ),
				'label_raw' => 'Theme',
				'value'     => $theme_info['name'],
			),
			array(
				'label'     => esc_html__( 'Version', 'quillforms' ),
				'label_raw' => 'Version',
				'value'     => $theme_info['version'],
			),
			array(
				'label'     => esc_html__( 'URL', 'quillforms' ),
				'label_raw' => 'URL',
				'value'     => $theme_info['url'],
			),
			array(
				'label'     => esc_html__( 'Author URL', 'quillforms' ),
				'label_raw' => 'Author URL',
				'value'     => $theme_info['author_url'],
			),
		);
		// add parent theme items if exists.
		if ( $theme_info['is_child_theme'] ) {
			$active_theme_items = array_merge(
				$active_theme_items,
				array(
					array(
						'label'     => esc_html__( 'Parent theme', 'quillforms' ),
						'label_raw' => 'Parent theme',
						'value'     => $theme_info['parent_name'],
					),
					array(
						'label'     => esc_html__( 'Parent version', 'quillforms' ),
						'label_raw' => 'Parent version',
						'value'     => $theme_info['parent_version'],
					),
					array(
						'label'     => esc_html__( 'Parent URL', 'quillforms' ),
						'label_raw' => 'Parent URL',
						'value'     => $theme_info['parent_url'],
					),
					array(
						'label'     => esc_html__( 'Parent author URL', 'quillforms' ),
						'label_raw' => 'Parent author URL',
						'value'     => $theme_info['parent_author_url'],
					),
				)
			);
		}
		return $active_theme_items;
	}

	/**
	 * Get plugin export item
	 *
	 * @since 1.6.0
	 *
	 * @param array $plugin Plugin data.
	 * @return array
	 */
	private function get_plugin_report_item( $plugin ) {
		$item = array();

		// label.
		if ( ! empty( $plugin['url'] ) ) {
			$item['label'] = '<a href="' . esc_url( $plugin['url'] ) . '" aria-label="' . esc_attr__( 'Visit plugin homepage', 'quillforms' ) . '" target="_blank">' . esc_html( $plugin['name'] ) . '</a>';
		} else {
			$item['label'] = esc_html( $plugin['name'] );
		}

		// label_raw.
		$item['label_raw'] = strip_tags( $plugin['name'] );

		// value.
		$network_string = ( false !== $plugin['network_activated'] )
			? ' - <strong style="color: black;">' . esc_html__( 'Network enabled', 'quillforms' ) . '</strong>'
			: '';

		if ( ! empty( $plugin['author_url'] ) ) {
			$item['value'] = 'by <a href="' . esc_url( $plugin['author_url'] ) . '">' . esc_html( $plugin['author_name'] ) . '</a>' . ' - ' . $plugin['version'] . $network_string;
		} else {
			$item['value'] = 'by ' . $plugin['author_name'] . ' - ' . $plugin['version'] . $network_string;
		}

		// value_raw.
		$item['value_raw'] = $plugin['version']
			. '|' . $plugin['url']
			. '|' . ( false !== $plugin['network_activated'] ? 'network_activated' : '' )
			. '|by ' . $plugin['author_name'] . ':' . $plugin['author_url'];

		return $item;
	}

	/**
	 * Get WordPress database report items
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	private function get_wordpress_database_report_items() {
		$database_info = $this->get_database_info();
		if ( empty( $database_info ) ) {
			return array();
		}

		$database_items = array(
			array(
				'label'     => esc_html__( 'Prefix', 'quillforms' ),
				'label_raw' => 'Prefix',
				'value'     => $database_info['prefix'],
			),
			array(
				'label'     => esc_html__( 'Total Database Size', 'quillforms' ),
				'label_raw' => 'Total Database Size',
				'value'     => sprintf( '%.2fMB', $database_info['size']['data'] + $database_info['size']['index'] ),
			),
			array(
				'label'     => esc_html__( 'Database Data Size', 'quillforms' ),
				'label_raw' => 'Database Data Size',
				'value'     => sprintf( '%.2fMB', $database_info['size']['data'] ),
			),
			array(
				'label'     => esc_html__( 'Database Index Size', 'quillforms' ),
				'label_raw' => 'Database Index Size',
				'value'     => sprintf( '%.2fMB', $database_info['size']['index'] ),
			),
		);
		foreach ( $database_info['tables'] as $table => $table_data ) {
			$database_items[] = array(
				'label' => $table,
				/* Translators: %1$f: Table size, %2$f: Index size, %3$s Engine. */
				'value' => sprintf( esc_html__( 'Data: %1$.2fMB + Index: %2$.2fMB + Engine %3$s', 'quillforms' ), $table_data['data'], $table_data['index'], $table_data['engine'] ),
			);
		}

		return $database_items;
	}

	/**
	 * Get info of the current active theme, info of parent theme (if exists)
	 *
	 * @return array
	 */
	public function get_theme_info() {
		$active_theme = wp_get_theme();

		$active_theme_info = array(
			'name'           => $active_theme->name,
			'version'        => $active_theme->version,
			'url'            => $active_theme->get( 'ThemeURI' ),
			'author_url'     => $active_theme->get( 'AuthorURI' ),
			'is_child_theme' => is_child_theme(),
		);

		// add parent theme info (if exists).
		if ( is_child_theme() ) {
			$parent_theme      = wp_get_theme( $active_theme->template );
			$parent_theme_info = array(
				'parent_name'       => $parent_theme->name,
				'parent_url'        => $parent_theme->get( 'ThemeURI' ),
				'parent_version'    => $parent_theme->version,
				'parent_author_url' => $parent_theme->get( 'AuthorURI' ),
			);
		} else {
			$parent_theme_info = array();
		}

		return array_merge( $active_theme_info, $parent_theme_info );
	}


	/**
	 * Get a list of Dropins plugins.
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_dropins_plugins() {
		$plugins = array();

		$dropins_plugins = get_dropins();
		foreach ( $dropins_plugins as $key => $dropin ) {
			$plugins[] = array(
				'plugin' => $key,
				'name'   => $dropin['Name'],
			);
		}

		return $plugins;
	}

	/**
	 * Get a list of mu plugins.
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_mu_plugins() {
		$plugins = array();

		$mu_plugins = get_mu_plugins();
		foreach ( $mu_plugins as $plugin => $mu_plugin ) {
			$plugins['mu_plugins'][] = array(
				'plugin'      => $plugin,
				'name'        => $mu_plugin['Name'],
				'version'     => $mu_plugin['Version'],
				'url'         => $mu_plugin['PluginURI'],
				'author_name' => $mu_plugin['AuthorName'],
				'author_url'  => esc_url_raw( $mu_plugin['AuthorURI'] ),
			);
		}

		return $plugins;
	}

	/**
	 * Get a list of plugins active on the site.
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_active_plugins() {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		if ( ! function_exists( 'get_plugin_data' ) ) {
			return array();
		}

		$active_plugins = (array) get_option( 'active_plugins', array() );
		if ( is_multisite() ) {
			$network_activated_plugins = array_keys( get_site_option( 'active_sitewide_plugins', array() ) );
			$active_plugins            = array_merge( $active_plugins, $network_activated_plugins );
		}

		$active_plugins_data = array();

		foreach ( $active_plugins as $plugin ) {
			$data                  = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin );
			$active_plugins_data[] = $this->format_plugin_data( $plugin, $data );
		}

		return $active_plugins_data;
	}

	/**
	 * Get a list of inactive plugins on the site.
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_inactive_plugins() {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		if ( ! function_exists( 'get_plugins' ) ) {
			return array();
		}

		$plugins        = get_plugins();
		$active_plugins = (array) get_option( 'active_plugins', array() );

		if ( is_multisite() ) {
			$network_activated_plugins = array_keys( get_site_option( 'active_sitewide_plugins', array() ) );
			$active_plugins            = array_merge( $active_plugins, $network_activated_plugins );
		}

		$inactivate_plugins_data = array();

		foreach ( $plugins as $plugin => $data ) {
			if ( in_array( $plugin, $active_plugins, true ) ) {
				continue;
			}
			$inactivate_plugins_data[] = $this->format_plugin_data( $plugin, $data );
		}

		return $inactivate_plugins_data;
	}

	/**
	 * Format plugin data into a standard format.
	 *
	 * @since 1.6.0
	 *
	 * @param string $plugin Plugin directory/file.
	 * @param array  $data Plugin data from WP.
	 * @return array Formatted data.
	 */
	private function format_plugin_data( $plugin, $data ) {
		return array(
			'plugin'            => $plugin,
			'name'              => $data['Name'],
			'version'           => $data['Version'],
			'url'               => $data['PluginURI'],
			'author_name'       => $data['AuthorName'],
			'author_url'        => esc_url_raw( $data['AuthorURI'] ),
			'network_activated' => $data['Network'],
		);
	}

	/**
	 * Get array of database information. prefix, size and tables.
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_database_info() {
		global $wpdb;

		// It is not possible to get the database name from some classes that replace wpdb (e.g., HyperDB)
		// and that is why this if condition is needed.
		if ( ! defined( 'DB_NAME' ) ) {
			return array();
		}

		$tables        = array();
		$database_size = array(
			'data'  => 0,
			'index' => 0,
		);

		$database_table_information = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT
					table_name AS 'name',
					engine AS 'engine',
					round( ( data_length / 1024 / 1024 ), 2 ) 'data',
					round( ( index_length / 1024 / 1024 ), 2 ) 'index'
				FROM information_schema.TABLES
				WHERE table_schema = %s
				ORDER BY name ASC;",
				DB_NAME
			)
		);

		$site_tables_prefix = $wpdb->get_blog_prefix( get_current_blog_id() );
		$global_tables      = $wpdb->tables( 'global', true );
		foreach ( $database_table_information as $table ) {
			// Only include tables matching the prefix of the current site, this is to prevent displaying all tables on a MS install not relating to the current.
			if ( is_multisite() && 0 !== strpos( $table->name, $site_tables_prefix ) && ! in_array( $table->name, $global_tables, true ) ) {
				continue;
			}
			$tables[ $table->name ] = array(
				'data'   => $table->data,
				'index'  => $table->index,
				'engine' => $table->engine,
			);

			$database_size['data']  += $table->data;
			$database_size['index'] += $table->index;
		}

		// Return all database info. Described by JSON Schema.
		return array(
			'prefix' => $wpdb->prefix,
			'tables' => $tables,
			'size'   => $database_size,
		);
	}

}
