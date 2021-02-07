<?php
/**
 * Blocks API: QF_Block class.
 *
 * @since 1.0.0
 * @package QuillForms/Abstracts
 */

/**
 * Abstract block class which defines some abstract methods that should be overriden
 * to create a block and defaut functions.
 *
 * @since 1.0.0
 */
abstract class QF_Block extends stdClass {

	/**
	 * Block type
	 *
	 * @var string
	 *
	 * @since 1.0.0
	 */
	public $type;

	/**
	 * Block attributes
	 *
	 * @var array
	 *
	 * @since 1.0.0
	 */
	public $attributes;

	/**
	 * Block name
	 *
	 * @var string
	 *
	 * @since 1.0.0
	 */
	public $block_name;

	/**
	 * Is valid
	 *
	 * @var boolean
	 *
	 * @since 1.0.0
	 */
	public $is_valid = true;

	/**
	 * Validation Error message
	 *
	 * @var string
	 *
	 * @since 1.0.0
	 */
	public $validation_err = null;

	/**
	 * Get Block Type
	 * It must be unique name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block type
	 */
	abstract public function get_type();

	/**
	 * Get Block Name
	 * The block name that will appear in public.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	abstract public function get_name();

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Optional. Array or string of arguments for registering  a block type or creating object for existing block type.
	 *                                 Default empty array.
	 */
	public function __construct( $args = array() ) {
		$default_supported_features = array(
			'editable'   => true,
			'required'   => true,
			'attachment' => true,
			'logic'      => true,
			'calculator' => false,
		);
		$this->type                 = $this->get_type();
		$this->block_name           = $this->get_name();
		$this->block_styles         = $this->get_block_styles();
		$this->block_scripts        = $this->get_block_scripts();
		$this->attributes_schema    = $this->get_attributes();
		$this->attributes           = $this->prepare_attributes_for_render();
		$this->logical_operators    = $this->get_logical_operators();
		$this->supported_features   = wp_parse_args( $this->get_block_supported_features(), $default_supported_features );
		$this->set_props( $args );
	}

	/**
	 * Sets block type properties.
	 *
	 * @since 1.0.0
	 * @final
	 *
	 * @param array $args Array or string of arguments for registering a block type.
	 */
	final public function set_props( $args ) {
		// Make sure it is array.
		if ( ! is_array( $args ) ) {
			return;
		}
		foreach ( $args as $property_name => $property_value ) {
			if ( ! in_array( $property_name, array( 'attributes', 'attributes_schema', 'supported_features' ), true ) ) {
				$this->$property_name = $property_value;
			}

			if ( 'attributes' === $property_name ) {
				$this->$property_name = $this->prepare_attributes_for_render( $property_value );
			}
		}
	}

	/**
	 * Get block styles
	 *
	 * @since 1.0.0
	 */
	public function get_block_styles() {
		return array(
			'admin'    => '',
			'renderer' => '',
		);
	}

	/**
	 * Get block scripts
	 *
	 * @since 1.0.0
	 */
	public function get_block_scripts() {
		return array(
			'admin'    => '',
			'renderer' => '',
		);
	}

	/**
	 * Get block attributes.
	 * Block attributes should follow JSON Schema specifications.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block attributes
	 */
	public function get_attributes() {
		return array();
	}


	/**
	 * Validates attributes against the current block attributes schema, populating
	 * defaulted and missing values.
	 *
	 * @since 1.0.0
	 * @final
	 *
	 * @param array $attributes original block attributes.
	 *
	 * @return array prepared block attributes
	 */
	final public function prepare_attributes_for_render( $attributes = array() ) {
		// If there are no attribute definitions for the block type, skip
		// processing and return vebatim.
		if ( ! isset( $this->attributes_schema ) ) {
			return $attributes;
		}

		foreach ( $attributes as $attribute_name => $value ) {
			// If the attribute is not defined by the block type, it cannot be
			// validated.
			if ( ! isset( $this->attributes_schema[ $attribute_name ] ) ) {
				continue;
			}

			$schema = $this->attributes_schema[ $attribute_name ];

			// Validate value by JSON schema. An invalid value should revert to
			// its default, if one exists. This occurs by virtue of the missing
			// attributes loop immediately following. If there is not a default
			// assigned, the attribute value should remain unset.
			$is_valid = rest_validate_value_from_schema( $value, $schema );
			if ( is_wp_error( $is_valid ) ) {
				unset( $attributes[ $attribute_name ] );
			}
		}

		// Populate values of any missing attributes for which the block type
		// defines a default.
		$missing_schema_attributes = array_diff_key( $this->attributes_schema, $attributes );
		foreach ( $missing_schema_attributes as $attribute_name => $schema ) {
			if ( isset( $schema['default'] ) ) {
				$attributes[ $attribute_name ] = $schema['default'];
			}
		}

		return $attributes;
	}

