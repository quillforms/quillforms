<?php
/**
 * Plugin Name:       Quill Forms
 * Plugin URI:        https://www.quillforms.com/
 * Description:       Conversational Forms Builder for WordPress
 * Version:           5.2.0
 * Author:            quillforms.com
 * Author URI:        http://www.quillforms.com
 * Text Domain:       quillforms
 * Domain Path        /languages
 * Requires at least: 5.4
 * Tested up to:      6.7.1
 * Requires PHP: 7.1
 *
 * @package QuillForms
 */

defined( 'ABSPATH' ) || exit;

// Plugin file.
if ( ! defined( 'QUILLFORMS_PLUGIN_FILE' ) ) {
	define( 'QUILLFORMS_PLUGIN_FILE', __FILE__ );
}

// Plugin version.
if ( ! defined( 'QUILLFORMS_VERSION' ) ) {
	define( 'QUILLFORMS_VERSION', '5.2.0' );
}

// Plugin Folder Path.
if ( ! defined( 'QUILLFORMS_PLUGIN_DIR' ) ) {
	define( 'QUILLFORMS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

// Plugin Folder URL.
if ( ! defined( 'QUILLFORMS_PLUGIN_URL' ) ) {
	define( 'QUILLFORMS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

// Define minimum WP version.
define( 'QUILLFORMS_MIN_WP_VERSION', '5.4' );

// Define minimun php version.
define( 'QUILLFORMS_MIN_PHP_VERSION', '7.1' );

// Require dependencies.
require_once QUILLFORMS_PLUGIN_DIR . 'dependencies/libraries/load.php';
require_once QUILLFORMS_PLUGIN_DIR . 'dependencies/vendor/autoload.php';

// Do version checks early
quillforms_pre_init();

// Suppress the WordPress 6.7+ notice and load textdomain immediately
add_filter( 'doing_it_wrong_trigger_error', 'quillforms_suppress_translation_notice', 10, 2 );

// Load textdomain immediately before QuillForms initializes
quillforms_load_textdomain_early();

// Initialize QuillForms on plugins_loaded as normal
add_action( 'plugins_loaded', 'quillforms_initialize_main' );

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
	if ( version_compare( $version, QUILLFORMS_MIN_WP_VERSION, '<' ) ) {
		add_action( 'admin_notices', 'quillforms_wordpress_version_notice' );
		return;
	}

	// Check for minimum PHP version.
	if ( version_compare( phpversion(), QUILLFORMS_MIN_PHP_VERSION, '<' ) ) {
		add_action( 'admin_notices', 'quillforms_php_version_notice' );
		return;
	}
}

/**
 * Suppress WordPress 6.7+ translation timing notice
 */
function quillforms_suppress_translation_notice( $trigger, $function ) {
	if ( '_load_textdomain_just_in_time' === $function ) {
		return false;
	}
	return $trigger;
}

/**
 * Load textdomain early (before QuillForms initializes)
 */
function quillforms_load_textdomain_early() {
	load_plugin_textdomain(
		'quillforms',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}

/**
 * Initialize QuillForms after textdomain is ready
 */
function quillforms_initialize_main() {
	// QuillForms initialization
	require_once QUILLFORMS_PLUGIN_DIR . 'includes/autoload.php';
	QuillForms\QuillForms::instance();
	
	register_activation_hook( QUILLFORMS_PLUGIN_FILE, array( QuillForms\Install::class, 'install' ) );
	
	do_action( 'quillforms_loaded' );
}

/**
 * Display a WordPress version notice and deactivate QuillForms plugin.
 *
 * @since 1.0.0
 */
function quillforms_wordpress_version_notice() {
	echo '<div class="error"><p>';
	echo 'QuillForms requires WordPress ' . QUILLFORMS_MIN_WP_VERSION . ' or later to function properly. Please upgrade WordPress before activating QuillForms.';
	echo '</p></div>';

	deactivate_plugins( 'quillforms/quillforms.php' );
}

/**
 * Display a PHP version notice and deactivate QuillForms plugin.
 *
 * @since 1.0.0
 */
function quillforms_php_version_notice() {
	echo '<div class="error"><p>';
	echo 'QuillForms requires PHP ' . QUILLFORMS_MIN_PHP_VERSION . ' or later to function properly. Please upgrade your PHP version before activating QuillForms.';
	echo '</p></div>';

	deactivate_plugins( 'quillforms/quillforms.php' );
}