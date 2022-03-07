<?php
/**
 * Account_Controller_Gettable trait.
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST\Traits;

use QuillForms\Addon\Provider\Provider;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Account_Controller_Gettable trait.
 *
 * @since 1.6.0
 *
 * @property Provider $provider
 */
trait Account_Controller_Gettable {

	/**
	 * Register gettable route
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	protected function register_gettable_route() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[^\/\?]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Retrieves one item from the collection.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $request ) {
		$id   = $request->get_param( 'id' );
		$data = $this->provider->accounts_remote_data->get( $id, true );
		return rest_ensure_response( $data );
	}

	/**
	 * Checks if a given request has access to get a specific item.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
