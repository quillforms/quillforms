<?php
/**
 * REST class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Payment_Gateway\REST;

use QuillForms\Addon\Payment_Gateway\Payment_Gateway;
use QuillForms\Addon\REST\REST as Abstract_REST;

/**
 * REST class.
 *
 * @since 1.3.0
 *
 * @property Payment_Gateway $addon
 */
class REST extends Abstract_REST {

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// + classes from parent.
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Payment_Gateway $addon Payment_Gateway addon.
	 */
	public function __construct( $addon ) {
		parent::__construct( $addon );

		add_filter( 'rest_prepare_quill_forms', array( $this, 'add_rest_data' ), 10, 3 );
	}

	/**
	 * Add addon rest data to quill_forms post type
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Response $response The response object.
	 * @param WP_Post          $post     Post object.
	 * @param WP_REST_Request  $request  Request object.
	 * @return WP_REST_Response
	 */
	public function add_rest_data( $response, $post, $request ) { // phpcs:ignore
		$data = $response->get_data();

		$data['addons'][ $this->addon->slug ] = $this->get_rest_data( $post );

		$response->set_data( $data );
		return $response;
	}

	/**
	 * Get rest data
	 *
	 * @since 1.6.0
	 *
	 * @param WP_Post $post Post object.
	 * @return mixed
	 */
	protected function get_rest_data( $post ) {
		$data = array();

		return $data;
	}

}
