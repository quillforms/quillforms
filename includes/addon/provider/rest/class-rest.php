<?php
/**
 * REST class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

use WP_Post;
use WP_REST_Request;
use WP_REST_Response;

/**
 * REST abstract class.
 *
 * @since 1.3.0
 */
abstract class REST {

	/**
	 * Provider
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Account_Controller class
	 *
	 * @var string
	 */
	protected static $account_controller_class;

	/**
	 * Form_Data_Controller class
	 *
	 * @var string
	 */
	protected static $form_data_controller_class;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider = $provider;
		new static::$account_controller_class( $this->provider ); // phpcs:ignore
		new static::$form_data_controller_class( $this->provider ); // phpcs:ignore
		add_filter( 'rest_prepare_quill_forms', array( $this, 'add_provider_form_data' ), 10, 3 );
	}

	/**
	 * Add provider form data
	 *
	 * @param WP_REST_Response $response The response object.
	 * @param WP_Post          $post     Post object.
	 * @param WP_REST_Request  $request  Request object.
	 * @return WP_REST_Response
	 */
	public function add_provider_form_data( $response, $post, $request ) { // phpcs:ignore
		$data = $response->get_data();
		if ( ! isset( $data['integrations'] ) ) {
			$data['integrations'] = array();
		}
		$data['integrations'][ $this->provider->slug ] = $this->provider->form_data->get( $post->ID );
		$response->set_data( $data );
		return $response;
	}

}
