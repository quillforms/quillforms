<?php
/**
 * Addon class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon;

use Exception;
use QuillForms\Managers\Addons_Manager;
use QuillForms\Tasks;

/**
 * Abstract class for plugin extensions.
 *
 * @since 1.3.0
 */
abstract class Addon {

	/**
	 * Name
	 *
	 * @since 1.3.0
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Slug
	 *
	 * @since 1.3.0
	 *
	 * @var string
	 */
	public $slug;

	/**
	 * Version
	 *
	 * @since 1.3.0
	 *
	 * @var string
	 */
	public $version;

	/**
	 * Text domain
	 *
	 * @since 1.5.0
	 *
	 * @var string
	 */
	public $textdomain;

	/**
	 * Plugin dir
	 *
	 * @since 1.5.0
	 *
	 * @var string
	 */
	public $plugin_dir;

	/**
	 * Plugin url
	 *
	 * @since 1.5.0
	 *
	 * @var string
	 */
	public $plugin_url;

	/**
	 * Settings
	 *
	 * @since 1.3.0
	 *
	 * @var Settings
	 */
	public $settings;

	/**
	 * Form data
	 *
	 * @since 1.3.0
	 *
	 * @var Form_Data
	 */
	public $form_data;

	/**
	 * Tasks
	 *
	 * @var Tasks
	 */
	public $tasks;

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// 'scripts'   => Scripts::class,
		// 'settings'  => Settings::class,
		// 'form_data' => Form_Data::class,
		// 'rest'      => REST\REST::class,
	);

	/**
	 * Subclasses instances.
	 *
	 * @var array
	 *
	 * @since 1.3.0
	 */
	private static $instances = array();

	/**
	 * Addon Instances.
	 *
	 * Instantiates or reuses an instances of Addon.
	 *
	 * @since 1.3.0
	 * @static
	 *
	 * @return static - Single instance
	 */
	public static function instance() {
		if ( ! isset( self::$instances[ static::class ] ) ) {
			self::$instances[ static::class ] = new static();
		}
		return self::$instances[ static::class ];
	}

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 */
	protected function __construct() {
		if ( ! $this->register() ) {
			return;
		}

		$this->load_textdomain();

		if ( ! empty( static::$classes['scripts'] ) ) {
			new static::$classes['scripts']( $this );
		}
		if ( ! empty( static::$classes['settings'] ) ) {
			$this->settings = new static::$classes['settings']( $this );
		}
		if ( ! empty( static::$classes['form_data'] ) ) {
			$this->form_data = new static::$classes['form_data']( $this );
		}
		if ( ! empty( static::$classes['rest'] ) ) {
			new static::$classes['rest']( $this );
		}
		$this->tasks = new Tasks( "quillforms_{$this->slug}" );
	}

	/**
	 * Register
	 *
	 * @return boolean
	 */
	protected function register() {
		try {
			Addons_Manager::instance()->register( $this );
		} catch ( Exception $e ) {
			quillforms_get_logger()->critical(
				esc_html__( 'Cannot register addon', 'quillforms' ),
				array(
					'source'    => static::class . '->' . __FUNCTION__,
					'code'      => 'cannot_register_addon',
					'exception' => array(
						'message' => $e->getMessage(),
					),
				)
			);
			return false;
		}
		return true;
	}

	/**
	 * Load plugin text domain
	 *
	 * @return void
	 */
	public function load_textdomain() {
		$plugin_rel_path = substr( $this->plugin_dir, strlen( WP_PLUGIN_DIR ) ) . 'languages';
		load_plugin_textdomain( $this->textdomain, false, $plugin_rel_path );
	}

	/**
	 * Get main namespace
	 *
	 * @return string
	 */
	public function get_namespace() {
		return explode( '\\', static::class )[0];
	}

}
