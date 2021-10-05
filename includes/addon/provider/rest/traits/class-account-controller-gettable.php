<?php
/**
 * Account_Controller_Gettable trait.
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST\Traits;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Account_Controller_Gettable trait.
 *
 * @since 1.6.0
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
			'/' . $this->rest_base . '/(?P<id>[\w]+)',
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
		$id          = $request->get_param( 'id' );
		$account_api = $this->provider->accounts->connect( $id );
		if ( is_wp_error( $account_api ) ) {
			quillforms_get_logger()->error(
				$account_api->get_error_message(),
				array(
					'source'     => static::class . '->' . __FUNCTION__,
					'code'       => $account_api->get_error_code(),
					'account_id' => $id,
				)
			);
			return $account_api;
		}

		$details = $this->get_account_details( $account_api );
		if ( is_wp_error( $details ) ) {
			return $details;
		}
		return new WP_REST_Response( $details, 200 );
	}

	/**
	 * Get account details to be used in get_item
	 *
	 * @since 1.6.0
	 *
	 * @param Account_API $account_api Account API.
	 * @return array|WP_Error
	 */
	abstract protected function get_account_details( $account_api );

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
