<?php
/**
 * Class: Export
 *
 * @since 2.12.2
 * @package QuillForms
 */

namespace QuillForms\Import_Export;

/**
 * Exporter Class
 *
 * @since 2.12.2
 */
class Exporter {

	/**
	 * Forms
	 *
	 * @since 2.12.2
	 *
	 * @var array
	 */
	private $form_ids = array();

	/**
	 * Constructor
	 *
	 * @since 2.12.2
	 */
	public function __construct( $form_ids ) {
		$this->form_ids = $form_ids;
	}

	/**
	 * Export
	 *
	 * @since 2.12.2
	 *
	 * @return array
	 */
	public function export() {
		// Query to get forms with $forms ids array.
		$forms = get_posts(
			array(
				'post_type'      => 'quill_forms',
				'posts_per_page' => -1,
				'post__in'       => $this->form_ids,
			)
		);

		// If no forms found, return error.
		if ( empty( $forms ) ) {
			return new WP_Error(
				'quillforms_no_forms_found',
				__( 'No forms found.', 'quillforms' ),
				array( 'status' => 404 )
			);
		}

		// Start build json file.
		$json = array();

		// Loop through forms.
		foreach ( $forms as $form ) {
			$form_id = $form->ID;

			// Get form title.
			$form_title = get_the_title( $form_id );

			// Get form description.
			$form_description = get_post_meta( $form_id, 'description', true );

			// Get form status.
			$form_status = get_post_status( $form_id );

			// Get all form meta.
			$form_meta = get_post_meta( $form_id );

			// Build form meta array.
			$form_meta_array = array();
			foreach ( $form_meta as $key => $value ) {
				$form_meta_array[ $key ] = get_post_meta( $form_id, $key, true );
			}

			// Build form array.
			$form_array = array(
				'form_id'          => $form_id,
				'form_title'       => $form_title,
				'form_description' => $form_description,
				'form_status'      => $form_status,
				'form_meta'        => $form_meta_array,
			);

			// Push form array to json array.
			array_push( $json, $form_array );
		}

		$filename = 'quillforms-export-' . date( 'Y-m-d' ) . '.json';
		if ( ini_get( 'display_errors' ) ) {
			ini_set( 'display_errors', '0' );
		}

		header( 'X-Robots-Tag: noindex', true );
		header( 'Content-Description: File Transfer' );
		header( 'Content-Disposition: attachment; filename=' . $filename );
		header( 'Content-Type: application/json; charset=' . get_option( 'blog_charset' ), true );

		echo wp_json_encode( $json );
		exit;
	}
}
