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
	 * Plugin file
	 *
	 * @since 1.6.0
	 *
	 * @var string
	 */
	public $plugin_file;

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
	 * Dependencies
	 *
	 * @since 1.7.1
	 *
	 * @var array {
	 *   An associative array of dependencies.
	 *   its keys can be quillforms or {other_addon_slug}_addon
	 *   it also supports ssl, curl
	 *
	 *   @type string $version Dependency version.
	 *   @type boolean $required For addon dependency only.
	 * }
	 */
	public $dependencies = array();

	/**
	 * Settings
	 *
	 * @since 1.3.0
	 *
	 * @var Settings|null
	 */
	public $settings;

	/**
	 * Form data
	 *
	 * @since 1.3.0
	 *
	 * @var Form_Data|null
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
	private function __construct() {
		if ( $this->register() ) {
			$this->init();
		}
	}

	/**
	 * Initialize
	 *
	 * @return void
	 */
	protected function init() {
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
	private function register() {
		try {
			Addons_Manager::instance()->register( $this );
		} catch ( Exception $e ) {
			add_action(
				'admin_notices',
				function() use ( $e ) {
					$this->output_registration_error( $e->getMessage() );
				}
			);
			$deactivation_codes = array();
			if ( in_array( $e->getCode(), $deactivation_codes, true ) ) {
				deactivate_plugins( $this->plugin_file );
				quillforms_get_logger()->error(
					esc_html__( 'Addon deactivated due to incompatible dependencies', 'quillforms' ),
					array(
						'source'       => static::class . '->' . __FUNCTION__,
						'code'         => 'addon_deactivated_due_to_incompatible_dependencies',
						'dependencies' => $this->dependencies,
					)
				);
			}
			return false;
		}
		return true;
	}

	/**
	 * Output registration error
	 *
	 * @since 1.6.0
	 *
	 * @param string $message Message.
	 * @return void
	 */
	protected function output_registration_error( $message ) {
		?>
		<div class="notice notice-error">
			<p><?php echo esc_html__( 'Cannot register a Quill Forms addon', 'quillforms' ) . ': ' . $message; ?></p>
		</div>
		<?php
	}

	/**
	 * Load plugin text domain
	 *
	 * @return void
	 */
	protected function load_textdomain() {
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
