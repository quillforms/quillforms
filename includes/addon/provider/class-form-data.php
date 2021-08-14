<?php
/**
 * Form_Data class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider;

/**
 * Form_Data class.
 *
 * @since 1.3.0
 */
abstract class Form_Data {

	/**
	 * Post meta key
	 *
	 * @var string
	 */
	private $meta_key;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param string $slug Provider slug.
	 */
	final public function __construct( $slug ) {
		$this->meta_key = "addon_$slug";
	}

	/**
	 * Get form data
	 *
	 * @param int          $form_id Form id.
	 * @param false|string $property Property.
	 * @return mixed
	 */
	final public function get( $form_id, $property = false ) {
		$meta_value = get_post_meta( $form_id, $this->meta_key, true ) ?: array(); // phpcs:ignore
		if ( $property ) {
			return $meta_value[ $property ] ?? null;
		}
		return $meta_value;
	}

	/**
	 * Get filtered form data
	 *
	 * @param int          $form_id Form id.
	 * @param false|string $property Property.
	 * @return mixed
	 */
	abstract public function get_filtered( $form_id, $property = false );

	/**
	 * Update form data
	 *
	 * @param int     $form_id Form id.
	 * @param mixed   $new_value New value.
	 * @param boolean $partial Partial replacement or not.
	 * @return boolean
	 */
	final public function update( $form_id, $new_value, $partial = false ) {
		$previous_value = $this->get( $form_id );
		if ( $partial ) {
			$new_value = array_replace( $previous_value, $new_value );
		}
		if ( $new_value === $previous_value ) {
			return true;
		}
		return update_post_meta( $form_id, $this->meta_key, $new_value );
	}

	/**
	 * Update form data after filtering
	 *
	 * @param int     $form_id Form id.
	 * @param mixed   $new_value New value.
	 * @param boolean $partial Partial replacement or not.
	 * @return boolean
	 */
	abstract public function update_filtered( $form_id, $new_value, $partial = false );

	/**
	 * Delete form data
	 *
	 * @param int $form_id Form id.
	 * @return boolean
	 */
	final public function delete( $form_id ) {
		return delete_post_meta( $form_id, $this->meta_key );
	}

}
