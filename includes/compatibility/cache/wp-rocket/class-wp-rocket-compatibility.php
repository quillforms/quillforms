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
		add_filter( 'rocket_exclude_defer_js', array( __CLASS__, 'exclude_quillforms_js_defer' ) );
		add_filter( 'rocket_exclude_js', array(__CLASS__, 'exclude_js') );
	
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

	/**
	 * Exclude Quill Forms JS from defer JS
	 *
	 * @param array $urls Array of URLs to exclude from defer JS.
	 * @return array Updated array of URLs
	 */
	public static function exclude_quillforms_js_defer( $urls ) {
		// all files inside Quill Forms and Quill Forms plugins that start with (quillforms-*) directory and subdirectories
		$urls[] = "/wp-content/plugins/quillforms/(.*)";
		$urls[] = "/wp-content/plugins/quillforms-(.*)/(.*)";

		return $urls;
	}

	public static function exclude_js( $excluded_js ) {
		return array_merge(
			$excluded_scripts,
			[
				rocket_clean_exclude_file( QUILLFORMS_PLUGIN_URL .  'build/(.*).js' ),
			]
		);
	}
}
WPRocket_Compatibility::hooks();
