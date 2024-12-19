<?php
/**
 * QuillForms Plugin Entries Class
 *
 * @since next.version
 *
 * @package QuillForms
 */

namespace QuillForms\Entries;

use QuillForms\Entry as Abstract_Entry;

/**
 * Class Entries
 *
 * @since next.version
 */
class Entries {

	/**
	 * Instance of Entries
	 *
	 * @since next.version
	 *
	 * @var Entries
	 */
	private static $instance = null;

	/**
	 * Get Instance
	 *
	 * @since next.version
	 *
	 * @return Entries
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since next.version
	 */
	private function __construct() {
		add_filter( 'quillforms_entry_save', array( $this, 'save_entry' ), 10 );
		add_filter( 'quillforms_entry_retrieve', array( $this, 'retrieve_entry' ), 10, 5 );
		add_action( 'delete_post', array( $this, 'delete_form_entries' ), 10, 2 );
		add_action( 'quillforms_provider_connection_processed', array( $this, 'save_connection_process_status' ), 10, 5 );
	}

	/**
	 * Save form submission entry
	 *
	 * @since next.version
	 *
	 * @param Abstract_Entry $entry Entry.
	 * @return array
	 */
	public function save_entry( $entry ) {
		// copy entry properties.
		$_entry = new Entry();
		foreach ( $entry as $key => $value ) {
			$_entry->$key = $value;
		}

		// Check if entry already exists.
		$existing_entry = apply_filters( 'quillforms_get_existing_entry', false, $_entry );
		if ( $existing_entry instanceof Entry ) {
			// update.
			$result = $existing_entry->update_entry( $_entry );
		} else {
			// insert.
			$result = $_entry->insert();
		}

		return $result ? $_entry : $entry;
	}

	/**
	 * Retrieve entry
	 *
	 * @since 1.4.0
	 *
	 * @param Entry   $entry
	 * @param int     $form_id
	 * @param int     $entry_id
	 * @param boolean $records
	 * @param boolean $meta
	 * @return Entry
	 */
	public function retrieve_entry( $entry, $form_id, $entry_id, $records, $meta ) {
		if ( ! $entry ) {
			$entry = Entry::get( $entry_id );
			if ( $records ) {
				$entry->load_records();
			}
			if ( $meta ) {
				$entry->load_meta();
			}
		}

		return $entry;
	}

	/**
	 * Delete entries of form on form deletion
	 *
	 * @param int     $post_id Id of deleted post.
	 * @param WP_Post $post Object of deleted post.
	 * @return void
	 */
	public function delete_form_entries( $post_id, $post ) {
		if ( $post->post_type === 'quill_forms' ) {
			Entry::delete_all( $post_id );
		}
	}

	/**
	 * Save connection process status
	 *
	 * @since 1.4.0
	 *
	 * @param int    $form_id
	 * @param string $provider
	 * @param string $connection_id
	 * @param int    $entry_id
	 * @param array  $result
	 * @return void
	 */
	public function save_connection_process_status( $form_id, $provider, $connection_id, $entry_id, $result ) {
		if ( $entry_id ) {
			$entry          = new Entry();
			$entry->ID      = $entry_id;
			$entry->form_id = $form_id;
			$entry->load_meta();

			$meta_key = "{$provider}_connection_{$connection_id}_process_status";
			if ( $entry->get_meta_value( $meta_key ) ) {
				$entry->update_meta( "{$provider}_connection_{$connection_id}_process_status", array( 'value' => $result['status'] ) );
			} else {
				$entry->insert_meta( "{$provider}_connection_{$connection_id}_process_status", array( 'value' => $result['status'] ) );
			}
		}
	}
}
