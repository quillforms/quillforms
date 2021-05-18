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
 * @class QF_Date
 *
 * @since 1.0.0
 */
class QF_Multiple_Choice_Block extends QF_Block_Type {

	/**
	 * Metadata json file.
	 *
	 * @var string
	 *
	 * @access private
	 */
	private $metadata;

	/**
	 * Get block type
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
	 * Get block name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() {
		return __( 'Multiple Choice', 'quillforms' );
	}

	/**
	 * Get block supported features.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block supported features
	 */
	public function get_block_supported_features() {
		return $this->get_metadata()['supports'];
	}

	/**
	 * Get block styles
	 *
	 * @since 1.0.0
	 */
	public function get_block_styles() {
		return array(
			'admin'    => 'quillforms-blocklib-multiple-choice-block-admin-style',
			'renderer' => 'quillforms-blocklib-multiple-choice-block-renderer-style',
		);
	}

	/**
	 * Get block scripts
	 *
	 * @since 1.0.0
	 */
	public function get_block_scripts() {
		return array(
			'admin'    => 'quillforms-blocklib-multiple-choice-block-admin-script',
			'renderer' => 'quillforms-blocklib-multiple-choice-block-renderer-script',
		);
	}

	/**
	 * Get block custom attributes.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block custom attributes
	 */
	public function get_custom_attributes() {
		return $this->get_metadata()['attributes'];
	}

	/**
	 * Get logical operators.
	 *
	 * @since 1.0.0
	 *
	 * @return array The initial attributes
	 */
	public function get_logical_operators() {
		return $this->get_metadata()['logicalOperators'];
	}


	/**
	 * Get meta data
	 * This file is just for having some shared properties between front end and back end.
	 * Just as the block type.
	 *
	 * @access private
	 *
	 * @return array|null metadata from block . json file
	 */
	private function get_metadata() {
		if ( ! $this->metadata ) {
			$this->metadata = json_decode(
				file_get_contents(
					$this->get_dir() . 'block.json'
				),
				true
			);
		}
		return $this->metadata;
	}

	/**
	 * Get block directory
	 *
	 * @since 1.0.0
	 *
	 * @access private
	 *
	 * @return string The directory path
	 */
	private function get_dir() {
		return trailingslashit( dirname( __FILE__ ) );
	}

	/**
	 * Validate Field.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value     The field value.
	 * @param array $form_data The form data.
	 */
	public function validate_field( $value, $form_data ) {
		$messages = $form_data['messages'];
		if ( empty( $value ) && $this->attributes['required'] ) {
			$this->is_valid       = false;
			$this->validation_err = $messages['label.errorAlert.required'];
		}
	}

	/**
	 * Get merge tag value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value     The entry value.
	 * @param array $form_data The form data.
	 *
	 * @return mixed $value The merged entry value.
	 */
	public function get_merge_tag_value( $value, $form_data ) {
		$choices       = $this->attributes['choices'];
		$choice_labels = array();
		if ( ! empty( $choices ) ) {
			foreach ( $choices as $index => $choice ) {
				if ( in_array( $choice['value'], $value, true ) ) {
					if ( ! $choice['label'] || '' === trim( $choice['label'] ) ) {
						$choice_number   = $index + 1;
						$choice['label'] = "Choice  $choice_number";
					}
					$choice_labels[] = $choice['label'];
				}
			}
		}

		return qf_implode_non_blank( ',', $choice_labels );
	}
}

QF_Blocks_Factory::get_instance()->register( new QF_Multiple_Choice_Block() );
