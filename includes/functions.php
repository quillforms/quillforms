<?php
/**
 * Some helper functions.
 *
 * @since 1.0.0
 * @package QuillForms
 */

use QuillForms\Interfaces\Logger_Interface;
use QuillForms\Logger;
use QuillForms\Settings;

defined( 'ABSPATH' ) || exit;


/**
 * Helper function to sanitize a string from user input or from the db
 * Forked from WordPress core
 *
 * @see https://developer.wordpress.org/reference/functions/_sanitize_text_fields/
 * It is marked as a private function in WordPress.
 * so we copied its implementation here in case it has been removed in any future WordPress version
 *
 * @since 1.0.0
 *
 * @param string $str           String to deeply sanitize.
 * @param bool   $keep_newlines Whether to keep newlines. Default: false.
 *
 * @return string Sanitized string, or empty string if not a string provided.
 */
function quillforms_sanitize_text_fields( $str, $keep_newlines = false ) {
	if ( is_object( $str ) || is_array( $str ) ) {
		return '';
	}

	$str = (string) $str;

	$filtered = wp_check_invalid_utf8( $str );

	if ( strpos( $filtered, '<' ) !== false ) {
		$filtered = wp_pre_kses_less_than( $filtered );
		// This will strip extra whitespace for us.
		$filtered = wp_strip_all_tags( $filtered, false );

		// Use HTML entities in a special case to make sure no later
		// newline stripping stage could lead to a functional tag.
		$filtered = str_replace( "<\n", "&lt;\n", $filtered );
	}

	if ( ! $keep_newlines ) {
		$filtered = preg_replace( '/[\r\n\t ]+/', ' ', $filtered );
	}
	$filtered = trim( $filtered );

	$found = false;
	while ( preg_match( '/%[a-f0-9]{2}/i', $filtered, $match ) ) {
		$filtered = str_replace( $match[0], '', $filtered );
		$found    = true;
	}

	if ( $found ) {
		// Strip out the whitespace that may now exist after removing the octets.
		$filtered = trim( preg_replace( '/ +/', ' ', $filtered ) );
	}

	return $filtered;
}

/**
 * Deeply sanitize the string, preserve newlines if needed.
 * Prevent maliciously prepared strings from containing HTML tags.
 * Heavily inspired by wpforms
 *
 * @since 1.0.0
 *
 * @param string $string        String to deeply sanitize.
 * @param bool   $keep_newlines Whether to keep newlines. Default: false.
 *
 * @return string Sanitized string, or empty string if not a string provided.
 */
function quillforms_sanitize_text_deeply( $string, $keep_newlines = false ) {

	if ( is_object( $string ) || is_array( $string ) ) {
		return '';
	}

	$string        = (string) $string;
	$keep_newlines = (bool) $keep_newlines;

	$new_value = quillforms_sanitize_text_fields( $string, $keep_newlines );

	if ( strlen( $new_value ) !== strlen( $string ) ) {
		$new_value = quillforms_sanitize_text_deeply( $new_value, $keep_newlines );
	}

	return $new_value;
}

/**
 * Implode array without including blank values.
 *
 * @since 1.0.0
 *
 * @param string $separator The separator.
 * @param array  $array     The array to be imploded.
 *
 * @return string The imploded array
 */
function quillforms_implode_non_blank( $separator, $array ) {

	if ( ! is_array( $array ) ) {
		return '';
	}

	$ary = array();
	foreach ( $array as $item ) {
		if ( ! empty( $item ) || '0' !== strval( $item ) ) {
			$ary[] = $item;
		}
	}

	return implode( $separator, $ary );
}

/**
 * Decode special characters, both alpha- (<) and numeric-based (').
 * Sanitize recursively, preserve new lines.
 * Handle all the possible mixed variations of < and `&lt;` that can be processed into tags.
 * Heavily inspired by wpforms
 *
 * @since 1.0.0
 *
 * @param string $string Raw string to decode.
 *
 * @return string
 */
function quillforms_decode_string( $string ) {

	if ( ! is_string( $string ) ) {
		return $string;
	}

	/*
	 * Sanitization should be done first, so tags are stripped and < is converted to &lt; etc.
	 * This iteration may do nothing when the string already comes with &lt; and &gt; only.
	 */
	$string = quillforms_sanitize_text_deeply( $string, true );

	// Now we need to convert the string without tags: &lt; back to < (same for quotes).
	$string = wp_kses_decode_entities( html_entity_decode( $string, ENT_QUOTES ) );

	// And now we need to sanitize AGAIN, to avoid unwanted tags that appeared after decoding.
	return quillforms_sanitize_text_deeply( $string, true );
}

