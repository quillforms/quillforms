<?php
/**
 * QuillForms.
 *
 * @since             1.0.0
 *
 * @wordpress-plugin
 * Plugin Name:       QuillForms
 * Plugin URI:        https://www.quillforms.com/
 * Description:       Conversational Forms Builder for WordPress
 * Version:           1.0.0
 * Author:            quillforms.com
 * Author URI:        https://www.quillforms.com/
 * Text Domain:       quillforms
 * Domain Path:       /languages
 * Requires at least: 5.4
 * Requires PHP: 7.1
 * Version: 1.0.0
 *
 * @package QuillForms
 */

defined( 'ABSPATH' ) || exit;

// Plugin file.
if ( ! defined( 'QF_PLUGIN_FILE' ) ) {
	define( 'QF_PLUGIN_FILE', __FILE__ );
}

// Plugin version.
if ( ! defined( 'QF_VERSION' ) ) {
	define( 'QF_VERSION', '1.0.0' );
}

// Plugin Folder Path.
if ( ! defined( 'QF_PLUGIN_DIR' ) ) {
	define( 'QF_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

// Plugin Folder URL.
if ( ! defined( 'QF_PLUGIN_URL' ) ) {
	define( 'QF_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

// Define minimum WP version.
define( 'QF_MIN_WP_VERSION', '5.4' );

// Define minimun php version.
define( 'QF_MIN_PHP_VERSION', '7.1' );

quillforms_pre_init();


/**
 * Verify that we can initialize QuillForms , then load it.
 *
 * @since 1.0.0
 */
function quillforms_pre_init() {
	global $wp_version;

	// Get unmodified $wp_version.
	include ABSPATH . WPINC . '/version.php';

	// Strip '-src' from the version string. Messes up version_compare().
	$version = str_replace( '-src', '', $wp_version );

	// Check for minimum WordPress version.
	if ( version_compare( $version, QF_MIN_WP_VERSION, '<' ) ) {
		add_action( 'admin_notices', 'quillforms_wordpress_version_notice' );
		return;
	}

	// Check for minimum PHP version.
	if ( version_compare( phpversion(), QF_MIN_PHP_VERSION, '<' ) ) {
		add_action( 'admin_notices', 'quillforms_php_version_notice' );
		return;
	}

	require_once QF_PLUGIN_DIR . '/includes/class-quillforms.php';
	QuillForms::instance();
	register_activation_hook( QF_PLUGIN_DIR, array( 'QF_Install', 'install' ) );
}

/**
 * Display a WordPress version notice and deactivate QuillForms plugin.
 *
 * @since 1.0.0
 */
function quillforms_wordpress_version_notice() {
	echo '<div class="error"><p>';
	/* translators: %s: Minimum required version */
	printf( __( 'QuillForms requires WordPress %s or later to function properly. Please upgrade WordPress before activating QuillForms.', 'quillforms' ), QF_MIN_WP_VERSION );
	echo '</p></div>';

	deactivate_plugins( array( 'QuillForms/quillforms.php' ) );
}


/**
 * Display a PHP version notice and deactivate QuillForms plugin.
 *
 * @since 1.0.0
 */
function quillforms_php_version_notice() {
	echo '<div class="error"><p>';
	/* translators: %s: Minimum required version */
	printf( __( 'QuillForms requires PHP %s or later to function properly. Please upgrade your PHP version before activating QuillForms.', 'quillforms' ), QF_MIN_PHP_VERSION );
	echo '</p></div>';

	deactivate_plugins( array( 'QuillForms/quillforms.php' ) );
}
