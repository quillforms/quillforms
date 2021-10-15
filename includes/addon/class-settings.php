<?php
/**
 * Settings class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon;

/**
 * Settings class.
 *
 * @since 1.3.0
 */
class Settings {

	/**
	 * Addon
	 *
	 * @var Addon
	 */
	protected $addon;

	/**
	 * Option key
	 *
	 * @var string
	 */
	protected $option_key;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Addon $addon Addon.
	 */
	public function __construct( $addon ) {
		$this->addon      = $addon;
		$this->option_key = "quillforms_{$this->addon->slug}_settings";
	}

	/**
	 * Get settings
	 *
	 * @since 1.3.0
	 *
	 * @param false|string $property Property.
	 * @return mixed
	 */
	public function get( $property = false ) {
		$settings = get_option( $this->option_key, array() );
		if ( $property ) {
			return $settings[ $property ] ?? null;
		}
		return $settings;
	}

	/**
	 * Update settings
	 *
	 * @since 1.3.0
	 *
	 * @param array   $new_settings New settings.
	 * @param boolean $partial Partial update or complete.
	 * @return boolean
	 */
	public function update( $new_settings, $partial = true ) {
		$previous_settings = $this->get();
		if ( $partial ) {
			$new_settings = array_replace( $previous_settings, $new_settings );
		}
		if ( $new_settings === $previous_settings ) {
			return true;
		}
		return update_option( $this->option_key, $new_settings );
	}

	/**
	 * Delete settings
	 *
	 * @since 1.3.0
	 *
	 * @param false|string $property Property.
	 * @return boolean
	 */
	public function delete( $property = false ) {
		if ( $property ) {
			return $this->update( array( $property => null ) );
		} else {
			return delete_option( $this->option_key );
		}
	}

}
