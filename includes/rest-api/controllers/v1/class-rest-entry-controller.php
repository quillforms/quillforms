<?php
/**
 * Class REST_Entry_Controller
 *
 * @since next.version
 * @package QuillForms
 */

 namespace QuillForms\REST_API\Controllers\V1;

use QuillForms\Abstracts\REST_Controller;
use QuillForms\Core;
use QuillForms\Managers\Blocks_Manager;
use QuillForms\Entries\Entry;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST_Entry_Controller
 *
 * @since next.version
 */
class REST_Entry_Controller extends REST_Controller {

	/**
	 * REST Base
	 *
	 * @since next.version
	 *
	 * @var string
	 */
	protected $rest_base = 'forms/(?P<form_id>[\d]+)/entries';

	/**
	 * Register the routes for the controller.
	 *
	 * @since next.version
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => $this->get_collection_params(),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_items' ),
					'permission_callback' => array( $this, 'delete_items_permissions_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<entry_id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( false ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Get the Entry schema, conforming to JSON Schema.
	 *
	 * @since next.version
	 *
	 * @return array
	 */
	public function get_item_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'entry',
			'type'       => 'object',
			'properties' => array(
				'id'           => array(
					'description' => __( 'Unique identifier for the entry.', 'quillforms' ),
					'type'        => 'integer',
					'readonly'    => true,
				),
				'form_id'      => array(
					'description' => __( 'The Form ID for the entry.', 'quillforms' ),
					'type'        => 'integer',
					'required'    => true,
					'readonly'    => false,
				),
				'is_starred'   => array(
					'description' => __( 'Whether the entry is starred.', 'quillforms' ),
					'type'        => 'integer',
					'readonly'    => false,
				),
				'is_read'      => array(
					'description' => __( 'Whether the entry has been read.', 'quillforms' ),
					'type'        => 'integer',
					'readonly'    => false,
				),
				'status'       => array(
					'description' => __( 'The status of the entry.', 'quillforms' ),
					'type'        => 'string',
					'readonly'    => false,
				),
				'date_created' => array(
					'description' => __( 'The date the entry was created, in UTC.', 'quillforms' ),
					'type'        => 'date-time',
					'readonly'    => false,
				),
				'date_updated' => array(
					'description' => __( 'The date the entry was updated, in UTC.', 'quillforms' ),
					'type'        => 'date-time',
					'readonly'    => false,
				),
			),
		);
		return $schema;
	}

	/**
	 * Retrieves the query params for the collections.
	 *
	 * @since next.version
	 *
	 * @return array Query parameters for the collection.
	 */
	public function get_collection_params() {
		$result = parent::get_collection_params();

		// override maximum items per page.
		$result['per_page']['maximum'] = 10000000;

		return $result;
	}

	/**
	 * Get all entries.
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$from      = $request->get_param( 'from' );
		$to        = $request->get_param( 'to' );
		$form_id   = $request->get_param( 'form_id' );
		$form_data = Core::get_form_data( $form_id );

		$per_page = $request->get_param( 'per_page' );
		$page     = $request->get_param( 'page' );
		$offset   = $per_page * ( $page - 1 );
		$entries  = Entry::get_all( $form_id, $from, $to, $offset, $per_page );

		$total_items  = Entry::get_entries_count( $form_id, $from, $to );
		$total_pages  = ceil( $total_items / $per_page );
		$total_unread = Entry::get_entries_count( $form_id, $from, $to, false );

		$records = ( $request->get_param( 'records' ) ?? 'true' ) === 'true';
		$meta    = ( $request->get_param( 'meta' ) ?? 'true' ) === 'true';

		$data = array(
			'items'        => array_map(
				function( $entry ) use ( $form_data, $records, $meta ) {
					$result = array(
						'ID'           => $entry->ID,
						'form_id'      => $entry->form_id,
						'is_starred'   => $entry->is_starred,
						'is_read'      => $entry->is_read,
						'date_created' => get_date_from_gmt( $entry->date_created ),
						'date_updated' => get_date_from_gmt( $entry->date_created ),
						'status'       => $entry->status ?? 'completed',
					);

					if ( $records ) {
						$entry->load_records();
						$result['records'] = $entry->get_readable_records( $form_data, 'html' );
					}

					if ( $meta ) {
						$entry->load_meta();
						$result['meta'] = $entry->meta;
					}

					return $result;
				},
				$entries
			),
			'total_items'  => $total_items,
			'total_unread' => $total_unread,
			'page'         => $page,
			'per_page'     => $per_page,
			'total_pages'  => $total_pages,
		);

		if ( $records ) {
			$data['records_info'] = $this->get_records_info( $form_data );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Check if a given request has access to get all items.
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Delete multiple items.
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function delete_items( $request ) {
		$ids = empty( $request['ids'] ) ? array() : explode( ',', $request['ids'] );
		foreach ( $ids as $id ) {
			$entry     = new Entry();
			$entry->ID = $id;
			$entry->delete();
		}

		return new WP_REST_Response( array( 'success' => true ), 200 );
	}

	/**
	 * Delete items permission check
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function delete_items_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Update one item from the collection
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Request
	 */
	public function update_item( $request ) {
		$entry     = new Entry();
		$entry->ID = $request->get_param( 'entry_id' );
		$data      = array();
		$updatable = array( 'is_starred', 'is_read' );
		foreach ( $updatable as $key ) {
			if ( isset( $request[ $key ] ) ) {
				$data[ $key ] = $request[ $key ];
			}
		}
		$updated = $entry->update( $data );

		if ( ! $updated ) {
			return new WP_Error( 'quillforms_entries_db_error_on_updating_entry', __( 'Error on updating entry in db!', 'quillforms' ), array( 'status' => 422 ) );
		}

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Update item permission check
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function update_item_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Delete one item from the collection
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_RESPONSE
	 */
	public function delete_item( $request ) {
		$entry     = new Entry();
		$entry->ID = $request->get_param( 'entry_id' );
		$deleted   = $entry->delete();

		if ( ! $deleted ) {
			return new WP_Error( 'quillforms_entries_db_error_on_deleting_entry', __( 'Error on deleting entry in db!', 'quillforms' ), array( 'status' => 422 ) );
		}

		return new WP_REST_Response( true, 200 );
	}

	/**
	 * Delete item permission check
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function delete_item_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

	/**
	 * Get records info for render
	 *
	 * @since next.version
	 *
	 * @param array $form_data
	 * @return array
	 */
	protected function get_records_info( $form_data ) {
		$records_info = array(
			'fields'        => array(),
			'variables'     => array(),
			'hidden_fields' => array(),
		);

		// fields.
		foreach ( $this->get_blocks_recursively( $form_data['blocks'] ) as $block_data ) {
			$block_type = Blocks_Manager::instance()->create( $block_data );
			if ( $block_type === false || ! $block_type->supported_features['editable'] ) {
				continue;
			}
			$records_info['fields'][ $block_data['id'] ] = array(
				'label'      => $block_data['attributes']['label'],
				'name'       => $block_data['name'],
				'attributes' => $block_data['attributes'],
			);
		}

		// variables.
		if ( ! empty( $form_data['logic'] ) ) {
			foreach ( $form_data['logic']['variables'] as $variable_id => $variable_data ) {
				$records_info['variables'][ $variable_id ] = array(
					'label' => $variable_data['label'],
				);
			}
		}

		// hidden_fields.
		if ( ! empty( $form_data['hidden_fields'] ) ) {
			foreach ( $form_data['hidden_fields'] as $field ) {
				$records_info['hidden_fields'][ $field['name'] ] = array(
					'label' => $field['name'],
				);
			}
		}

		return $records_info;
	}

	 /**
	  * Get all blocks recursively (including innerBlocks).
	  *
	  * @param array $blocks
	  *
	  * @return array|null The form blocks recursively
	  *
	  * @since next.version
	  */
	public function get_blocks_recursively( $blocks ) {
		 $all_blocks = array();
		if ( ! empty( $blocks ) ) {
			foreach ( $blocks as $block ) {
				$block_type   = Blocks_Manager::instance()->create( $block );
				$all_blocks[] = $block;
				if ( $block_type && isset( $block_type->supported_features['innerBlocks'] ) ) {
					if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) ) {
						foreach ( $block['innerBlocks'] as $child_block ) {
							$all_blocks[] = $child_block;
						}
					}
				}
			}
		}

		return $all_blocks;
	}

}
