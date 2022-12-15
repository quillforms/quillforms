<?php
/**
 * Fonts API: Fonts class.
 *
 * @package QuillForms
 * @since 1.0.0
 */

namespace QuillForms;

/**
 * Quill Forms fonts.
 *
 * Quill forms fonts handler class is responsible for registering the supported
 * fonts used by Quill forms.
 *
 * @since 1.0.0
 */
class Fonts {
	/**
	 * The system font name.
	 */
	const SYSTEM = 'system';

	/**
	 * The google font name.
	 */
	const GOOGLE = 'googlefonts';

	/**
	 * The google early access font name.
	 */
	const EARLYACCESS = 'earlyaccess';

	/**
	 * The local font name.
	 */
	const LOCAL = 'local';

	/**
	 * Fonts
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @var array|null
	 */
	private static $fonts;



	/**
	 * Get fonts.
	 *
	 * Retrieve the list of supported fonts.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @return array supported fonts
	 */
	public static function get_fonts() {
		if ( null === self::$fonts ) {
			$additional_fonts = array();

			// @todo Add filter for additional fonts.
			self::$fonts = array_merge( self::get_native_fonts(), $additional_fonts );
		}

		return self::$fonts;
	}

	/**
	 * Get Quill Forms native fonts.
	 *
	 * Retrieve the list of supported fonts.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @return array supported fonts
	 */
	private static function get_native_fonts() {
		return json_decode(
			file_get_contents(
				QUILLFORMS_PLUGIN_DIR . 'includes/json/fonts.json'
			),
			true
		);
	}

	/**
	 * Get font type.
	 *
	 * Retrieve the font type for a given font.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @param string $name font name.
	 *
	 * @return string|false font type, or false if font doesn't exist
	 */
	public static function get_font_type( $name ) {
		$fonts = self::get_fonts();

		if ( empty( $fonts[ $name ] ) ) {
			return false;
		}

		return $fonts[ $name ];
	}

	/**
	 * Get fonts by group.
	 *
	 * Retrieve all the fonts belong to specific group.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @param array $groups Optional. Font group. Default is an empty array.
	 *
	 * @return array font type, or false if font doesn't exist
	 */
	public static function get_fonts_by_groups( $groups = array() ) {
		return array_filter(
			self::get_fonts(),
			function ( $font ) use ( $groups ) {
				return in_array( $font, $groups, true );
			}
		);
	}
}
