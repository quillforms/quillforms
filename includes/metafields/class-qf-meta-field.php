<?php
/**
 * Metafields: class QF_Meta_Field
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
	 * Get callback
	 *
	 * @since 1.0.0
	 */
	public function get_callback( $object ) {
		$form_id = $object['id'];
		return get_post_meta( $form_id, $this->get_slug(), true );
	}

	/**
	 * Update callback
	 *
	 * @since 1.0.0
	 *
	 * @return bool|WP_Error The update result.
	 */
	public function update_callback( $meta, $object ) {
		$form_id = $object->ID;
		// Calculation the previous value because update_post_meta returns false if the same value passed.
		$prev_value = $this->get_callback( $form_id );
		if ( $prev_value === $meta ) {
			return true;
		}
		$ret = update_post_meta( $form_id, $this->get_slug(), $meta );

		if ( false === $ret ) {
			return new WP_Error(
				'qf_metafield_update_failed',
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
	 * @return mixed|null The schema
	 */
	public function get_schema() {
		return null;
	}

	/**
	 * Include in public
	 * Include this metafield in public for easy accessing it.
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
