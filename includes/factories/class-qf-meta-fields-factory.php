<?php
/**
 * Metafields: class QF_Meta_Fields
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Meta_Fields is responsible for registering the metafields.
 *
 * @since 1.0.0
 */
class QF_Meta_Fields_Factory {

	/**
	 * Registered meta fields, as `$name => $instance` pairs.
	 *
	 * @since 1.0.0
	 *
	 * @var QF_Meta_Fields_Factory[]
	 */
	private $registered_meta_fields = array();

	/**
	 * Container for the main instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @var QF_Meta_Fields_Factory|null
	 */
	private static $instance = null;

	/**
	 * Registers meta field.
	 *
	 * @since 1.0.0
	 *
	 * @param QF_Meta_Field $meta_field QF_Meta_Field instance.
	 *
	 * @return QF_Meta_Field the registered meta field on success, or false on failure
	 */
	public function register( $meta_field ) {
		if ( ! $meta_field instanceof QF_Meta_Field ) {
			$message = __( 'Registered meta field must be instance of QF_Meta_Field.', 'quillforms' );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		} else {
			$slug = $meta_field->get_slug();
		}

		// Check if slug isn't string.
		if ( ! is_string( $slug ) ) {
			$message = __( 'Meta field slug must be string.', 'quillforms' );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		// Check if slug contain spaces.
		if ( strpos( $slug, ' ' ) !== false ) {
			$message = __( 'Meta field slug shouldn\'t contain spaces.', 'quillforms' );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		// Check if the meta field is already registered.
		if ( $this->is_registered( $slug ) ) {
			/* translators: %s: Meta field slug. */
			$message = sprintf( __( 'Meta field "%s" is already registered.', 'quillforms' ), $slug );
			_doing_it_wrong( __METHOD__, $message, '1.0.0' );

			return false;
		}

		$this->registered_meta_fields[ $slug ] = $meta_field;

		return $meta_field;
	}

	/**
	 * Retrieves a registered meta field.
	 *
	 * @since 1.0.0
	 *
	 * @param string $slug meta field slug.
	 *
	 * @return QF_Meta_Field|null the registered meta field, or null if it is not registered
	 */
	public function get_registered( $slug ) {
		if ( ! $this->is_registered( $slug ) ) {
			return null;
		}

		return $this->registered_meta_fields[ $slug ];
	}

	/**
	 * Retrieves all registered meta fields.
	 *
	 * @since 1.0.0
	 *
	 * @return QF_Meta_Field[] associative array of `$meta_field_slug => $meta_field` pairs
	 */
	public function get_all_registered() {
		return $this->registered_meta_fields;
	}

	/**
	 * Checks if a meta field is registered.
	 *
	 * @since 1.0.0
	 *
	 * @param string $slug meta field slug.
	 *
	 * @return bool true if the meta field is registered, false otherwise
	 */
	public function is_registered( $slug ) {
		return isset( $this->registered_meta_fields[ $slug ] );
	}

	/**
	 * Utility method to retrieve the main instance of the class.
	 *
	 * The instance will be created if it does not exist yet.
	 *
	 * @since 1.0.0
	 *
	 * @return QF_Meta_Fields_Factory the main instance
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

}
