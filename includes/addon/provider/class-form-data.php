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
final class Form_Data {

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
	public function __construct( $slug ) {
		$this->meta_key = "provider_$slug";
	}

	/**
	 * Get form data
	 *
	 * @param int          $form_id Form id.
	 * @param false|string $property Property.
	 * @return mixed
	 */
	public function get( $form_id, $property = false ) {
		$meta_value = get_post_meta( $form_id, $this->meta_key, true ) ?: array(); // phpcs:ignore
		if ( $property ) {
			return $meta_value[ $property ] ?? null;
		}
		return $meta_value;
	}

	/**
	 * Update form data
	 *
	 * @param int     $form_id Form id.
	 * @param mixed   $new_value New value.
	 * @param boolean $partial Partial replacement or not.
	 * @return boolean
	 */
	public function update( $form_id, $new_value, $partial = false ) {
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
	 * Delete form data
	 *
	 * @param int $form_id Form id.
	 * @return boolean
	 */
	public function delete( $form_id ) {
		return delete_post_meta( $form_id, $this->meta_key );
	}

}
