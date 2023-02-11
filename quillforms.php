<?php
/**
 * Plugin Name:       Quill Forms
 * Plugin URI:        https://www.quillforms.com/
 * Description:       Conversational Forms Builder for WordPress
 * Version:           2.1.0
 * Author:            quillforms.com
 * Author URI:        http://www.quillforms.com
 * Text Domain:       quillforms
 * Requires at least: 5.4
 * Requires PHP: 7.1
 *
 * @package QuillForms
 */

defined('ABSPATH') || exit;

// Plugin file.
if (! defined('QUILLFORMS_PLUGIN_FILE') ) {
    define('QUILLFORMS_PLUGIN_FILE', __FILE__);
}

// Plugin version.
if (! defined('QUILLFORMS_VERSION') ) {
    define('QUILLFORMS_VERSION', '2.1.0');
}

// Plugin Folder Path.
if (! defined('QUILLFORMS_PLUGIN_DIR') ) {
    define('QUILLFORMS_PLUGIN_DIR', plugin_dir_path(__FILE__));
}

// Plugin Folder URL.
if (! defined('QUILLFORMS_PLUGIN_URL') ) {
    define('QUILLFORMS_PLUGIN_URL', plugin_dir_url(__FILE__));
}

// Define minimum WP version.
define('QUILLFORMS_MIN_WP_VERSION', '5.4');

// Define minimun php version.
define('QUILLFORMS_MIN_PHP_VERSION', '7.1');

// Require dependencies.
require_once QUILLFORMS_PLUGIN_DIR . 'dependencies/libraries/load.php';
require_once QUILLFORMS_PLUGIN_DIR . 'dependencies/vendor/autoload.php';

// Require autoload.
require_once QUILLFORMS_PLUGIN_DIR . 'includes/autoload.php';

quillforms_pre_init();


/**
 * Verify that we can initialize QuillForms , then load it.
 *
 * @since 1.0.0
 */
function quillforms_pre_init()
{
    global $wp_version;

    // Get unmodified $wp_version.
    include ABSPATH . WPINC . '/version.php';

    // Strip '-src' from the version string. Messes up version_compare().
    $version = str_replace('-src', '', $wp_version);

    // Check for minimum WordPress version.
    if (version_compare($version, QUILLFORMS_MIN_WP_VERSION, '<') ) {
        add_action('admin_notices', 'quillforms_wordpress_version_notice');
        return;
    }

    // Check for minimum PHP version.
    if (version_compare(phpversion(), QUILLFORMS_MIN_PHP_VERSION, '<') ) {
        add_action('admin_notices', 'quillforms_php_version_notice');
        return;
    }

    QuillForms\QuillForms::instance();
    register_activation_hook(QUILLFORMS_PLUGIN_DIR, array( QuillForms\Install::class, 'install' ));

    // do quillforms_loaded action.
    add_action(
        'plugins_loaded',
        function () {
            do_action('quillforms_loaded');
        }
    );
}

/**
 * Display a WordPress version notice and deactivate QuillForms plugin.
 *
 * @since 1.0.0
 */
function quillforms_wordpress_version_notice()
{
    echo '<div class="error"><p>';
    /* translators: %s: Minimum required version */
    printf(__('QuillForms requires WordPress %s or later to function properly. Please upgrade WordPress before activating QuillForms.', 'quillforms'), QUILLFORMS_MIN_WP_VERSION);
    echo '</p></div>';

    deactivate_plugins('quillforms/quillforms.php');
}


/**
 * Display a PHP version notice and deactivate QuillForms plugin.
 *
 * @since 1.0.0
 */
function quillforms_php_version_notice()
{
    echo '<div class="error"><p>';
    /* translators: %s: Minimum required version */
    printf(__('QuillForms requires PHP %s or later to function properly. Please upgrade your PHP version before activating QuillForms.', 'quillforms'), QUILLFORMS_MIN_PHP_VERSION);
    echo '</p></div>';

    deactivate_plugins('quillforms/quillforms.php');
}
