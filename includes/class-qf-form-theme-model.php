<?php
/**
 * Form Theme Model: QF_Form_Theme_Model class.
 *
 * @package QuillForms
 * @since 1.0.0
 */

/**
 * Form theme model class is used for interacting with qf_themes db table.
 *
 * @since 1.0.0
 */
class QF_Form_Theme_Model {

	/**
	 * Get all registered themes.
	 *
	 * @since 1.0.0
	 * @static
	 * @global $wpdb
	 *
	 * @param int $theme_id The form id.
	 *
	 * @return array The applied theme data
	 */
	public static function get_all_registered_themes() {

		global $wpdb;
			$all_themes = $wpdb->get_results(
				"
					SELECT title, theme_data
					FROM {$wpdb->prefix}quillforms_themes
				"
			);

		return $all_themes;
	}

	/**
	 * Get form theme.
	 *
	 * @since 1.0.0
	 * @static
	 * @global $wpdb
	 *
	 * @param int $theme_id The form id.
	 *
	 * @return array The applied theme data
	 */
	public static function get_theme_data( $theme_id ) {
		global $wpdb;

		$theme_data = array();
		if ( ! empty( $theme_id ) ) {
			$theme_data = $wpdb->get_row(
				$wpdb->prepare(
					"
						SELECT title, theme_data
						FROM {$wpdb->prefix}quillforms_themes
						WHERE ID = %s
			    	",
					$theme_id
				)
			);
		}

		return  QF_Form_Theme::get_instance()->prepare_theme_data_for_render( $theme_data );
	}
}
