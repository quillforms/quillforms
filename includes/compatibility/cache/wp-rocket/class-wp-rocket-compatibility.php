<?php
/**
 * WP Rocket Compatibility
 *
 * @since 1.13.0
 *
 * @package Compatibility
 */

namespace QuillForms;

/**
 * The class is responsible for making Quill Forms compatible with Autoptimize plugin.
 *
 * @since 1.13.0
 */
class WPRocket_Compatibility {


	/**
	 * Hooks
	 *
	 * @static
	 * @since 1.13.0
	 */
	public static function hooks() {
		add_filter( 'rocket_cache_reject_uri', array( __CLASS__, 'exclude_quillforms_pages' ) );
	}

	/**
	 * Exclude Quill Forms pages from cache
	 *
	 * @param array $urls Array of URLs to exclude from cache.
	 * @return array Updated array of URLs
	 */
	public static function exclude_quillforms_pages( $urls ) {
		$urls[] = "/quillforms/(.*)";
		return $urls;
	}
}
WPRocket_Compatibility::hooks();
