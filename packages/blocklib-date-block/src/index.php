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
 * @class QF_Date_Block_Type
 *
 * @since 1.0.0
 */
class QF_Date_Block_Type extends QF_Block_Type {

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
	 * Get block admin assets
	 *
	 * @since 1.0.0
	 *
	 * @return array The block admin assets
	 */
	public function get_block_admin_assets() : iterable {
		return array(
			'style'  => 'quillforms-blocklib-date-block-admin-style',
			'script' => 'quillforms-blocklib-date-block-admin-script',
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
			'style'  => 'quillforms-blocklib-date-block-renderer-style',
			'script' => 'quillforms-blocklib-date-block-renderer-script',
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
	 * Validate field value
	 * The validation should be done by setting $this->is_valid true or false and setting the validation message  $this->validation_err
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value     The value to validate.
	 * @param array $form_data The form data.
	 */
	public function validate_field( $value, $form_data ) : void {
		$messages = $form_data['messages'];
		if ( ! empty( $value ) ) {
			$format    = $this->attributes['format'];
			$separator = $this->attributes['separator'];
			if ( 'MMDDYYYY' === $format ) {
				$date_format = 'm' . $separator . 'd' . $separator . 'Y';
			} elseif ( 'DDMMYYYY' === $format ) {
				$date_format = 'd' . $separator . 'm' . $separator . 'Y';
			} else {
				$date_format = 'Y' . $separator . 'm' . $separator . 'd';
			}

			$d = DateTime::createFromFormat( $date_format, $value );

			// The Y ( 4 digits year ) returns TRUE for any integer with any number of digits so changing the comparison from == to === fixes the issue.
			$is_valid_date = $d && $d->format( $date_format ) === $value;

			if ( ! $is_valid_date ) {
				$this->is_valid       = false;
				$this->validation_err = $messages['label.errorAlert.date'];
			}
		} else {
			if ( $this->attributes['required'] ) {
				$this->is_valid       = false;
				$this->validation_err = $messages['label.errorAlert.required'];
			}
		}

	}
	/**
	 * Get meta data
	 * This file is just for having some shared properties between front end and back end.
	 * Just as the block type.
	 *
	 * @access private
	 *
	 * @return array metadata from block.json file
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

}

QF_Blocks_Manager::get_instance()->register( new QF_Date_Block_Type() );
