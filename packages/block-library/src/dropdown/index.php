<?php
/**
 * Block Library: class QF_Dropdown
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * The dropdown block
 *
 * @class QF_Dropdown
 * @since 1.0.0
 */
class QF_Dropdown extends QF_Block {

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
	 * Get Block Name
	 * The block name that will appear for admin.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() {
		return __( 'Dropdown', 'quillforms' );
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
	 * @since 1.0.0
	 *
	 * @param mixed $value The field value.
	 *
	 * @return WP_Error|bool True or false.
	 */
	public function validate_field( $value ) {
		if ( $this->required && ! empty( $value ) ) {
			return true;
		}
	}
}

$file                  = trailingslashit( dirname( __FILE__ ) ) . 'dropdown/block.json';
$metadata              = json_decode( file_get_contents( $file ), true );
QF_Dropdown::$metadata = $metadata;
QF_Blocks_Factory::get_instance()->register( new QF_Dropdown() );
