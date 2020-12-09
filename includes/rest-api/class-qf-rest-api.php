<?php
/**
 * REST API: class QF_REST_API
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage REST_API
 */

defined( 'ABSPATH' ) || exit;

/**
 * QF_REST_API class is mainly responsible for registering routes.
 *
 * @since 1.0.0
 */
class QF_REST_API {
	/**
	 *  Class singleton instance
	 *
	 * @since 1.0.0
	 *
	 * @var object $_instance The singleton instance.
	 */
	private static $_instance = null;

	/**
	 * Get instance as a singleton.
	 *
	 * @since 1.0.0
	 *
	 * @return QF_REST_API $_instance An instance of the QF_REST_API class
	 */
	public static function get_instance() {
		if ( null === self::$_instance ) {
			self::$_instance = new QF_REST_API();
		}

		return self::$_instance;
	}

	/**
	 * Cloning the singletone.
	 *
	 * @since 1.0.0
	 */
	private function __clone() {
	} /* do nothing */

	/**
	 * QF_REST_API constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	/**
	 * Register REST API routes
	 *
	 * @since 1.0.0
	 */
	public function register_rest_routes() {
		$controllers = array(
			'QF_REST_Form_Theme_Controller',
		);

		foreach ( $controllers as $controller ) {
			$controller_obj = new $controller();
			$controller_obj->register_routes();
		}
	}

}
