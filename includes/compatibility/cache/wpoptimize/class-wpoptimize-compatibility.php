<?php
/**
 * WP Optimize Compatibility
 *
 * @since 1.8.2
 *
 * @package Compatibility
 */

namespace QuillForms;

/**
 * The class is responsible for making Quill Forms compatible with WP Optimize plugin.
 *
 * @since 1.8.2
 */
class Wpoptimize_Compatibility {


	/**
	 * Hooks
	 *
	 * @static
	 * @since 1.8.2
	 */
	public static function hooks() {
		add_filter( 'wp-optimize-minify-default-exclusions', array( __CLASS__, 'exclude_quillforms_pages' ) );
	}

	/**
	 * Exclude Quill Forms js.
	 *
	 * @static
	 * @since 1.8.2
	 *
	 * @param array $default_exclusions The exclude list.
	 *
	 * @return array $default_exclusions
	 */
	public static function exclude_quillforms_pages( $default_exclusions ) {
		if ( is_singular( 'quill_forms' ) ) {
			$default_exclusions[] = 'wp-content/plugins/quillforms';
			$default_exclusions[] = 'wp-content/plugins/QuillForms';
			$default_exclusions[] = 'wp-content/plugins/quillforms-*';
			$default_exclusions[] = 'wp-includes/js/dist';
			$default_exclusions[] = 'lodash';
			$default_exclusions[] = 'quillforms-blocks';
			$default_exclusions[] = 'wp-includes/js/tinymce';
			$default_exclusions[] = 'js/jquery/jquery.js';
			$default_exclusions[] = 'js/jquery/jquery.min.js';
		}
		return $default_exclusions;
	}

}
Wpoptimize_Compatibility::hooks();
