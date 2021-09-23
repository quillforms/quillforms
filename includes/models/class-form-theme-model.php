<?php
/**
 * Form Theme Model: Form_Theme_Model class.
 *
 * @package QuillForms
 * @since 1.0.0
 */

namespace QuillForms\Models;

use QuillForms\Form_Theme;
use WP_Error;

/**
 * Form theme model class is used for interacting with quillforms_themes db table.
 *
 * @since 1.0.0
 */
class Form_Theme_Model {

	/**
	 * Get all registered themes.
	 *
	 * @since 1.0.0
	 * @static
	 * @global $wpdb
	 *
	 * @return array The applied theme data
	 */
	public static function get_all_registered_themes() {

		global $wpdb;
		$all_themes = $wpdb->get_results(
			"
					SELECT ID, theme_title, theme_properties
					FROM {$wpdb->prefix}quillforms_themes
				",
			ARRAY_A
		);

		if ( ! empty( $all_themes ) ) {
			return array_map(
				function( $theme ) {
					return array(
						'id'         => intVal( $theme['ID'] ),
						'title'      => $theme['theme_title'],
						'properties' => Form_Theme::instance()->prepare_theme_properties_for_render( maybe_unserialize( $theme['theme_properties'] ) ),

					);
				},
				$all_themes
			);
		}
		return $all_themes;
	}

	/**
	 * Get theme.
	 *
	 * @since 1.0.0
	 * @static
	 * @global $wpdb
	 *
	 * @param int $theme_id The form id.
	 *
	 * @return array The applied theme data
	 */
	public static function get_theme( $theme_id ) {
		global $wpdb;

		$data = array();
		if ( ! empty( $theme_id ) ) {
			$res = $wpdb->get_row(
				$wpdb->prepare(
					"
							SELECT theme_title, theme_properties
							FROM {$wpdb->prefix}quillforms_themes
							WHERE ID = %s
						",
					$theme_id
				),
				ARRAY_A
			);

			if ( ! $res || empty( $res ) ) {
				return null;
			}

			$data = $res;
		}
		if ( empty( $data ) ) {
			return null;
		}
		return  array(
			'title'      => $data['theme_title'],
			'properties' => Form_Theme::instance()->prepare_theme_properties_for_render( maybe_unserialize( $data['theme_properties'] ) ),
		);
	}

	/**
	 * Insert a new theme or update existing one.
	 *
	 * @since 1.0.0
	 * @global $wpdb
	 *
	 * @param array $theme_arr {
	 *     An array of elements that make up a theme to update or insert.
	 *      @type int    $ID                    The theme ID. If equal to something other than 0,
	 *                                          the theme with that ID will be updated. Default 0.
	 *      @type int    $theme_author          The ID of the user who added the theme. Default is
	 *                                          the current user ID.
	 *
	 *      @type array  $theme_properties {
	 *         An array of theme properties.
	 *         @type string    $font                  The font family.
	 *         @type string    $backgroundColor       The background color.
	 *         @type string    $backgroundImage       The background image.
	 *         @type string    $questionsColor        The color of questions.
	 *         @type string    $answersColor          The color of answers.
	 *         @type string    $buttonsFontColor      The font color of buttons.
	 *         @type string    $buttonsBgColor        The background color for buttons.
	 *         @type string    $errorsFontColor       The errors font color.
	 *         @type string    $errorBgColor          The errors background color.
	 *         @type string    $progressBarFillColor  The progress bar fill color.
	 *         @type string    $progressBarBgColor    The progress bar background color.
	 *      }
	 *
	 *      @type string $date_created          The date of the theme. Default is the current time.
	 *      @type string $date_updated          The date when the theme was last modified. Default is
	 *                                              the current time.
	 * }
	 */
	public static function insert_theme( $theme_arr ) {
		global $wpdb;
		$user_id  = get_current_user_id();
		$defaults = array(
			'theme_author'     => $user_id,
			'theme_title'      => '',
			'theme_properties' => array(),
		);

		$theme_arr = wp_parse_args( $theme_arr, $defaults );

		$theme_title = $theme_arr['theme_title'];

		$theme_properties = $theme_arr['theme_properties'];
		if ( ! is_array( $theme_properties ) ) {
			$theme_properties = array();
		}
		$theme_properties = maybe_serialize( $theme_properties );

		/*
		* If the theme date is empty (due to having been new ), set date to now.
		*/
		if ( empty( $theme_arr['date_created'] ) || '0000-00-00 00:00:00' === $theme_arr['date_created'] ) {
			$date_created = current_time( 'mysql' );

		} else {
			$date_created = $theme_arr['post_date'];
		}

		// Are we updating or creating?
		$theme_id = 0;
		$update   = false;

		if ( ! empty( $theme_arr['ID'] ) ) {
			$update = true;

			// Get the theme ID.
			$theme_id     = $theme_arr['ID'];
			$theme_before = self::get_theme( $theme_id );

			if ( is_null( $theme_before ) ) {
				return new WP_Error( 'quillforms_invalid_theme', __( 'Invalid theme ID.', 'quillforms' ) );
			}
		}

		// Validate the date.
		$mm         = substr( $date_created, 5, 2 );
		$jj         = substr( $date_created, 8, 2 );
		$aa         = substr( $date_created, 0, 4 );
		$valid_date = wp_checkdate( $mm, $jj, $aa, $date_created );
		if ( ! $valid_date ) {
			return new WP_Error( 'invalid_date', __( 'Invalid date.', 'quillforms' ) );
		}

		if ( $update || '0000-00-00 00:00:00' === $date_created ) {
			$date_updated = current_time( 'mysql' );
		} else {
			$date_updated = $date_created;
		}

		$theme_author = isset( $theme_arr['theme_author'] ) ? $theme_arr['theme_author'] : $user_id;

		$where = array( 'ID' => $theme_id );

		$data = compact( 'theme_author', 'date_created', 'date_updated', 'theme_title', 'theme_properties' );

		if ( $update ) {

			if ( false === $wpdb->update( "{$wpdb->prefix}quillforms_themes", $data, $where ) ) {
				$message = __( 'Could not update theme in the database.', 'quillforms' );

				return new WP_Error( 'quillforms_db_update_theme_error', $message, $wpdb->last_error );
			}
		} else {

			if ( false === $wpdb->insert( "{$wpdb->prefix}quillforms_themes", $data ) ) {

				$message = __( 'Could not insert theme into the database.', 'quillforms' );

				return new WP_Error( 'quillforms_db_insert_theme_error', $message, $wpdb->last_error );

			}

			$theme_id = (int) $wpdb->insert_id;
		}

		return $theme_id;
	}

	/**
	 * Delete a theme by its id
	 *
	 * @since 1.0.0
	 *
	 * @param int $theme_id Theme id.
	 *
	 * @return WP_Error|bool The result of theme deletion
	 */
	public static function delete_theme( $theme_id ) {
		global $wpdb;

		if ( ! self::get_theme( $theme_id ) ) {
			return new WP_Error( 'quillforms_theme_not_found', __( 'Theme not found', 'quillforms' ), array( 'status' => 400 ) );
		}
		$wpdb->delete(
			"{$wpdb->prefix}quillforms_themes",
			array(
				'ID' => $theme_id,
			)
		);

		return true;

	}

}
