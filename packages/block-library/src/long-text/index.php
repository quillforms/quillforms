<?php
/**
 * Block Library: class QF_Long_Text
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Long Text Block
 *
 * @class    QF_Long_Text
 *
 * @since 1.0.0
 */
class QF_Long_Text extends QF_Block {

	/**
	 * Metadata
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	public static $metadata;

	/**
	 * Get Block Type
	 * It must be unique name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block type
	 */
	public function get_type() {
		return self::$metadata['type'];
	}


	/**
	 * Get Block Name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() {
		return __( 'Long Text', 'quillforms' );
	}

	/**
	 * Get Block Default Properties.
	 *
	 * @since 1.0.0
	 *
	 * @return array The initial attributes
	 */
	public function get_attributes() {
		return self::$metadata['attributes'];
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

$file                   = trailingslashit( dirname( __FILE__ ) ) . 'long-text/block.json';
$metadata               = json_decode( file_get_contents( $file ), true );
QF_Long_Text::$metadata = $metadata;

QF_Blocks_Factory::get_instance()->register( new QF_Long_Text() );