	/**
	 * Block supported features.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block supported features
	 */
	public function get_block_supported_features() {
		return array(
			'editable'   => true,
			'required'   => true,
			'attachment' => true,
			'logic'      => true,
		);
	}

	/**
	 * Get field logical operators.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_logical_operators() {
		return array( 'is', 'is_not', 'greater_than', 'lower_than' );
	}

	/**
	 * Format entry value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed   $value    The entry value that needs to be formatted and may be sanitized.
	 * @param integer $form_id  The form id.
	 *
	 * @return mixed $value The formatted entry value.
	 */
	public function format_entry_value( $value, $form_id ) {
		return $value;
	}

	/**
	 * Retrieve entry value from database and do escaping.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed   $value    The entry value that should be sanitized.
	 * @param integer $form_id  The form id.
	 *
	 * @return mixed  $value    The escaped entry value.
	 */
	public function retrieve_entry_value( $value, $form_id ) {
		return $value;
	}

	/**
	 * Get merge tag value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The entry value.
	 *
	 * @return mixed $value The merged entry value.
	 */
	public function get_merge_tag_value( $value ) {
		return $value;
	}

	/**
	 * Get entry value that should be saved in database.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The entry value.
	 *
	 * @return mixed $value The formatted entry value that should be saved into dababase.
	 */
	public function get_value_entry_save( $value ) {
		return $value;
	}

	/**
	 * Validate field value
	 * The validation should be done by setting $this->is_valid true or false and setting the validation message  $this->validation_err
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value      The value to validate.
	 * @param array $messages   The form messages.
	 */
	public function validate_field( $value, $messages ) {
		// Here we do the validation.
	}

	/**
	 * Check if Form Field value fullfilled the condition
	 *
	 * @since 1.0
	 *
	 * @param  mixed $field_value    The field value.
	 * @param  array $condition      The condition array
	 *
	 * @return bool
	 */
	public static function is_condition_fulfilled( $field_value, $condition ) {

		$condition_value = $condition['value'];
		switch ( $condition['operator'] ) {
			case 'is':
				if ( is_array( $field_value ) ) {
					// possible input is "1" to be compared with 1
					return in_array( $condition_value, $field_value ); //phpcs:ignore WordPress.PHP.StrictInArray.MissingTrueStrict
				}
				if ( is_numeric( $condition_value ) ) {
					return ( (int) $field_value === (int) $condition_value );
				}

				return ( $field_value === $condition_value );
			case 'is_not':
				if ( is_array( $field_value ) ) {
					// possible input is "1" to be compared with 1
					return ! in_array( $condition_value, $field_value ); //phpcs:ignore WordPress.PHP.StrictInArray.MissingTrueStrict
				}

				return ( $field_value !== $condition_value );
			case 'greater_than':
				if ( ! is_numeric( $condition_value ) ) {
					return false;
				}
				if ( ! is_numeric( $field_value ) ) {
					return false;
				}

				return $field_value > $condition_value;
			case 'lower_than':
				if ( ! is_numeric( $condition_value ) ) {
					return false;
				}
				if ( ! is_numeric( $field_value ) ) {
					return false;
				}

				return $field_value < $condition_value;
			case 'contains':
				return ( stripos( $field_value, $condition_value ) === false ? false : true );
			case 'starts_with':
				return substr_compare( $field_value, $condition_value, 0, strlen( $condition_value ) ) === 0;

			case 'ends_with':
				return substr_compare( $field_value, $condition_value, -strlen( $condition_value ) ) === 0;
			default:
				return false;
		}
	}

}
