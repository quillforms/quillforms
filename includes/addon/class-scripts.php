<?php
/**
 * Scripts class.
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms\Addon;

use QuillForms\Admin\Admin_Loader;

/**
 * Abstract class for plugin extensions.
 *
 * @since 1.0.0
 */
abstract class Scripts {

	/**
	 * Subclasses instances.
	 *
	 * @var array
	 *
	 * @since 1.0.0
	 */
	private static $instances = array();

	/**
	 * Plugin dir
	 *
	 * @var string
	 */
	protected $plugin_dir;

	/**
	 * Plugin url
	 *
	 * @var string
	 */
	protected $plugin_url;

	/**
	 * Scripts to register.
	 * 'handle' => [ 'path' => 'relative/to/plugin', 'eneuque' => [ 'admin', 'renderer' ] ]
	 *
	 * @var array
	 */
	protected $scripts = array();

	/**
	 * Styles to register.
	 * 'handle' => [ 'path' => 'relative/to/plugin', 'dependencies' => [], 'eneuque' => [ 'admin', 'renderer' ] ]
	 *
	 * @var array
	 */
	protected $styles = array();

	/**
	 * Scripts Instance.
	 *
	 * Instantiates or reuses an instance of Scripts.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @return Scripts - Single instance
	 */
	public static function instance(): Scripts {
		if ( ! isset( self::$instances[ static::class ] ) ) {
			self::$instances[ static::class ] = new static();
		}
		return self::$instances[ static::class ];
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	protected function __construct() {
		// register.
		add_action( 'wp_default_scripts', array( $this, 'register_scripts' ) );
		add_action( 'wp_default_styles', array( $this, 'register_styles' ) );
		// enqueue.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ), 9999999 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_renderer_scripts' ), 9999999 );
		// localize.
		add_action( 'admin_enqueue_scripts', array( $this, 'localize_scripts' ), 9999999 );
		add_action( 'wp_enqueue_scripts', array( $this, 'localize_scripts' ), 9999999 );
	}

	/**
	 * Register scripts
	 *
	 * @param WP_Scripts $scripts WordPress scripts.
	 * @return void
	 */
	public function register_scripts( $scripts ) {
		foreach ( $this->scripts as $handle => $script ) {
			$filepath     = $this->plugin_dir . $script['path'];
			$asset_file   = substr( $filepath, 0, -3 ) . '.asset.php';
			$asset        = file_exists( $asset_file ) ? require $asset_file : null;
			$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
			$version      = isset( $asset['version'] ) ? $asset['version'] : filemtime( $filepath );
			$script_url   = $this->plugin_url . $script['path'];
			quillforms_override_script(
				$scripts,
				$handle,
				$script_url,
				$dependencies,
				$version,
				true
			);
		}
	}

	/**
	 * Register styles
	 *
	 * @param WP_Styles $styles WordPress Styles.
	 * @return void
	 */
	public function register_styles( $styles ) {
		foreach ( $this->styles as $handle => $style ) {
			quillforms_override_style(
				$styles,
				$handle,
				$this->plugin_url . $style['path'],
				$style['dependencies'],
				filemtime( $this->plugin_dir . $style['path'] )
			);
			$styles->add_data( $handle, 'rtl', 'replace' );
		}
	}

	/**
	 * Enqueue admin scripts and styles.
	 *
	 * @return void
	 */
	public function enqueue_admin_scripts() {
		if ( Admin_Loader::is_admin_page() ) {
			foreach ( $this->scripts as $handle => $script ) {
				if ( in_array( 'admin', $script['enqueue'], true ) ) {
					wp_enqueue_script( $handle );
				}
			}
			foreach ( $this->styles as $handle => $style ) {
				if ( in_array( 'admin', $style['enqueue'], true ) ) {
					wp_enqueue_style( $handle );
				}
			}
		}
	}

	/**
	 * Enqueue renderer scripts and styles.
	 *
	 * @return void
	 */
	public function enqueue_renderer_scripts() {
		if ( $this->is_form_page() ) {
			foreach ( $this->scripts as $handle => $script ) {
				if ( in_array( 'renderer', $script['enqueue'], true ) ) {
					wp_enqueue_script( $handle );
				}
			}
			foreach ( $this->styles as $handle => $style ) {
				if ( in_array( 'renderer', $style['enqueue'], true ) ) {
					wp_enqueue_style( $handle );
				}
			}
		}
	}

	/**
	 * Localize scripts.
	 *
	 * @return void
	 */
	public function localize_scripts() {}

	/**
	 * Is current page is quill_forms post type.
	 *
	 * @return boolean
	 */
	protected function is_form_page() {
		return is_singular( 'quill_forms' );
	}

}
