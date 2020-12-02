<?php
/**
 * Block Library: class QF_Date
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Date Block
 *
 * @class    QF_Date
 *
 * @since 1.0.0
 */
class QF_Multiple_Choice extends QF_Block {

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
				file_get_contents( trailingslashit( dirname( __FILE__ ) ) . 'multiple-choice/block.json' ),
				true
			);
		}
		return $this->metadata;
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
	 * Get Block Name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() {
		return __( 'Multiple Choice', 'quillforms' );
	}

	/**
	 * Get Block Default Properties.
	 *
	 * @since 1.0.0
	 *
	 * @return array The initial attributes
	 */
	public function get_attributes() {
		return array(
			'choices'  => array(
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
						'ref'   => '124e4567-e89b-12d3-a456-426614174000',
						'label' => 'Choice 1',
						'score' => '0',
					),
				),
			),
			'multiple' => array(
				'type' => 'boolean',
			),
			'setScore' => array(
				'type'    => 'boolean',
				'default' => false,
			),
		);
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
		return 'choices';
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

QF_Blocks_Factory::get_instance()->register( new QF_Multiple_Choice() );
