<?php
/**
 * Main class: class QuillForms
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Admin\Admin;
use QuillForms\Admin\Admin_Loader;
use QuillForms\Render\Form_Renderer;
use QuillForms\REST_API\REST_API;

/**
 * QuillForms Main Class.
 *
 * The main class that's responsible for loading all dependencies
 */
final class QuillForms {


	/**
	 * Class Instance.
	 *
	 * @var QuillForms
	 *
	 * @since 1.0.0
	 */
	public static $instance;

	/**
	 * QuillForms_Main Instance.
	 *
	 * Instantiates or reuses an instance of QuillForms_Main.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @return QuillForms - Single instance
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new QuillForms();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->load_dependencies();
		$this->initialize_objects();
		$this->init_hooks();
	}

	/**
	 * Dependencies Loader.
	 *
	 * @since 1.0.0
	 */
	public function load_dependencies() {
		/**
		 * Functions.
		 */
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/functions.php';

		/**
		 * Load all blocks.
		 */
		foreach ( glob( QUILLFORMS_PLUGIN_DIR . 'includes/blocks/**/*.php' ) as $block ) {
			require_once $block;
		}

		/**
		 * Core classes.
		 */
		require_once QUILLFORMS_PLUGIN_DIR . 'lib/client-assets.php';
		new Admin_Loader();
		Install::init();
		new Merge_Tags();
		Form_Renderer::init();
		new Form_Submission();

		/**
		 * REST Fields
		 */
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/rest-fields/blocks.php';
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/rest-fields/messages.php';
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/rest-fields/notifications.php';
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/rest-fields/theme.php';
	}

	/**
	 * Initialize instances from classes loaded.
	 *
	 * @since 1.0.0
	 */
	public function initialize_objects() {
		Admin::instance();
		REST_API::get_instance();
	}

	/**
	 * Init hools
	 *
	 * @since 1.0.0
	 */
	public function init_hooks() {
		add_action( 'init', array( Capabilities::class, 'assign_capabilities_for_user_roles' ) );
		add_action( 'init', array( Core::class, 'register_quillforms_post_type' ) );
	}
}
