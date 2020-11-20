<?php
/**
 * REST Api: class QF_REST_Fields
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage REST_API
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_REST_Fields is for having registered meta fields available as rest fields
 *
 * @since 1.0.0
 */
class QF_REST_Fields {
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
	 * @return QF_REST_Fields $_instance An instance of the QF_REST_Fields class
	 */
	public static function get_instance() {
		if ( null === self::$_instance ) {
			self::$_instance = new QF_REST_Fields();
		}

		return self::$_instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_meta_fields_as_rest_fields' ) );
	}

	/**
	 * Register the registered meta fields as rest fields
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function register_meta_fields_as_rest_fields() {
		$registered_meta_fields = QF_Meta_Fields_Factory::get_instance()->get_all_registered();

		foreach ( $registered_meta_fields as $slug => $meta_field ) {
			$args = array();

			// Add get_callback.
			$args['get_callback'] = function( $object ) use ( $meta_field ) {
				return $meta_field->get_value( $object );
			};

			// Add update_callback.
			$args['update_callback'] = function( $meta, $object ) use ( $meta_field ) {
				return $meta_field->update_value( $meta, $object );
			};

			// If schema isn't empty, add it.
			if ( ! empty( $meta_field->get_schema() ) ) {
				$args['schema'] = $meta_field->get_schema();
			}

			register_rest_field( 'quill_forms', $slug, $args );
		}
	}
}
QF_REST_Fields::get_instance();
