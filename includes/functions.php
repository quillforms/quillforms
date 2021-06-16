<?php
/**
 * Some helper functions.
 *
 * @since 1.0.0
 * @package QuillForms
 */

use QuillForms\Interfaces\Logger_Interface;
use QuillForms\Logger;

defined( 'ABSPATH' ) || exit;

/**
 * Validate a value based on a schema.
 * This function is forked from rest_validate_value_from_schema core function in wp rest api.
 * The reason we copied this function with a prefix "qf_" is:
 * 1- We have a minimum WP version requirement: 5.4 but we depend on features in this function that have been added in recent versions after 5.4.
 * 2- The core WP REST api is being developed always and we might need features later in future versions, so we will just modify this function
 * to add backward compatibility.
 *
 * @see https://developer.wordpress.org/reference/functions/rest_validate_value_from_schema/
 *
 * @since 1.0.0
 *
 * @param mixed  $value The value to validate.
 * @param array  $args  Schema array to use for validation.
 * @param string $param The parameter name, used in error messages.
 * @return true|WP_Error
 */
function qf_rest_validate_value_from_schema( $value, $args, $param = '' ) {
	if ( isset( $args['anyOf'] ) ) {
		$matching_schema = rest_find_any_matching_schema( $value, $args, $param );
		if ( is_wp_error( $matching_schema ) ) {
			return $matching_schema;
		}

		if ( ! isset( $args['type'] ) && isset( $matching_schema['type'] ) ) {
			$args['type'] = $matching_schema['type'];
		}
	}

	if ( isset( $args['oneOf'] ) ) {
		$matching_schema = rest_find_one_matching_schema( $value, $args, $param );
		if ( is_wp_error( $matching_schema ) ) {
			return $matching_schema;
		}

		if ( ! isset( $args['type'] ) && isset( $matching_schema['type'] ) ) {
			$args['type'] = $matching_schema['type'];
		}
	}

	$allowed_types = array( 'array', 'object', 'string', 'number', 'integer', 'boolean', 'null' );

	if ( ! isset( $args['type'] ) ) {
		/* translators: %s: Parameter. */
		_doing_it_wrong( __FUNCTION__, sprintf( __( 'The "type" schema keyword for %s is required.' ), $param ), '5.5.0' );
	}

	if ( is_array( $args['type'] ) ) {
		$best_type = rest_handle_multi_type_schema( $value, $args, $param );

		if ( ! $best_type ) {
			return new WP_Error(
				'rest_invalid_type',
				/* translators: 1: Parameter, 2: List of types. */
				sprintf( __( '%1$s is not of type %2$s.' ), $param, implode( ',', $args['type'] ) ),
				array( 'param' => $param )
			);
		}

		$args['type'] = $best_type;
	}

	if ( ! in_array( $args['type'], $allowed_types, true ) ) {
		_doing_it_wrong(
			__FUNCTION__,
			/* translators: 1: Parameter, 2: The list of allowed types. */
			wp_sprintf( __( 'The "type" schema keyword for %1$s can only be one of the built-in types: %2$l.' ), $param, $allowed_types ),
			'5.5.0'
		);
	}

	switch ( $args['type'] ) {
		case 'null':
			$is_valid = rest_validate_null_value_from_schema( $value, $param );
			break;
		case 'boolean':
			$is_valid = rest_validate_boolean_value_from_schema( $value, $param );
			break;
		case 'object':
			$is_valid = rest_validate_object_value_from_schema( $value, $args, $param );
			break;
		case 'array':
			$is_valid = rest_validate_array_value_from_schema( $value, $args, $param );
			break;
		case 'number':
			$is_valid = rest_validate_number_value_from_schema( $value, $args, $param );
			break;
		case 'string':
			$is_valid = rest_validate_string_value_from_schema( $value, $args, $param );
			break;
		case 'integer':
			$is_valid = rest_validate_integer_value_from_schema( $value, $args, $param );
			break;
		default:
			$is_valid = true;
			break;
	}

	if ( is_wp_error( $is_valid ) ) {
		return $is_valid;
	}

	if ( ! empty( $args['enum'] ) ) {
		$enum_contains_value = rest_validate_enum( $value, $args, $param );
		if ( is_wp_error( $enum_contains_value ) ) {
			return $enum_contains_value;
		}
	}

	// The "format" keyword should only be applied to strings. However, for backward compatibility,
	// we allow the "format" keyword if the type keyword was not specified, or was set to an invalid value.
	if ( isset( $args['format'] )
		&& ( ! isset( $args['type'] ) || 'string' === $args['type'] || ! in_array( $args['type'], $allowed_types, true ) )
	) {
		switch ( $args['format'] ) {
			case 'hex-color':
				if ( ! rest_parse_hex_color( $value ) ) {
					return new WP_Error( 'rest_invalid_hex_color', __( 'Invalid hex color.' ) );
				}
				break;

			case 'date-time':
				if ( ! rest_parse_date( $value ) ) {
					return new WP_Error( 'rest_invalid_date', __( 'Invalid date.' ) );
				}
				break;

			case 'email':
				if ( ! is_email( $value ) ) {
					return new WP_Error( 'rest_invalid_email', __( 'Invalid email address.' ) );
				}
				break;
			case 'ip':
				if ( ! rest_is_ip_address( $value ) ) {
					/* translators: %s: IP address. */
					return new WP_Error( 'rest_invalid_ip', sprintf( __( '%s is not a valid IP address.' ), $param ) );
				}
				break;
			case 'uuid':
				if ( ! wp_is_uuid( $value ) ) {
					/* translators: %s: The name of a JSON field expecting a valid UUID. */
					return new WP_Error( 'rest_invalid_uuid', sprintf( __( '%s is not a valid UUID.' ), $param ) );
				}
				break;
		}
	}

	return true;
}

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
function qf_sanitize_text_fields( $str, $keep_newlines = false ) {
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
function qf_sanitize_text_deeply( $string, $keep_newlines = false ) {

	if ( is_object( $string ) || is_array( $string ) ) {
		return '';
	}

	$string        = (string) $string;
	$keep_newlines = (bool) $keep_newlines;

	$new_value = qf_sanitize_text_fields( $string, $keep_newlines );

	if ( strlen( $new_value ) !== strlen( $string ) ) {
		$new_value = qf_sanitize_text_deeply( $new_value, $keep_newlines );
	}

	return $new_value;
}

/**
 * Sanitize key, primarily used for looking up options.
 *
 * @since 1.0.0
 *
 * @param string $key The key that should be sanitized.
 *
 * @return string
 */
function qf_sanitize_key( $key = '' ) {
	return preg_replace( '/[^a-zA-Z0-9_\-\.\:\/]/', '', $key );
}

/**
 * Get the value of a specific QuillForms setting.
 * Forked from WPForms.
 *
 * @since 1.0.0
 *
 * @param string $key     The key.
 * @param mixed  $default The default value.
 * @param string $option  The option.
 *
 * @return mixed
 */
function qf_setting( $key, $default = false, $option = 'qf_settings' ) {

	$key     = qf_sanitize_key( $key );
	$options = get_option( $option, false );
	$value   = is_array( $options ) && ! empty( $options[ $key ] ) ? wp_unslash( $options[ $key ] ) : $default;

	return $value;
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
function qf_implode_non_blank( $separator, $array ) {

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
function qf_decode_string( $string ) {

	if ( ! is_string( $string ) ) {
		return $string;
	}

	/*
	 * Sanitization should be done first, so tags are stripped and < is converted to &lt; etc.
	 * This iteration may do nothing when the string already comes with &lt; and &gt; only.
	 */
	$string = qf_sanitize_text_deeply( $string, true );

	// Now we need to convert the string without tags: &lt; back to < (same for quotes).
	$string = wp_kses_decode_entities( html_entity_decode( $string, ENT_QUOTES ) );

	// And now we need to sanitize AGAIN, to avoid unwanted tags that appeared after decoding.
	return qf_sanitize_text_deeply( $string, true );
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
function qf_clean( $var ) {
	if ( is_array( $var ) ) {
		return array_map( 'qf_clean', $var );
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
function qf_get_logger() {
	static $logger = null;

	$class = apply_filters( 'quillforms_logging_class', Logger::class );

	if ( null !== $logger && is_string( $class ) && is_a( $logger, $class ) ) {
		return $logger;
	}

	$implements = class_implements( $class );

	if ( is_array( $implements ) && in_array( Logger_Interface::class, $implements, true ) ) {
		$logger = is_object( $class ) ? $class : new $class();
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
function qf_cleanup_logs() {
	$logger = qf_get_logger();

	if ( is_callable( array( $logger, 'clear_expired_logs' ) ) ) {
		$logger->clear_expired_logs();
	}
}
add_action( 'quillforms_cleanup_logs', 'qf_cleanup_logs' );
