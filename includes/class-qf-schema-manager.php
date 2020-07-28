<?php
/**
 * Install: class QF_Schema_Manager
 *
 * @since 1.0.0
 * @package QuillForms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class QF_Install is responsible for main set up and creating needed database tables.
 *
 * @since 1.0.0
 */
class QF_Schema_Manager {

	/**
	 * Filter given input data according to the given schema of an object.
	 * This function is prepared for "object" type only in json schema.
	 *
	 * @since 1.0.0
	 *
	 * @param array $data           The data to filter
	 * @param array $obj_schema     The JSON schema for the object
	 *
	 * @return array The filtered data
	 */
	public static function filter_input_data( $data, $obj_schema ) {
		// If there are no attribute definitions for the block type, skip
		// processing and return vebatim.
		if ( ! isset( $obj_schema ) ) {
			return $data;
		}

		foreach ( $data as $attribute_name => $value ) {
			// If the attribute is not defined, it cannot be
			// validated.
			if ( ! isset( $data[ $attribute_name ] ) ) {
				continue;
			}

			$schema = $data[ $attribute_name ];

			// Validate value by JSON schema. An invalid value should revert to
			// its default, if one exists. This occurs by virtue of the missing
			// attributes loop immediately following. If there is not a default
			// assigned, the attribute value should remain unset.
			$is_valid = rest_validate_value_from_schema( $value, $schema );
			if ( is_wp_error( $is_valid ) ) {
				unset( $data[ $attribute_name ] );
			}
		}

		return $data;
	}

	/**
	 * Filter retrieved output data according to the given schema of an object
	 * This function is prepared for "object" type only in json schema.
	 *
	 * @since 1.0.0
	 *
	 * @param array $data       The data to filter
	 * @param array $obj_schema The JSON schema for the object
	 *
	 * @return array The filtered data
	 */
	public static function filter_ouput_data( $data, $obj_schema ) {
		$data = self::filter_input_data( $data, $obj_schema );
		// Populate values of any missing attributes for which the block type
		// defines a default.
		$missing_schema_attributes = array_diff_key( $obj_schema, $data );
		foreach ( $missing_schema_attributes as $attribute_name => $schema ) {
			if ( isset( $schema['default'] ) ) {
				$attributes[ $attribute_name ] = $schema['default'];
			}
		}
	}

	/**
	 * Get defaults from schema
	 * This function is prepared for "object" type only in json schema.
	 *
	 * @since 1.0.0
	 *
	 * @return array The defaults array
	 */
	public function get_defaults( $obj_schema ) {
		if ( ! is_array( $obj_schema ) ) {
			return false;
		}
		return array_filter(
			wp_list_pluck( $obj_schema, 'default' ),
			function( $item ) {
				return isset( $item );
			}
		);
	}
}
