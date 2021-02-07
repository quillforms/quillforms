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
class QF_Date_Block extends QF_Block {

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
		return __( 'Date', 'quillforms' );
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
			'admin'    => 'quillforms-blocklib-date-block-admin-style',
			'renderer' => 'quillforms-blocklib-date-block-renderer-style',
		);
	}

	/**
	 * Get block scripts
	 *
	 * @since 1.0.0
	 */
	public function get_block_scripts() {
		return array(
			'admin'    => 'quillforms-blocklib-date-block-admin-script',
			'renderer' => 'quillforms-blocklib-date-block-renderer-script',
		);
	}

	/**
	 * Get block attributes.
	 *
	 * @since 1.0.0
	 *
	 * @return array The initial attributes
	 */
	public function get_attributes() {
		return $this->get_metadata()['attributes'];
	}

	/**
	 * Validate field value
	 * The validation should be done by setting $this->is_valid true or false and setting the validation message  $this->validation_err
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $messages The form messages
	 */
	public function validate_field( $value, $messages ) {
		if ( ! empty( $value ) ) {
			$format    = $this->attributes['format'];
			$separator = $this->attributes['separator'];
			if ( 'MMDDYYYY' === $format ) {
				$date_format = 'MM' + $separator + 'DD' + $separator + 'YYYY';
			} elseif ( 'DDMMYYYY' === $format ) {
				$date_format = 'DD' + $separator + 'MM' + $separator + 'YYYY';
			} else {
				$date_format = 'YYYY' + $separator + 'MM' + $separator + 'DD';
			}
			$d = DateTime::createFromFormat( $date_format, $value );
			// The Y ( 4 digits year ) returns TRUE for any integer with any number of digits so changing the comparison from == to === fixes the issue.
			$is_valid_date = $d && $d->format( $date_format ) === $value;

			if ( ! $is_valid_date ) {
				$this->is_valid       = false;
				$this->validation_err = $messages['label.errorAlert.date'];
			}
		} else {
			if ( $this->required ) {
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

}

QF_Blocks_Factory::get_instance()->register( new QF_Date_Block() );
