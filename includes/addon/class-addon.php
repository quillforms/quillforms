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
	 * @return Addon - Single instance
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
		$this->init_scripts();
	}

	/**
	 * Initialize scripts.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	protected function init_scripts() {
		// Scripts::instance(); // uncomment this in subclass.
	}

}
