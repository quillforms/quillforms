<?php
/**
 * Metafields: class QF_Metafield
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Metafield
 *
 * @since 1.0.0
 */
abstract class QF_Metafield {

	/**
	 * Get slug
	 *
	 * @since 1.0.0
	 * @abstract
	 */
	abstract public function get_slug();

	/**
	 * Get callback
	 *
	 * @since 1.0.0
	 * @abstract
	 */
	abstract public function get_callback();

	/**
	 * Update callback
	 *
	 * @since 1.0.0
	 * @abstract
	 */
	abstract public function update_callback();

	/**
	 * Get schema
	 * The schema term is pretty much like the schema in WordPress rest api.
	 * The get_schema function is preffered to be overriden to overriden to apply the schema for metafield.
	 * However, this isn't necessary. This is just the best practice to validate and sanitize metafield value.
	 *
	 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/schema
	 * @since 1.0.0
	 * @return mixed|null The schema
	 */
	public function get_schema() {
		return null;
	}
}
