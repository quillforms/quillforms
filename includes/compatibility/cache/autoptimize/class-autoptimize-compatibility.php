<?php
/**
 * Autoptimize Compatibility
 *
 * @since 1.8.2
 *
 * @package Compatibility
 */

namespace QuillForms;

/**
 * The class is responsible for making Quill Forms compatible with Autoptimize plugin.
 *
 * @since 1.8.2
 */
class Autoptimize_Compatibility {


	/**
	 * Hooks
	 *
	 * @static
	 * @since 1.8.2
	 */
	public static function hooks() {
		add_filter( 'autoptimize_filter_js_exclude', array( __CLASS__, 'exclude_quillforms_pages' ) );
		add_filter('autoptimize_filter_js_noptimize', array( __CLASS__, 'disable_autoptimize_in_quillforms_pages' ) );
	}

	/**
	 * Exclude Quill Forms js.
	 *
	 * @static
	 * @since 1.8.2
	 *
	 * @param string $in The exclude list.
	 *
	 * @return array $in
	 */
	public static function exclude_quillforms_pages( $in ) {
		if ( is_singular( 'quill_forms' ) ) {
			return $in . ', wp-content/plugins/quillforms, wp-content/plugins/QuillForms/, wp-content/plugins/quillforms-*/, wp-includes/js/dist, lodash, quillforms-blocks, wp-includes/js/tinymce/, js/jquery/jquery.js, js/jquery/jquery.min.js, quillforms-blocklib-date-block-renderer-script,
			 quillforms-blocklib-dropdown-block-renderer-script, quillforms-blocklib-email-block-renderer-script, quillforms-blocklib-long-text-block-renderer-script, quillforms-blocklib-multiple-choice-block-renderer-script, quillforms-blocklib-number-block-renderer-script, quillforms-blocklib-short-text-block-renderer-script,
			 quillforms-blocklib-statement-block-renderer-script, quillforms-blocklib-website-block-renderer-script, quillforms-blocklib-welcome-screen-block-renderer-script, quillforms-blocklib-rating-block-renderer-script, quillforms-blocklib-phone-block-renderer-script, quillforms-blocklib-address-block-renderer-script,
			 quillforms-blocklib-file-block-renderer-script, quillforms-blocklib-opinion-scale-block-renderer-script, quillforms-blocklib-picture-choice-block-renderer-script, quillforms-blocklib-matrix-block-renderer-script, quillforms-blocklib-slider-block-renderer-script,
			 quillforms-blocklib-custom-thankyouscreen-block-renderer-script, quillforms-stripe-renderer, quillforms-paypal-renderer, quillforms-logic-renderer';
		} else {
			return $in;
		}
	}

	public static function disable_autoptimize_in_quillforms_pages( $nooptimize ) {
		if ( is_singular( 'quill_forms' ) ) {
			return true;
		}
		return $nooptimize;
	}

}
Autoptimize_Compatibility::hooks();
