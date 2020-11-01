<?php
/**
 * Main class: class QuillForms
 *
 * @since 1.0.0
 * @package QuillForms
 */

defined( 'ABSPATH' ) || exit;


/**
 * QuillForms Main Class.
 *
 * The main class that's responsible for loading all dependencies
 */
final class QuillForms {

	/**
	 * QuillForms version.
	 *
	 * @var string
	 */
	public $version = '1.0.0';


	/**
	 * Class Instance.
	 *
	 * @var QuillForms
	 *
	 * @since 1.0.0
	 */
	public static $instance;

	/**
	 * Editor Mode
	 *
	 * @var bool
	 *
	 * @since 1.0.0
	 */
	public $editor_mode = false;

	/**
	 * Frontend Mode
	 *
	 * @var bool
	 *
	 * @since 1.0.0
	 */
	public $frontend_mode = false;

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
	}

	/**
	 * Dependencies Loader.
	 *
	 * @since 1.0.0
	 */
	public function load_dependencies() {

		/**
		 * Interfaces.
		 */
		require_once QF_PLUGIN_DIR . 'includes/interfaces/class-qf-logger-interface.php';
		require_once QF_PLUGIN_DIR . 'includes/interfaces/class-qf-log-handler-interface.php';

		/**
		 * Abstract Classes.
		 */
		require_once QF_PLUGIN_DIR . 'includes/abstracts/abstract-qf-block.php';
		require_once QF_PLUGIN_DIR . 'includes/abstracts/abstract-qf-log-handler.php';
		require_once QF_PLUGIN_DIR . 'includes/abstracts/abstract-qf-log-levels.php';

		/**
		 * Core classes.
		 */
		require_once QF_PLUGIN_DIR . 'lib/client-assets.php';
		require_once QF_PLUGIN_DIR . 'includes/admin/class-qf-admin-page-controller.php';
		require_once QF_PLUGIN_DIR . 'includes/admin/class-qf-admin-loader.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-capabilities.php';
		require_once QF_PLUGIN_DIR . 'includes/admin/class-qf-admin.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-blocks-factory.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-fonts.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-install.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-logger.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-scripts.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-styles.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-user.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-utils.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-variables.php';
		require_once QF_PLUGIN_DIR . 'includes/class-qf-schema-manager.php';

		/**
		 * Meta Fields
		 */
		require_once QF_PLUGIN_DIR . 'includes/meta-fields/class-qf-meta-field.php';
		require_once QF_PLUGIN_DIR . 'includes/meta-fields/class-qf-meta-fields.php';
		require_once QF_PLUGIN_DIR . 'includes/meta-fields/class-qf-blocks-meta-field.php';
		require_once QF_PLUGIN_DIR . 'includes/meta-fields/class-qf-messages-meta-field.php';
		require_once QF_PLUGIN_DIR . 'includes/meta-fields/class-qf-notifications-meta-field.php';
		require_once QF_PLUGIN_DIR . 'includes/meta-fields/class-qf-theme-meta-field.php';

		/**
		 * Models.
		 */
		require_once QF_PLUGIN_DIR . 'includes/models/class-qf-form-theme-model.php';

		/**
		 * Functions.
		 */
		require_once QF_PLUGIN_DIR . 'includes/functions.php';
		require_once QF_PLUGIN_DIR . 'includes/admin/page-controller-functions.php';

		/**
		 * REST API.
		 */
		require_once QF_PLUGIN_DIR . 'includes/rest-api/class-qf-rest-fields.php';
		require_once QF_PLUGIN_DIR . 'includes/rest-api/controllers/v1/class-qf-rest-controller.php';
		require_once QF_PLUGIN_DIR . 'includes/rest-api/class-qf-rest-api.php';

		/**
		 * Load all blocks.
		 */
		foreach ( glob( QF_PLUGIN_DIR . '/build/block-library/blocks/*.php' ) as $block ) {
			require_once $block;
		}
	}

	/**
	 * Initialize instances from classes loaded.
	 *
	 * @since 1.0.0
	 */
	public function initialize_objects() {
		QF_Admin::instance();
		QF_REST_API::get_instance();
	}
}
