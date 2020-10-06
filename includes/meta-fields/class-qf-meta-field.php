<?php
/**
 * Meta fields: class QF_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Meta_Field
 * At admin side, QuillForms depends heavily on REST api and each registered metafield is accessed through the rest api.
 * To have a custom metafield for the form, you should first extend this class and then register it with
 * QF_Meta_Fields_Manager and this class will register this metafield as REST field in rest api with its slug.
 * At public side, if autoinclude_in_public is true, QF_Meta_Fields_Manager will handle this and prepare associve array
 * for metafields values keyed by their slug.
 *
 * @since 1.0.0
 */
abstract class QF_Meta_Field {

	/**
	 * Get slug
	 *
	 * @since 1.0.0
	 * @abstract
	 */
	abstract public function get_slug();

	/**
	 * Is metafield value of array type
	 * Default is true.
	 *
	 * @since 1.0.0
	 *
	 * @return bool Is the value of array type
	 */
	public function is_array() {
		return true;
	}

	/**
	 * Get field value
	 *
	 * @param array $object Form object.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed The value
	 */
	public function get_value( $object ) {
		$form_id = $object['id'];

		$value = get_post_meta( $form_id, $this->get_slug(), true );
		if ( $this->is_array() ) {
			return qf_decode( $value );
		}
		return $value;
	}

	/**
	 * Update value
	 *
	 * @since 1.0.0
	 *
	 * @param mixed  $meta   Meta value.
	 * @param object $object Form post object.
	 *
	 * @return bool|WP_Error The update result.
	 */
	public function update_value( $meta, $object ) {
		$form_id = $object->ID;
		// Calculation the previous value because update_post_meta returns false if the same value passed.
		$prev_value = $this->get_value( $form_id );
		if ( $prev_value === $meta ) {
			return true;
		}
		$ret = update_post_meta( $form_id, $this->get_slug(), $meta );

		if ( false === $ret ) {
			return new WP_Error(
				"qf_metafield_{$this->get_slug()}_update_failed",
				__( 'Failed to update blocks.', 'quillforms' ),
				array( 'status' => 500 )
			);
		}
		return true;
	}

	/**
	 * Get schema
	 * The schema term is pretty much like the schema in WordPress REST api.
	 * The get_schema function is preffered to be overriden to apply the schema for metafield.
	 * However, this isn't necessary. This is just the best practice to validate and sanitize metafield value.
	 *
	 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/schema
	 * @since 1.0.0
	 *
	 * @return array|null The schema
	 */
	public function get_schema() {
		return null;
	}

	/**
	 * Include this metafield in public for easy accessing it in public front end.
	 * The default is true but some meta fields shouldn't be availabe at public
	 * because it may contain some private data like for example: notifications.
	 *
	 * @since 1.0.0
	 *
	 * @return boolean auto-include flag
	 */
	public function include_in_public() {
		return true;
	}
}
