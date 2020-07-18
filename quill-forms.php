<?php
/**
 * Quill Forms.
 *
 * @since             1.0.0
 *
 * @wordpress-plugin
 * Plugin Name:       Quill Forms
 * Plugin URI:        https://www.quillforms.com/
 * Description:       Conversational Form builder for WordPress
 * Version:           1.0.0
 * Author:            quillforms.com
 * Author URI:        https://www.quillforms.com/
 * Text Domain:       quillforms
 * Domain Path:       /languages
 * @package           QuillForms
 */

defined( 'ABSPATH' ) || exit;


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



if ( ! class_exists( 'QuillForms' ) ) {
	require_once dirname( QF_PLUGIN_FILE ) . '/includes/class-quillforms.php';
}

QuillForms::instance();
