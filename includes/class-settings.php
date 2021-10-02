<?php
/**
 * Class Settings
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Settings Class
 *
 * @since 1.6.0
 */
class Settings {

	/**
	 * Option name where to store all settings
	 *
	 * @since 1.6.0
	 */
	const OPTION_NAME = 'quillforms_settings';

	/**
	 * Get a setting
	 *
	 * @since 1.6.0
	 *
	 * @param string $key Key.
	 * @param mixed  $default Default value.
	 * @return mixed
	 */
	public static function get( $key, $default = false ) {
		$settings = self::get_all();
		return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
	}

	/**
	 * Update a setting
	 *
	 * @since 1.6.0
	 *
	 * @param string $key Key.
	 * @param mixed  $value Value.
	 * @return boolean
	 */
	public static function update( $key, $value ) {
		return self::update_many( array( $key => $value ) );
	}

	/**
	 * Delete a setting
	 *
	 * @since 1.6.0
	 *
	 * @param string $key Key.
	 * @return boolean
	 */
	public static function delete( $key ) {
		$settings = self::get_all();
		unset( $settings[ $key ] );
		return self::update_all( $settings );
	}

	/**
	 * Get all settings
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public static function get_all() {
		return get_option( self::OPTION_NAME, array() );
	}

	/**
	 * Update many settings
	 *
	 * @since 1.6.0
	 *
	 * @param array $new_settings New settings.
	 * @return boolean
	 */
	public static function update_many( $new_settings ) {
		$old_settings = self::get_all();
		$settings     = array_replace( $old_settings, $new_settings );
		return self::update_all( $settings );
	}

	/**
	 * Update all settings
	 *
	 * @since 1.6.0
	 *
	 * @param array $settings Settings.
	 * @return boolean
	 */
	public static function update_all( $settings ) {
		return update_option( self::OPTION_NAME, $settings );
	}

	/**
	 * Delete all settings
	 *
	 * @since 1.6.0
	 *
	 * @return boolean
	 */
	public static function delete_all() {
		return delete_option( self::OPTION_NAME );
	}

}
