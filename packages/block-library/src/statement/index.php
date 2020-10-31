<?php
/**
 * Block Library: class QF_Statement
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Statement Block
 *
 * @class QF_Statement
 *
 * @since 1.0.0
 */
class QF_Statement extends QF_Block {

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
		return  $this->get_metadata()['type'];
	}

	/**
	 * Get meta data
	 * This file is just for having some shared properties between front end and back end.
	 * Just as the block type.
	 *
	 * @access private
	 *
	 * @return string metadata from block.json file
	 */
	private function get_metadata() {
		if ( ! $this->metadata ) {
			$this->metadata = json_decode(
				file_get_contents( trailingslashit( dirname( __FILE__ ) ) . 'statement/block.json' ),
				true
			);
		}
		return $this->metadata;
	}

	/**
	 * Get Block Name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() {
		return __( 'Statement', 'quillforms' );
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
			'editable'    => false,
			'required'    => true,
			'attachment'  => true,
			'description' => true,
			'jumpLogic'   => true,
			'calculator'  => false,
		);
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
			'buttonText'     => array(
				'type'    => 'string',
				'default' => 'Continue',
			),
			'quotationMarks' => array(
				'type'    => 'boolean',
				'default' => true,
			),
		);
	}
}

QF_Blocks_Factory::get_instance()->register( new QF_Statement() );
