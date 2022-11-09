<?php
/**
 * REST class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

use QuillForms\Addon\Provider\Provider;
use QuillForms\Addon\REST\REST as Abstract_REST;

/**
 * REST class.
 *
 * @since 1.3.0
 *
 * @property Provider $addon
 */
class REST extends Abstract_REST {

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// + classes from parent.
		// 'account_controller'        => Account_Controller::class,
		// 'run_connection_controller' => Run_Connection_Controller::class,
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $addon Provider addon.
	 */
	public function __construct( $addon ) {
		parent::__construct( $addon );

		if ( ! empty( static::$classes['account_controller'] ) ) {
			new static::$classes['account_controller']( $this->addon );
		}
		$run_connection_controller = static::$classes['run_connection_controller'] ?? Run_Connection_Controller::class;
		new $run_connection_controller( $this->addon );

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
		$data = array(
			'connections' => $this->addon->form_data->get( $post->ID, 'connections' ) ?? array(),
		);

		if ( $this->addon->accounts ) {
			$data['accounts'] = $this->addon->accounts->get_accounts();
		}

		return $data;
	}

}
