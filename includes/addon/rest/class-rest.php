<?php
/**
 * REST class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\REST;

use QuillForms\Addon\Addon;
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
	 * Addon
	 *
	 * @var Addon
	 */
	protected $addon;

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// 'settings_controller'  => Settings_Controller::class,
		// 'form_data_controller' => Form_Data_Controller::class,
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Addon $addon Addon.
	 */
	public function __construct( $addon ) {
		$this->addon = $addon;
		if ( ! empty( static::$classes['settings_controller'] ) ) {
			new static::$classes['settings_controller']( $this->addon );
		}
		if ( ! empty( static::$classes['form_data_controller'] ) ) {
			new static::$classes['form_data_controller']( $this->addon );
		}
		// add_filter( 'rest_prepare_quill_forms', array( $this, 'add_form_data' ), 10, 3 ); // uncomment at subclass if needed.
	}

	/**
	 * Add addon form data to quill_forms post type
	 *
	 * @param WP_REST_Response $response The response object.
	 * @param WP_Post          $post     Post object.
	 * @param WP_REST_Request  $request  Request object.
	 * @return WP_REST_Response
	 */
	public function add_form_data( $response, $post, $request ) { // phpcs:ignore
		$data = $response->get_data();
		if ( ! isset( $data['addons'] ) ) {
			$data['addons'] = array();
		}
		$data['addons'][ $this->addon->slug ] = $this->addon->form_data->get_filtered( $post->ID );
		$response->set_data( $data );
		return $response;
	}

}
