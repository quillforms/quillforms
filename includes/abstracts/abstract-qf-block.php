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
		$this->type               = $this->get_type();
		$this->block_name         = $this->get_name();
		$this->block_styles       = $this->get_block_styles();
		$this->block_scripts      = $this->get_block_scripts();
		$this->attributes         = apply_filters( "qf_{$this->type}_block_attributes", $this->get_attributes() );
		$this->logic_operators    = $this->get_logical_operators();
		$this->supported_features = $this->get_block_supported_features();
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
			$this->$property_name = $property_value;
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
		return is_array( $this->attributes ) ?
			$this->attributes :
			array();
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
	final public function prepare_attributes_for_render( $attributes ) {
		// If there are no attribute definitions for the block type, skip
		// processing and return vebatim.
		if ( ! isset( $this->attributes ) ) {
			return $attributes;
		}

		foreach ( $attributes as $attribute_name => $value ) {
			// If the attribute is not defined by the block type, it cannot be
			// validated.
			if ( ! isset( $this->attributes[ $attribute_name ] ) ) {
				continue;
			}

			$schema = $this->attributes[ $attribute_name ];

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
		$missing_schema_attributes = array_diff_key( $this->attributes, $attributes );
		foreach ( $missing_schema_attributes as $attribute_name => $schema ) {
			if ( isset( $schema['default'] ) ) {
				$attributes[ $attribute_name ] = $schema['default'];
			}
		}

		return $attributes;
	}

	/**
	 * Block settings.
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
			'jumpLogic'  => true,
			'calculator' => false,
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
	 * Validate field value
	 * This should be overriden for each block that has [dispalyOnly = false] in supports.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value the value to validate.
	 *
	 * @return true|WP_Error
	 */
	public function validate( $value ) {
		return true;
	}

	/**
	 * Retrieve the field value on submission.
	 *
	 * @param array|string $value The received field value.
	 *
	 * @return array|string
	 */
	public function get_value_submission( $value ) {
		return $value;
	}
}
