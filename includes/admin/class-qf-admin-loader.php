<?php
/**
 * Admin: class QF_Admin_Loader
 *
 * @since 1.0.0
 * @package Admin
 * @subpackage Loader
 */

/**
 * Register the scripts, styles, and includes needed for pieces of the QuillForms Admin experience.
 */
class QF_Admin_Loader {
	/**
	 * App entry point.
	 */
	const APP_ENTRY_POINT = 'quillforms';

	/**
	 * Class instance.
	 *
	 * @var Loader instance
	 */
	protected static $instance = null;

	/**
	 * Get class instance.
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Returns true if we are on a JS powered admin page.
	 */
	public static function is_admin_page() {
		return qf_admin_is_registered_page();
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'add_inline_scripts' ), 14 );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'localize_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'remove_all_scripts' ), 999 );

		add_action( 'admin_head', array( __CLASS__, 'remove_notices' ) );
		add_action( 'admin_notices', array( __CLASS__, 'inject_before_notices' ), -9999 );
		add_action( 'admin_notices', array( __CLASS__, 'inject_after_notices' ), PHP_INT_MAX );

		// add_action( 'admin_head', array( __CLASS__, 'remove_app_entry_page_menu_item' ), 20 );

		/*
		* Remove the emoji script.
		* We have faced an issue when using emojis with Slate React rich text editor; they were converted to images.
		* Now after removing this action, they are working correctly.
		*/
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	}

	/**
	 * Localize scripts
	 *
	 * @since 1.0.0
	 */
	public static function localize_scripts() {
		wp_localize_script(
			'quillforms-client',
			'qfAdmin',
			array(
				'assetsBuildUrl' => QF_PLUGIN_URL,
			)
		);
	}

	/**
	 * Remove all scripts
	 *
	 * @since 1.0.0
	 */
	public function remove_all_scripts() {
		global $wp_scripts;

		if ( self::is_admin_page() ) {
			$wp_scripts->queue = array( 'jquery' );
			wp_enqueue_media();
		}
	}

	/**
	 * Add inline scripts.
	 *
	 * @since 1.0.0
	 */
	public static function add_inline_scripts() {
		wp_add_inline_script( 'wp-element', 'window.qfEditorContext = ' . wp_json_encode( qf_get_editor_context_value() ), 'before' );
		foreach ( QF_Blocks_Factory::get_instance()->get_all_registered() as $block ) {
			wp_add_inline_script(
				'quillforms-blocks',
				'qf.blocks.registerBlockType("' . $block->type . '",' . wp_json_encode(
					array(
						'attributes'       => $block->custom_attributes,
						'supports'         => $block->supported_features,
						'logicalOperators' => $block->logical_operators,
					)
				) . ');'
			);
		}
	}

	/**
	 * Removes notices that should not be displayed on QF Admin pages.
	 *
	 * @since 1.0.0
	 */
	public static function remove_notices() {
		if ( ! self::is_admin_page() ) {
			return;
		}

		// Hello Dolly.
		if ( function_exists( 'hello_dolly' ) ) {
			remove_action( 'admin_notices', 'hello_dolly' );
		}
	}

	/**
	 * Runs before admin notices action and hides them.
	 *
	 * @since 1.0.0
	 */
	public static function inject_before_notices() {
		if ( ! self::is_admin_page() ) {
			return;
		}

		// Wrap the notices in a hidden div to prevent flickering before
		// they are moved elsewhere in the page by WordPress Core.
		echo '<div class="quillforms-layout__notice-list-hide" style="display: none;" id="wp__notice-list">';

		if ( self::is_admin_page() ) {
			// Capture all notices and hide them. WordPress Core looks for
			// `.wp-header-end` and appends notices after it if found.
			// https://github.com/WordPress/WordPress/blob/f6a37e7d39e2534d05b9e542045174498edfe536/wp-admin/js/common.js#L737 .
			echo '<div class="wp-header-end" id="quillforms-layout__notice-catcher"></div>';
		}
	}

	/**
	 * Runs after admin notices and closes div.
	 *
	 * @since 1.0.0
	 */
	public static function inject_after_notices() {
		if ( ! self::is_admin_page() ) {
				return;
		}
		// Close the hidden div used to prevent notices from flickering before
		// they are inserted elsewhere in the page.
		echo '</div>';
	}

}

new QF_Admin_Loader();
