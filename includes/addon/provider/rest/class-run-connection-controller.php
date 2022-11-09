<?php
/**
 * Run_Connection_Controller class.
 *
 * @since 1.20.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

use QuillForms\Addon\Provider\Provider;
use QuillForms\Core;
use QuillForms\Entry;
use WP_Error;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Run_Connection_Controller class.
 * Handles running a connection on some entries on the fly.
 *
 * @since 1.20.0
 */
class Run_Connection_Controller {

	/**
	 * Provider
	 *
	 * @since 1.20.0
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Endpoint namespace.
	 *
	 * @since 1.20.0
	 *
	 * @var string
	 */
	protected $namespace = 'qf/v1';

	/**
	 * Route base.
	 *
	 * @since 1.20.0
	 *
	 * @var string
	 */
	protected $rest_base;

	/**
	 * Constructor.
	 *
	 * @since 1.20.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider  = $provider;
		$this->rest_base = "addons/{$this->provider->slug}/run-connection";

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register controller routes
	 *
	 * @since 1.20.0
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'process' ),
					'permission_callback' => array( $this, 'process_permissions_check' ),
					'args'                => rest_get_endpoint_args_for_schema( $this->get_schema(), WP_REST_Server::CREATABLE ),
				),
			)
		);
	}

	/**
	 * Get schema
	 *
	 * @since 1.20.0
	 *
	 * @return array
	 */
	protected function get_schema() {
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'form_data',
			'type'       => 'object',
			'properties' => array(
				'connection_id' => array(
					'type' => 'string',
				),
				'connection'    => array(
					'type' => 'object',
				),
				'form_id'       => array(
					'type' => 'integer',
				),
				'entry_ids'     => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'integer',
					),
				),
			),
		);
	}

	/**
	 * Process a connection on entries.
	 *
	 * @since 1.20.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function process( $request ) {
		$connection_id = $request->get_param( 'connection_id' );
		$connection    = $request->get_param( 'connection' );
		$form_id       = $request->get_param( 'form_id' );
		$entry_ids     = $request->get_param( 'entry_ids' );

		$form_data = Core::get_form_data( $form_id );
		$results   = array(
			'succeeded' => array(),
			'failed'    => array(),
			'skipped'   => array(),
			'unfound'   => array(),
		);
		foreach ( $entry_ids as $entry_id ) {
			/** @var Entry */ // phpcs:ignore
			$entry = apply_filters( 'quillforms_entry_retrieve', null, $form_id, $entry_id, true, true );
			if ( ! $entry ) {
				$results['unfound'][] = $entry_id;
				continue;
			}

			$entry_process                  = $this->provider->get_entry_process( $entry, $form_data );
			$result                         = $entry_process->run_connection( $connection_id, $connection );
			$results[ $result['status'] ][] = $entry_id;
		}

		return new WP_REST_Response(
			array(
				'success' => true,
				'results' => $results,
			)
		);
	}

	/**
	 * Checks if a given request has access to process connection.
	 *
	 * @since 1.20.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function process_permissions_check( $request ) {
		$capability = 'manage_quillforms';
		return current_user_can( $capability, $request );
	}

}
