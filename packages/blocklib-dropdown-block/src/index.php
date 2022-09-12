<?php
/**
 * Block Library: class Dropdown_Block_Type
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

namespace QuillForms\Blocks;

use QuillForms\Abstracts\Block_Type;
use QuillForms\Managers\Blocks_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * The dropdown block
 *
 * @class Dropdown_Block_Type
 * @since 1.0.0
 */
class Dropdown_Block_Type extends Block_Type {

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
		 * @return string The block unique name
		 */
	public function get_name() : string {
		return $this->get_metadata()['name'];
	}

	/**
	 * Get block supported features.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block supported features
	 */
	public function get_block_supported_features() : iterable {
		return $this->get_metadata()['supports'];
	}

	/**
	 * Get block styles
	 *
	 * @since 1.0.0
	 *
	 * @return array The block admin assets
	 */
	public function get_block_admin_assets() : iterable {
		return array(
			'style'  => 'quillforms-blocklib-dropdown-block-admin-style',
			'script' => 'quillforms-blocklib-dropdown-block-admin-script',
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
			'style'  => 'quillforms-blocklib-dropdown-block-renderer-style',
			'script' => 'quillforms-blocklib-dropdown-block-renderer-script',
		);
	}

	/**
	 * Get block custom attributes.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block custom attributes
	 */
	public function get_custom_attributes() : iterable {
		return $this->get_metadata()['attributes'];
	}

	/**
	 * Get logical operators
	 *
	 * @since 1.0.0
	 *
	 * @return array The logical operators
	 */
	public function get_logical_operators() : iterable {
		return $this->get_metadata()['logicalOperators'];
	}

	/**
	 * Get meta data from block.json file.
	 * This file is just for having some shared properties between front end and back end.
	 *
	 * @access private
	 *
	 * @return array|null metadata from block . json file
	 */
	private function get_metadata() : iterable {
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
	private function get_dir() : string {
		return trailingslashit( dirname( __FILE__ ) );
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
		return $this->attributes['choices'] ?? array();
	}

	/**
	 * Validate Field.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value     The field value.
	 * @param array $form_data The form data.
	 */
	public function validate_field( $value, $form_data ) : void {
		$messages = $form_data['messages'];
		if ( empty( $value ) && $this->attributes['required'] ) {
			$this->is_valid       = false;
			$this->validation_err = $messages['label.errorAlert.required'];
		}
	}

	/**
	 * Get readable value.
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
		$choices      = $this->attributes['choices'];
		$choice_label = '';
		foreach ( $choices as $choice_index => $choice ) {
			if ( $choice['value'] === $value ) {
				$choice_label = $choice['label'];
				if ( ! $choice_label ) {
					$choice_label = 'Choice ' . ( $choice_index + 1 );
				}
				break;
			}
		}
		return $choice_label;
	}
}

Blocks_Manager::instance()->register( new Dropdown_Block_Type() );
