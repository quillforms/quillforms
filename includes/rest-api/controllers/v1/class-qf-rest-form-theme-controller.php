<?php
/**
 * REST API: Theme Controller
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage API
 */

defined( 'ABSPATH' ) || exit;

/**
 * QF_REST_Form_Theme_Controller is REST api controller class for form themes
 *
 * @since 1.0.0
 */
class QF_REST_Form_Theme_Controller extends QF_REST_Controller {

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

		$data = QF_Form_Theme_Model::get_all_registered_themes();

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
		$data     = QF_Form_Theme_Model::get_theme_data( $theme_id );

		if ( $data ) {
			return new WP_REST_Response( $data, 200 );
		} else {
			return new WP_Error( 'qf_theme_not_found', __( 'Theme not found', 'quillforms' ) );
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
		global $wpdb;
		$theme = $this->prepare_item_for_database( $request );

		if ( is_wp_error( $theme ) ) {
			return new WP_Error( $theme->get_error_code(), $theme->get_error_message(), array( 'status' => 400 ) );
		}

		$result = $wpdb->insert(
			$wpdb->prefix . 'quillforms_themes',
			array_map(
				function( $property ) {
					return $property['type'];
				},
				QF_Theme::get_theme_schema()
			)
		);

		if ( ! $result ) {
			return new WP_Error( 'qf_error_on_insertion_in_db', __( 'Error on insertion in DB!', 'quillforms' ) );
		}

		$response = $this->prepare_item_for_response( $result, $request );

		return $response;
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
		$theme_id = $request['id'];

		return $response;
	}

	/**
	 * Delete one item from the collection
	 *
	 * @since 2.4-beta-1
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Request
	 */
	public function delete_item( $request ) {

		$form_id = $request['id'];

		return $response;
	}

	/**
	 * Check if a given request has access to get items
	 *
	 * @since 2.4-beta-1
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_items_permissions_check( $request ) {
		/**
		 * Filters the capability required to get forms via the REST API.
		 *
		 * @since 1.0.0
		 *
		 * @param string|array    $capability The capability required for this endpoint.
		 * @param WP_REST_Request $request    Full data about the request.
		 */
		$capability = apply_filters( 'quillforms_edit_theme', $request );

	}

	/**
	 * Check if a given request has access to get a specific item
	 *
	 * @since 2.4-beta-1
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function get_item_permissions_check( $request ) {
		/**
		 * Filters the capability required to get forms via the REST API.
		 *
		 * @since 2.4
		 *
		 * @param string|array    $capability The capability required for this endpoint.
		 * @param WP_REST_Request $request    Full data about the request.
		 */
		$capability = apply_filters( 'quillforms_edit_theme', $request );
		return $this->current_user_can_any( $capability, $request );
	}

}
