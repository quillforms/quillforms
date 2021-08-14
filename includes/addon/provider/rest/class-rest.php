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
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// 'account_controller'   => Account_Controller::class,
		// 'form_data_controller' => Form_Data_Controller::class,
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider = $provider;
		new static::$classes['account_controller']( $this->provider );
		new static::$classes['form_data_controller']( $this->provider );
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
