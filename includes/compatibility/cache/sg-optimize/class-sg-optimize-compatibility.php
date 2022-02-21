<?php
/**
 * SiteGround Compatibility
 *
 * @since 1.8.2
 *
 * @package Compatibility
 */

namespace QuillForms;

/**
 * The class is responsible for making Quill Forms compatible with siteground optimize plugin.
 *
 * @since 1.8.2
 */
class SG_Optimize_Compatibility {

	/**
	 * Hooks
	 *
	 * @static
	 * @since 1.8.2
	 */
	public static function hooks() {
		add_filter( 'sgo_javascript_combine_exclude', array( __CLASS__, 'exclude_quillforms_pages' ) );
		add_filter( 'sgo_js_minify_exclude', array( __CLASS__, 'exclude_quillforms_pages' ) );
		add_filter( 'sgo_js_async_exclude', array( __CLASS__, 'exclude_quillforms_pages' ) );

	}

	/**
	 * Exclude Quill Forms js.
	 *
	 * @static
	 * @since 1.8.2
	 *
	 * @param array $exclude_list The exclude list.
	 *
	 * @return array $exclude_list
	 */
	public static function exclude_quillforms_pages( $exclude_list ) {
		if ( is_singular( 'quill_forms' ) ) {
			$exclude_list[] = 'wp-content/plugins/quillforms';
			$exclude_list[] = 'wp-content/plugins/QuillForms';
			$exclude_list[] = 'wp-content/plugins/quillforms-*';
			$exclude_list[] = 'wp-includes/js/dist';
			$exclude_list[] = 'wp-includes/js/tinymce';
			$exclude_list[] = 'js/jquery/jquery.js';
			$exclude_list[] = 'js/jquery/jquery.min.js';

			$exclude_list[] = 'react';
			$exclude_list[] = 'react-dom';
			$exclude_list[] = 'emotion';
			$exclude_list[] = 'jquery';
			$exclude_list[] = 'lodash';
			$exclude_list[] = 'quillforms-blocks';
			$exclude_list[] = 'quillforms-*';
			$exclude_list[] = 'quillforms-renderer-core';
			$exclude_list[] = 'wp-autop';
			$exclude_list[] = 'wp-data';
			$exclude_list[] = 'wp-i18n';
			$exclude_list[] = 'wp-escape-html';
			$exclude_list[] = 'regenerator-runtime';
			$exclude_list[] = 'wp-deprecated';
			$exclude_list[] = 'wp-dom';
			$exclude_list[] = 'wp-compose';
			$exclude_list[] = 'wp-priority-queue';
			$exclude_list[] = 'wp-keycodes';
			$exclude_list[] = 'wp-is-shallow-equal';
			$exclude_list[] = 'wp-redux-routine';
			$exclude_list[] = 'quillforms-blocklib-date-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-dropdown-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-email-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-long-text-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-multiple-choice-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-number-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-short-text-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-statement-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-website-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-welcome-screen-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-rating-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-phone-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-address-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-file-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-opinion-scale-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-picture-choice-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-matrix-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-slider-block-renderer-script';
			$exclude_list[] = 'quillforms-blocklib-custom-thankyouscreen-block-renderer-script';
			$exclude_list[] = 'quillforms-stripe-renderer';
			$exclude_list[] = 'quillforms-paypal-renderer';
			$exclude_list[] = 'quillforms-logic-renderer';
			$exclude_list[] = 'wp-element';
			$exclude_list[] = 'quillforms-config';
			$exclude_list[] = 'quillforms-utils';
			$exclude_list[] = 'wp-hooks';
		}
		return $exclude_list;
	}
}

SG_Optimize_Compatibility::hooks();