/**
 * Clean variables using sanitize_text_field. Arrays are cleaned recursively.
 * Non-scalar values are ignored.
 * This function is forked from Woocommerce.
 *
 * @since 1.0.0
 *
 * @param string|array $var Data to sanitize.
 *
 * @return string|array
 */
function quillforms_clean( $var ) {
	if ( is_array( $var ) ) {
		return array_map( 'quillforms_clean', $var );
	} else {
		return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
	}
}


/**
 * Get a shared logger instance.
 * This function is forked from Woocommerce
 *
 * Use the quillforms_logging_class filter to change the logging class. You may provide one of the following:
 *     - a class name which will be instantiated as `new $class` with no arguments
 *     - an instance which will be used directly as the logger
 * In either case, the class or instance *must* implement Logger_Interface.
 *
 * @since 1.0.0
 * @see Logger_Interface
 *
 * @return Logger
 */
function quillforms_get_logger() {
	static $logger = null;

	$class = apply_filters( 'quillforms_logging_class', Logger::class );

	if ( null !== $logger && is_string( $class ) && is_a( $logger, $class ) ) {
		return $logger;
	}

	$implements = class_implements( $class );

	if ( is_array( $implements ) && in_array( Logger_Interface::class, $implements, true ) ) {
		$threshold = Settings::get( 'log_level', 'info' );
		$logger    = is_object( $class ) ? $class : new $class( null, $threshold );
	} else {
		_doing_it_wrong(
			__FUNCTION__,
			sprintf(
				/* translators: 1: class name 2: quillforms_logging_class 3: Logger_Interface */
				__( 'The class %1$s provided by %2$s filter must implement %3$s.', 'quillforms' ),
				'<code>' . esc_html( is_object( $class ) ? get_class( $class ) : $class ) . '</code>',
				'<code>quillforms_logging_class</code>',
				'<code>Logger_Interface</code>'
			),
			'1.0.0'
		);

		$logger = is_a( $logger, Logger::class ) ? $logger : new Logger();
	}

	return $logger;
}

/**
 * Trigger logging cleanup using the logging class.
 *
 * @since 1.0.0
 */
function quillforms_cleanup_logs() {
	$logger = quillforms_get_logger();

	if ( is_callable( array( $logger, 'clear_expired_logs' ) ) ) {
		$logger->clear_expired_logs();
	}
}
add_action( 'quillforms_cleanup_logs', 'quillforms_cleanup_logs' );

/**
 * Get client ip address
 * https://github.com/easydigitaldownloads/easy-digital-downloads/blob/master/includes/misc-functions.php
 *
 * @since 1.19.0
 *
 * @return string
 */
function quillforms_get_client_ip() {
	$ip = false;

	if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
		// Check ip from share internet.
		$ip = filter_var( wp_unslash( $_SERVER['HTTP_CLIENT_IP'] ), FILTER_VALIDATE_IP );
	} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
		// To check ip is pass from proxy.
		// Can include more than 1 ip, first is the public one.
		// WPCS: sanitization ok.
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$ips = explode( ',', wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) );
		if ( is_array( $ips ) ) {
			$ip = filter_var( $ips[0], FILTER_VALIDATE_IP );
		}
	} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
		$ip = filter_var( wp_unslash( $_SERVER['REMOTE_ADDR'] ), FILTER_VALIDATE_IP );
	}

	$ip = false !== $ip ? $ip : '127.0.0.1';

	// Fix potential CSV returned from $_SERVER variables.
	$ip_array = explode( ',', $ip );
	$ip_array = array_map( 'trim', $ip_array );

	return apply_filters( 'quillforms_entry_meta_ip', $ip_array[0] );
}

/**
 * Get client ip address hash
 *
 * @since 1.19.0
 *
 * @return string
 */
function quillforms_get_client_ip_hash() {
	return sha1( 'quillforms-' . quillforms_get_client_ip() );
}

/**
 * Find array in arrays has specific key and value
 *
 * @since 1.13.0
 *
 * @param array[] $arrays Array of arrays.
 * @param string  $key    Key.
 * @param mixed   $value  Value.
 * @return array|null
 */
function quillforms_arrays_find( $arrays, $key, $value ) {
	foreach ( $arrays as $array ) {
		if ( $array[ $key ] === $value ) {
			return $array;
		}
	}
	return null;
}

/**
 * Find object in objects has specific key and value
 *
 * @since 1.21.0
 *
 * @param object[] $objects Array of objects.
 * @param string   $key    Key.
 * @param mixed    $value  Value.
 * @return object|null
 */
function quillforms_objects_find( $objects, $key, $value ) {
	foreach ( $objects as $object ) {
		if ( $object->{$key} === $value ) {
			return $object;
		}
	}
	return null;
}
