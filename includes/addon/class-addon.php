<?php
/**
 * Addon class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon;

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
	 * Settings
	 *
	 * @since 1.3.0
	 *
	 * @var Settings
	 */
	public $settings;

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// 'scripts'  => Scripts::class,
		// 'settings' => Settings::class,
		// 'rest'     => REST\REST::class,
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
		if ( ! empty( static::$classes['scripts'] ) ) {
			new static::$classes['scripts']();
		}
		if ( ! empty( static::$classes['settings'] ) ) {
			$this->settings = new static::$classes['settings']( $this );
		}
		if ( ! empty( static::$classes['rest'] ) ) {
			new static::$classes['rest']( $this );
		}
	}

}
