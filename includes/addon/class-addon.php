<?php
/**
 * Addon class.
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms\Addon;

/**
 * Abstract class for plugin extensions.
 *
 * @since 1.0.0
 */
abstract class Addon {

	/**
	 * Subclasses instances.
	 *
	 * @var array
	 *
	 * @since 1.0.0
	 */
	private static $instances = array();

	/**
	 * Addon Instance.
	 *
	 * Instantiates or reuses an instance of Addon.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @return Addon - Single instance
	 */
	public static function instance(): Addon {
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
		$this->init_scripts();
	}

	/**
	 * Initialize scripts.
	 *
	 * @return void
	 */
	protected function init_scripts() {
		// Scripts::instance(); // uncomment this in subclass.
	}

}
