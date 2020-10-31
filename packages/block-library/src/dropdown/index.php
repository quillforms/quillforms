<?php
/**
 * Block Library: class QF_Dropdown
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * The dropdown block
 *
 * @class QF_Dropdown
 * @since 1.0.0
 */
class QF_Dropdown extends QF_Block {

	/**
	 * Metadata json file.
	 *
	 * @var string
	 *
	 * @access private
	 */
	private $metadata;

	/**
	 * Get Block Type
	 * It must be unique name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block type
	 */
	public function get_type() {
		return $this->get_metadata()['type'];
	}

	/**
	 * Get block supported features.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block supported features
	 */
	public function get_block_supported_features() {
		return array(
			'editable'    => true,
			'required'    => true,
			'attachment'  => true,
			'description' => true,
			'jumpLogic'   => true,
			'calculator'  => true,
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
	 * Get Block Name
	 * The block name that will appear for admin.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() {
		return __( 'Dropdown', 'quillforms' );
	}

	/**
	 * Get block attributes.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block attributes
	 */
	public function get_attributes() {
		return array(
			'choices'   => array(
				'type'    => 'array',
				'items'   => array(
					'type'       => 'object',
					'properties' => array(
						'ref'   => array(
							'type' => 'string',
						),
						'label' => array(
							'type' => 'string',
						),
						'score' => array(
							'type' => 'boolean',
						),
					),
				),
				'default' => array(
					array(
						'ref'   => '123e4567-e89b-12d3-a456-426614174000',
						'label' => 'Choice 1',
						'score' => '0',
					),
				),
			),
			'set_score' => array(
				'type' => 'boolean',
			),
		);
	}

	/**
	 * Get value type
	 * Possible values: text, number, choices, date or custom.
	 * The value type is useful to know in some cases.
	 * Like for example in jump logic, we need a way to present this field input.
	 * We can present the field input according to its type.
	 *
	 * @since 1.0.0
	 *
	 * @return string The value type
	 */
	public function get_value_type() {
		return 'choices';
	}

	/**
	 * Get meta data
	 * This file is just for having some shared properties between front end and back end.
	 * Just as the block type.
	 *
	 * @access private
	 *
	 * @return string metadata from block . json file
	 */
	private function get_metadata() {
		if ( ! $this->metadata ) {
			$this->metadata = json_decode(
				file_get_contents( trailingslashit( dirname( __FILE__ ) ) . 'dropdown/block.json' ),
				true
			);
		}
		return $this->metadata;
	}

	/**
	 * Validate Field.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The field value.
	 *
	 * @return WP_Error|bool True or false.
	 */
	public function validate_field( $value ) {
		if ( $this->required && ! empty( $value ) ) {
			return true;
		}
	}
}

QF_Blocks_Factory::get_instance()->register( new QF_Dropdown() );
