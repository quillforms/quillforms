<?php
/**
 * Utils class
 *
 * @since next.version
 *
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Utils Class
 */
final class Utils {

	/**
	 * Get max execution time
	 *
	 * @return int
	 */
	public static function get_max_execution_time() {
		$max_execution_time = 30;

		if ( function_exists( 'ini_get' ) ) {
			$max_execution_time = ini_get( 'max_execution_time' );

			if ( ! $max_execution_time ) {
				$max_execution_time = 30;
			}
		}

		// Decrease a little bit to avoid reaching the limit.
		$max_execution_time = $max_execution_time * 0.75;
		return apply_filters( 'quillforms_max_execution_time', $max_execution_time );
	}

	/**
	 * Is memory limit reached
	 *
	 * @return bool
	 */
	public static function is_memory_limit_reached() {
		$memory_limit = self::get_memory_limit();
		$memory_usage = memory_get_usage( true );
		$memory_limit = self::convert_to_bytes( $memory_limit );
		$memory_limit = $memory_limit * 0.75;

		return $memory_usage >= $memory_limit;
	}

	/**
	 * Get memory limit
	 *
	 * @return string
	 */
	public static function get_memory_limit() {
		$memory_limit = '128M';

		if ( function_exists( 'ini_get' ) ) {
			$memory_limit = ini_get( 'memory_limit' );

			if ( ! $memory_limit ) {
				$memory_limit = '128M';
			}
		}

		return apply_filters( 'quillforms_memory_limit', $memory_limit );
	}

	/**
	 * Convert to bytes
	 *
	 * @param string $value
	 *
	 * @return int
	 */
	public static function convert_to_bytes( $value ) {
		$value     = trim( $value );
		$last      = strtolower( $value[ strlen( $value ) - 1 ] );
		$new_value = intval( $value );

		switch ( $last ) {
			case 'g':
				$new_value *= GB_IN_BYTES;
				break;
			case 'm':
				$new_value *= MB_IN_BYTES;
				break;
			case 'k':
				$new_value *= KB_IN_BYTES;
				break;
		}

		return $new_value;
	}
}
