<?php
/**
 * REST API: Theme Controller
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage API
 */

namespace QuillForms\REST_API\Controllers\V1;

use QuillForms\Abstracts\REST_Controller;
use QuillForms\Form_Theme;
use QuillForms\Models\Form_Theme_Model;
use WP_Error;
use WP_REST_Response;
use WP_REST_Server;
use WP_User;

/**
 * REST_Form_Theme_Controller is REST api controller class for form themes
 *
 * @since 1.0.0
 */
class REST_Form_Theme_Controller extends REST_Controller {

	/**
	 * REST Base
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $rest_base = 'themes';

	/**
	 * Register the routes for the controller.
	 *
	 * @since 1.0.0
	 */
	public function register_routes() {

		$namespace = $this->namespace;

		$base = $this->rest_base;

		register_rest_route(
			$namespace,
			'/' . $base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( true ),
				),

			)
		);
		register_rest_route(
			$namespace,
			'/' . $base . '/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'context' => array(
							'default' => 'view',
						),
					),
				),
				array(
					'methods'             => 'PUT',
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
	 * Prepare item for database
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared_theme = array();

		// Theme ID.
		if ( isset( $request['id'] ) ) {
			$existing_theme = $this->get_item( $request );
			if ( is_wp_error( $existing_theme ) ) {
				return $existing_theme;
			}

			$prepared_theme['ID'] = (int) $request['id'];
		}

		if ( isset( $request['title'] ) && is_string( $request['title'] ) ) {
			$prepared_theme['theme_title'] = $request['title'];
		}
		if ( isset( $request['author'] ) ) {
			$user = new WP_User( $request['author'] );

			if ( $user->exists() ) {
				$prepared_theme['theme_author'] = $user->ID;
			} else {
				return new WP_Error(
					'quillforms_rest_theme_author_invalid',
					__( 'Invalid theme author ID.', 'quillforms' ),
					array( 'status' => 400 )
				);
			}
		}

		if ( isset( $request['properties'] ) && is_array( $request['properties'] ) ) {
			$prepared_theme['theme_properties'] = $request['properties'];
		}

		return $prepared_theme;
	}

	/**
	 * Prepare item for the REST response
	 *
	 * @since 1.0.0
	 *
	 * @param mixed           $item WordPress representation of the item.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return mixed
	 */
	public function prepare_item_for_response( $item, $request ) {

		$response = new WP_REST_Response( $item, 200 );
		return $response;
	}
	/**
	 * Get all themes.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {

		$data = Form_Theme_Model::get_all_registered_themes();

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Get a specific theme.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_item( $request ) {
		$theme_id = $request['id'];
		$data     = Form_Theme_Model::get_theme( $theme_id );

		if ( $data ) {
			return new WP_REST_Response( $data, 200 );
		} else {
			return new WP_Error( 'quillforms_theme_not_found', __( 'Theme not found', 'quillforms' ) );
		}
	}

	/**
	 * Create one item from the collection.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Request
	 */
	public function create_item( $request ) {
		$theme = $this->prepare_item_for_database( $request );

		if ( is_wp_error( $theme ) ) {
			return new WP_Error( $theme->get_error_code(), $theme->get_error_message(), array( 'status' => 400 ) );
		}

		$result = Form_Theme_Model::insert_theme( $theme );
		if ( ! $result || is_wp_error( $result ) ) {
			return new WP_Error( 'quillforms_error_on_insertion_in_db', __( 'Error on insertion in DB!', 'quillforms' ), array( 'status' => 400 ) );
		}

		$response = $this->prepare_item_for_response( $result, $request );

		return rest_ensure_response( $response );
	}

	/**
	 * Update item permission check
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function update_item_permissions_check( $request ) {
		$capability = 'edit_quillform';
		return current_user_can( $capability, $request );

	}

	/**
	 * Update one item from the collection
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Request
	 */
	public function update_item( $request ) {
		$theme = $this->get_item( $request );
		if ( is_wp_error( $theme ) ) {
			return $theme;
		}
		$theme = $this->prepare_item_for_database( $request );

		if ( is_wp_error( $theme ) ) {
			return new WP_Error( $theme->get_error_code(), $theme->get_error_message(), array( 'status' => 400 ) );
		}

		$result = Form_Theme_Model::insert_theme( $theme );
		if ( ! $result ) {
			return new WP_Error( 'quillforms_error_on_insertion_in_db', __( 'Error on insertion in DB!', 'quillforms' ) );
		}

		$response = $this->prepare_item_for_response( $result, $request );

		return rest_ensure_response( $response );
	}

	/**
	 * Check if a given request has access to delete theme.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {

		$capability = 'read_quillform';

		return current_user_can( $capability, $request );

	}
	/**
	 * Delete one item from the collection
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_RESPONSE
	 */
	public function delete_item( $request ) {

		$theme_id = $request['id'];

		$result = Form_Theme_Model::delete_theme( $theme_id );

		if ( is_wp_error( $result ) ) {
			return $result;
		}
		$response = new WP_REST_Response();

		$response->set_data(
			array(
				'deleted' => true,
			)
		);

		return $response;
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function delete_item_permissions_check( $request ) {

		$capability = 'edit_quillforms';

		return current_user_can( $capability, $request );

	}

	/**
	 * Check if a given request has access to get a specific item
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_item_permissions_check( $request ) {

		$capability = 'edit_quillform';
		return current_user_can( $capability, $request );
	}

	/**
	 * Check if a given request has access to get a specific item
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function create_item_permissions_check( $request ) {
		$capability = 'edit_quillform';
		return current_user_can( $capability, $request );

	}

	/**
	 * Get item schema
	 *
	 * @since 1.0.0
	 *
	 * @return array Theme item schema
	 */
	public function get_item_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'theme',
			'type'       => 'object',
			'properties' => array(
				'id'           => array(
					'description' => __( 'Unique identifier for the theme.', 'quillforms' ),
					'type'        => 'integer',
					'readonly'    => true,
				),
				'title'        => array(
					'description' => __( 'Theme title.', 'quillforms' ),
					'type'        => 'string',
					'required'    => true,
				),
				'author'       => array(
					'description' => __( 'Theme author', 'quillforms' ),
					'type'        => 'integer',
				),
				'properties'   => array(
					'description' => __( 'Theme properties.', 'quillforms' ),
					'type'        => 'object',
					'properties'  => Form_Theme::instance()->get_theme_properties(),
				),
				'date_created' => array(
					'description' => __( 'The date the theme was created', 'quillforms' ),
					'type'        => 'date-time',
				),
				'date_updated' => array(
					'description' => __( 'The date the theme was updated', 'quillforms' ),
					'type'        => 'date-time',
				),

			),
		);
		return $schema;
	}

}
