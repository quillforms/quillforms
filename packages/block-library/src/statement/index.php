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
		return __( 'Statement', 'quillforms' );
	}

	/**
	 * Get Supports
	 *
	 * @since 1.0.0
	 *
	 * @return array The supports array.
	 */
	public function get_supports() {
		return array(
			'displayOnly' => true,
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
		return self::$metadata['attributes'];
	}
}

$file                   = trailingslashit( dirname( __FILE__ ) ) . 'statement/block.json';
$metadata               = json_decode( file_get_contents( $file ), true );
QF_Statement::$metadata = $metadata;
QF_Blocks_Factory::get_instance()->register( new QF_Statement() );
