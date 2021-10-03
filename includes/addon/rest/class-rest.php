<?php
/**
 * REST class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\REST;

use QuillForms\Addon\Addon;
use WP_Post;
use WP_REST_Request;
use WP_REST_Response;

/**
 * REST abstract class.
 *
 * @since 1.3.0
 */
abstract class REST {

	/**
	 * Addon
	 *
	 * @var Addon
	 */
	protected $addon;

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// 'settings_controller'  => Settings_Controller::class,
		// 'form_data_controller' => Form_Data_Controller::class,
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Addon $addon Addon.
	 */
	public function __construct( $addon ) {
		$this->addon = $addon;
		if ( ! empty( static::$classes['settings_controller'] ) ) {
			new static::$classes['settings_controller']( $this->addon );
		}
		if ( ! empty( static::$classes['form_data_controller'] ) ) {
			new static::$classes['form_data_controller']( $this->addon );
		}
	}

}
