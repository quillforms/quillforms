<?php
/**
 * Settings_Controller class.
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

use QuillForms\Addon\REST\Settings_Controller as Abstract_Settings_Controller;
use WP_Error;
use WP_REST_Response;

/**
 * Settings_Controller abstract class.
 *
 * @since 1.6.0
 */
abstract class Settings_Controller extends Abstract_Settings_Controller {

	/**
	 * Delete settings.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete( $request ) { // phpcs:ignore
		// delete accounts through accounts class.
		$accounts = $this->addon->accounts->get_accounts();
		foreach ( array_keys( $accounts ) as $account_id ) {
			$this->addon->accounts->remove_account( $account_id );
		}

		return parent::delete( $request );
	}

}
