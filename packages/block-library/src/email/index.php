<?php
/**
 * Block Library: class QF_Email
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Email Block
 *
 * @class    QF_Email
 *
 * @since 1.0.0
 */
class QF_Email extends QF_Block {

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
	 * Get Block Name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() {
		return __( 'Email', 'quillforms' );
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
			'calculator'  => false,
		);
	}

	/**
	 * Get block attributes.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block attributes
	 */
	public function get_attributes() {
		return array();
	}

	/**
	 * Get logic value type
	 * Possible values: text, number, choices and date.
	 * In jump logic, we need a way to present this field input.
	 * We can present the field input according to its type i.e:
	 * Text input is rendered if value type is text
	 * Number input is rendered if value type is number
	 * Select with options is rendered if value type is choices
	 * Date picker is rendered if value type is date
	 *
	 * @since 1.0.0
	 *
	 * @return string The value type
	 */
	public function get_value_type() {
		return 'text';
	}

	/**
	 * Get field logical operators.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_logical_operators() {
		return array( 'is', 'is_not', 'greater_than', 'lower_than', 'starts_with', 'contains', 'ends_with', 'not_contains' );
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
				file_get_contents( trailingslashit( dirname( __FILE__ ) ) . 'email/block.json' ),
				true
			);
		}
		return $this->metadata;
	}

	/**
	 * Validate Field.
	 *
	 * @param mixed $value The field value.
	 *
	 * @since 1.0.0
	 */
	public function validate_field( $value ) {
		if ( $this->required && ! empty( $value ) ) {
			return true;
		}
	}
}


QF_Blocks_Factory::get_instance()->register( new QF_Email() );
