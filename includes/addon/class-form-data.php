<?php
/**
 * Form_Data class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon;

/**
 * Form_Data class.
 *
 * @since 1.3.0
 */
class Form_Data {

	/**
	 * Addon
	 *
	 * @var Addon
	 */
	protected $addon;

	/**
	 * Post meta key
	 *
	 * @var string
	 */
	protected $meta_key;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Addon $addon Addon.
	 */
	public function __construct( $addon ) {
		$this->addon    = $addon;
		$this->meta_key = "addon_{$this->addon->slug}";
	}

	/**
	 * Get filtered form data
	 * To be overridden at subclass if needed.
	 *
	 * @param int          $form_id Form id.
	 * @param false|string $property Property.
	 * @return mixed
	 */
	public function get_filtered( $form_id, $property = false ) {
		return $this->get( $form_id, $property );
	}

	/**
	 * Update form data after filtering
	 * To be overridden at subclass if needed.
	 *
	 * @param int     $form_id Form id.
	 * @param mixed   $new_data New form data.
	 * @param boolean $partial Partial update or complete.
	 * @return boolean
	 */
	public function update_filtered( $form_id, $new_data, $partial = true ) {
		return $this->update( $form_id, $new_data, $partial );
	}

	/**
	 * Get form data
	 *
	 * @param int          $form_id Form id.
	 * @param false|string $property Property.
	 * @return mixed
	 */
	final public function get( $form_id, $property = false ) {
		$data = get_post_meta( $form_id, $this->meta_key, true ) ?: array(); // phpcs:ignore
		if ( $property ) {
			return $data[ $property ] ?? null;
		}
		return $data;
	}

	/**
	 * Update form data
	 *
	 * @param int     $form_id Form id.
	 * @param mixed   $new_data New form data.
	 * @param boolean $partial Partial update or complete.
	 * @return boolean
	 */
	final public function update( $form_id, $new_data, $partial = true ) {
		$previous_data = $this->get( $form_id );
		if ( $partial ) {
			$new_data = array_replace( $previous_data, $new_data );
		}
		if ( $new_data === $previous_data ) {
			return true;
		}
		return update_post_meta( $form_id, $this->meta_key, $new_data );
	}

	/**
	 * Delete form data
	 *
	 * @param int          $form_id Form id.
	 * @param false|string $property Property.
	 * @return boolean
	 */
	final public function delete( $form_id, $property = false ) {
		if ( $property ) {
			return $this->update( $form_id, array( $property => null ) );
		} else {
			return delete_post_meta( $form_id, $this->meta_key );
		}
	}

}
