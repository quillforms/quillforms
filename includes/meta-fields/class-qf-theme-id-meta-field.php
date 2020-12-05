<?php
/**
 * Metafields: class QF_Theme_ID_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Theme_ID_Meta_Field
 *
 * @since 1.0.0
 */
class QF_Theme_ID_Meta_Field extends QF_Meta_Field {

	/**
	 * Get slug
	 *
	 * @since 1.0.0
	 */
	public function get_slug() {
		return 'theme_id';
	}

	/**
	 * Is array
	 *
	 * @since 1.0.0
	 */
	public function is_array() {
		return false;
	}


	/**
	 * Get Schema
	 *
	 * @since 1.0.0
	 */
	public function get_schema() {
		return array(
			'type' => 'number',
		);
	}
}

QF_Meta_Fields_Factory::get_instance()->register( new QF_Theme_ID_Meta_Field() );
