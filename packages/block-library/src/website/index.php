<?php
/**
 * Block Library: class QF_Website
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Website Block
 *
 * @class  QF_Website
 *
 * @since  1.0.0
 */
class QF_Website extends QF_Block {

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
		return __( 'Website', 'quillforms' );
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

$file                 = trailingslashit( dirname( __FILE__ ) ) . 'website/block.json';
$metadata             = json_decode( file_get_contents( $file ), true );
QF_Website::$metadata = $metadata;
QF_Blocks_Factory::get_instance()->register( new QF_Website() );
