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
 * Short Text Block
 *
 * @class QF_Short_Text
 *
 * @since 1.0.0
 */
class QF_Short_Text_Block extends QF_Block_Type {

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
		return __( 'Short Text', 'quillforms' );
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
			'admin'    => 'quillforms-blocklib-short-text-block-admin-style',
			'renderer' => 'quillforms-blocklib-short-text-block-renderer-style',
		);
	}

	/**
	 * Get block scripts
	 *
	 * @since 1.0.0
	 */
	public function get_block_scripts() {
		return array(
			'admin'    => 'quillforms-blocklib-short-text-block-admin-script',
			'renderer' => 'quillforms-blocklib-short-text-block-renderer-script',
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
	 * Get logical operators
	 *
	 * @since 1.0.0
	 *
	 * @return array The logical operators
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
	 * @param mixed $value    The field value.
	 * @param array $messages The form messagees.
	 */
	public function validate_field( $value, $messages ) {
		if ( empty( $value ) ) {
			if ( $this->attributes['required'] ) {
				$this->is_valid       = false;
				$this->validation_err = $messages['label.errorAlert.required'];
			}
		} else {
			if ( ! is_string( $value ) ) {
				$this->is_valid       = false;
				$this->validation_err = 'Invalid value passed!';
			} else {
				$set_max_characters = $this->attributes['setMaxCharacters'];
				$max_characters     = $this->attributes['maxCharacters'];
				if ( $set_max_characters && $max_characters && strlen( $value ) > $max_characters ) {
					$this->is_valid       = false;
					$this->validation_err = $messages['label.errorAlert.maxCharacters'];
				}
			}
		}
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
		if ( empty( $value ) ) {
			return '';
		}
		return sanitize_text_field( $value );
	}
}

QF_Blocks_Factory::get_instance()->register( new QF_Short_Text_Block() );
