<?php
/**
 * Class: Import
 *
 * @since 2.12.2
 * @package QuillForms
 */

namespace QuillForms\Import_Export;

use WP_Error;

/**
 * Importer Class
 *
 * @since 2.12.2
 */
class Importer {

	/**
	 * Csv.
	 *
	 * @since 2.12.2
	 *
	 * @var array
	 */
	private $json_data = array();

	/**
	 * Constructor
	 */
	public function __construct( $json_data ) {
		$this->json_data = $json_data;
	}

	/**
	 * Import
	 *
	 * @since 2.12.2
	 *
	 * @return array
	 */
	public function import() {
		$forms = array();
		foreach ( $this->json_data ?? array() as $form ) {
			$forms[] = $this->import_form( $form );
		}
		return $forms;
	}

	/**
	 * Import Form
	 *
	 * @since 2.12.2
	 *
	 * @param array $form Form data.
	 *
	 * @return array
	 */
	private function import_form( $form ) {
		// Form Title.
		$form_title = $this->prepare_form_title( $form['form_title'] );
		$form_data  = array(
			'post_title'  => $form_title,
			'post_status' => $form['form_status'],
			'post_type'   => 'quill_forms',
		);

		try {
			$form_id = wp_insert_post( $form_data );

			// Form Description.
			$form_description = $form['form_description'];

			// Update form description.
			update_post_meta( $form_id, 'description', $form_description );

			// Form Meta.
			$form_meta = $form['form_meta'] ?? array();

			// Update all form meta.
			foreach ( $form_meta as $key => $meta ) {
				update_post_meta( $form_id, $key, $meta );
			}
		} catch ( \Exception $e ) {
			return new WP_Error(
				'quillforms_form_insertion_failed',
				__( 'Form insertion failed.', 'quillforms' ),
				array( 'status' => 500 )
			);
		}

		// Return form id.
		return $form_id;
	}

	/**
	 * Prepare Form Title
	 *
	 * @since 2.12.2
	 *
	 * @param string $form_title Form title.
	 *
	 * @return string
	 */
	private function prepare_form_title( $form_title ) {
		// Check if form title exists in database.
		$form_title_exists = get_page_by_title( $form_title, OBJECT, 'quill_forms' );
		if ( $form_title_exists ) {
			// Get number.
			$number = preg_replace( '/.*\((\d+)\)$/', '$1', $form_title );
			$number = $number ? intval( $number ) + 1 : 1;
			// Remove old number.
			$form_title = preg_replace( '/\(\d+\)$/', '', $form_title );
			$form_title = "{$form_title} ({$number})";
			$form_title = $this->prepare_form_title( $form_title );
		}

		return $form_title;
	}

}
