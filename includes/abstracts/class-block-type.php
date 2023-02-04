<?php
/**
 * Blocks API: Block_Type class.
 *
 * @since 1.0.0
 * @package QuillForms/Abstracts
 */

namespace QuillForms\Abstracts;

use QuillForms\Logic_Conditions;
use stdClass;

/**
 * Abstract block class which defines some abstract methods that should be overriden
 * to create a block and defaut functions.
 *
 * @since 1.0.0
 */
abstract class Block_Type extends stdClass {

	/**
	 * Block unique name
	 *
	 * @var string
	 *
	 * @since 1.0.0
	 */
	public $name;

	/**
	 * Block attributes
	 *
	 * @var array
	 *
	 * @since 1.0.0
	 */
	public $attributes;


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
	 * Is value array
	 *
	 * @var boolean
	 */
	protected $is_value_array = false;

	/**
	 * Get Block Type
	 * It must be unique name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block type
	 */
	abstract public function get_name() : string;

	/**
	 * Is value array
	 *
	 * @return boolean
	 */
	public function is_value_array() {
		return $this->is_value_array;
	}

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Optional. Array or string of arguments for registering  a block type or creating object for existing block type.
	 *                                 Default empty array.
	 */
	public function __construct( $args = array() ) {
		$default_supported_features  = array(
			'editable'        => true,
			'required'        => true,
			'attachment'      => true,
			'description'     => true,
			'logic'           => true,
			'logicConditions' => true,
			'theme'           => false,
			'choices'         => false,
			'payments'        => false,
			'points'          => false,
			'innerBlocks'     => false,
		);
		$this->name                  = $this->get_name();
		$this->block_admin_assets    = $this->get_block_admin_assets();
		$this->block_renderer_assets = $this->get_block_renderer_assets();
		$this->supported_features    = wp_parse_args( $this->get_block_supported_features(), $default_supported_features );
		$this->custom_attributes     = $this->get_custom_attributes();
		$this->attributes_schema     = $this->get_attributes_schema();
		$this->attributes            = $this->prepare_attributes_for_render();
		$this->logical_operators     = $this->get_logical_operators();
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
	 * Get block admin assets
	 *
	 * @since 1.0.0
	 *
	 * @return array The block admin assets
	 */
	public function get_block_admin_assets() : iterable {
		return array(
			'style'  => '',
			'script' => '',
		);
	}

	/**
	 * Get block renderer assets
	 *
	 * @since 1.0.0
	 *
	 * @return array The block renderer assets
	 */
	public function get_block_renderer_assets() : iterable {
		return array(
			'style'  => '',
			'script' => '',
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
	public function get_custom_attributes() : iterable {
		return array();
	}


	/**
	 * Get attributes schema
	 *
	 * @since 1.0.0
	 * @final
	 *
	 * @return array $attributes_schema Attributes schema
	 */
	final public function get_attributes_schema() : iterable {
		$attributes_schema = $this->custom_attributes;

		if ( $this->supported_features['required'] ) {
			$attributes_schema['required'] = array(
				'type'    => 'boolean',
				'default' => false,
			);
		}

		if ( $this->supported_features['attachment'] ) {
			$attributes_schema['attachment'] = array(
				'type'       => 'object',
				'properties' => array(
					'url' => array(
						'type' => 'string',
					),
				),
				'default'    => array(),
			);

			$attributes_schema['layout'] = array(
				'type'    => 'string',
				'default' => 'stack'
			);

			$attributes_schema['attachmentFocalPoint'] = array(
				'type' => 'object',
				'default' => array(
					'x' => 0.5,
					'y' => 0.5
				),
			);

			$attributes_schema['attachmentFancyBorderRadius'] = array(
				'type' => 'boolean',
				'default' => false
			);

			$attributes_schema['attachmentBorderRadius'] = array(
				'type' => 'string',
				'default' => '0px'
			);

			$attribute_schema['attachmentMaxWidth'] = array(
				'type' => 'string',
				'default' => 'none'
			);
		}

		if ( $this->supported_features['description'] ) {
			$attributes_schema['description'] = array(
				'type'    => 'string',
				'default' => '',
			);
		}

		if ( $this->supported_features['theme'] ) {
			$attributes_schema['themeId'] = array(
				'type'    => 'number',
				'default' => null,
			);
		}

		$attributes_schema['label'] = array(
			'type'    => 'string',
			'default' => '',
		);

		$attributes_schema['customHTML'] = array(
			'type'    => 'string',
			'default' => '',
		);

		return $attributes_schema;

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
	final public function prepare_attributes_for_render( $attributes = array() ) : iterable {
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
	public function get_block_supported_features() : iterable {
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
	public function get_logical_operators() : iterable {
		return array( 'is', 'is_not', 'greater_than', 'lower_than' );
	}

	/**
	 * Get choices
	 * For blocks that supports choices
	 *
	 * @since 1.13.2
	 *
	 * @return array
	 */
	public function get_choices() {
		return array();
	}

	/**
	 * Sanitize field value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value     The entry value that needs to be formatted and may be sanitized.
	 * @param array $form_data The form data and settings.
	 *
	 * @return mixed $value The formatted entry value.
	 */
	public function sanitize_field( $value, $form_data ) { // phpcs:ignore
		if ( ! is_array( $value ) ) {
			return sanitize_text_field( $value );
		} else {
			return array_map(
				function( $item ) {
					return sanitize_text_field( $item );
				},
				$value
			);
		}
	}

	/**
	 * Validate field value
	 * The validation should be done by setting $this->is_valid true or false and setting the validation message  $this->validation_err
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value       The value to validate.
	 * @param array $form_data   The form data.
	 */
	public function validate_field( $value, $form_data ) { // phpcs:ignore
		// Here we do the validation.
	}

	/**
	 * Format field value
	 * After validation, Format is done for fields to be used or saved.
	 *
	 * @since 1.1.3
	 *
	 * @param mixed $value       The value to validate.
	 * @param array $form_data   The form data.
	 * @return mixed
	 */
	public function format_field( $value, $form_data ) { // phpcs:ignore
		return $value;
	}

	/**
	 * Get numeric value
	 * If the block supports numeric value, this method will be called to get its numeric value.
	 *
	 * @since 1.10.6
	 *
	 * @param mixed $value       The value to validate.
	 * @return number
	 */
	public function get_numeric_value( $value ) {
		return (int) $value;
	}

	/**
	 * Get readable value.
	 * Supported context may be:
	 * - html: may contains html
	 * - spreadsheet: may contains spreadsheet formula
	 * - plain: mustn't contains html
	 * - raw: must be in a unique type and format
	 *
	 * @since 1.0.0
	 *
	 * @param mixed  $value     The entry value.
	 * @param array  $form_data The form data.
	 * @param string $context   The context.
	 *
	 * @return mixed $value The entry value.
	 */
	public function get_readable_value( $value, $form_data, $context = 'html' ) { // phpcs:ignore
		return $value;
	}

	/**
	 * Check if Form Field value fullfilled the condition
	 *
	 * @since 1.0
	 *
	 * @param  mixed $field_value    The field value.
	 * @param  array $condition      The condition array.
	 *
	 * @return bool
	 */
	public function is_condition_fulfilled( $field_value, $condition ) : bool {
		return Logic_Conditions::is_condition_fulfilled( $field_value, $condition );
	}

}
