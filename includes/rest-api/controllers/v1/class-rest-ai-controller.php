<?php
/**
 * Class REST_AI_Controller
 *
 * @since next.version
 * @package QuillForms
 */

namespace QuillForms\REST_API\Controllers\V1;

use QuillForms\Abstracts\REST_Controller;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST_AI_Controller
 *
 * @since next.version
 */
class REST_AI_Controller extends REST_Controller {

	/**
	 * REST Base
	 *
	 * @since next.version
	 *
	 * @var string
	 */
	protected $rest_base = 'ai';

	/**
	 * AI Service URL
	 *
	 * @since next.version
	 *
	 * @var string
	 */
	private $ai_service_url = 'https://ai.quillforms.com';

	/**
	 * AI API Key
	 *
	 * @since next.version
	 *
	 * @var string
	 */
	private $ai_api_key = 'quillforms-ai-default-key-2025';

	/**
	 * Register the routes for the controller.
	 *
	 * @since next.version
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/generate',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'generate_form' ),
					'permission_callback' => array( $this, 'generate_form_permissions_check' ),
					'args'                => $this->get_generate_form_args(),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/test-connection',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'test_connection' ),
					'permission_callback' => array( $this, 'test_connection_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Get the schema for generate form endpoint, conforming to JSON Schema.
	 *
	 * @since next.version
	 *
	 * @return array
	 */
	public function get_item_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'ai_generate',
			'type'       => 'object',
			'properties' => array(
				'prompt' => array(
					'description' => __( 'The description of the form to generate.', 'quillforms' ),
					'type'        => 'string',
					'required'    => true,
					'minLength'   => 5,
				),
				'complexity' => array(
					'description' => __( 'The complexity level of the form.', 'quillforms' ),
					'type'        => 'string',
					'enum'        => array( 'Simple', 'Medium', 'Complex' ),
					'default'     => 'Medium',
				),
				'formType' => array(
					'description' => __( 'The type of form to generate.', 'quillforms' ),
					'type'        => 'string',
					'enum'        => array( 'contact', 'survey', 'registration', 'application', 'feedback', 'booking', 'quiz', 'order' ),
				),
				'industry' => array(
					'description' => __( 'The industry for the form.', 'quillforms' ),
					'type'        => 'string',
					'enum'        => array( 'healthcare', 'education', 'real-estate', 'technology', 'finance', 'retail', 'hospitality', 'non-profit', 'government', 'other' ),
				),
				'additionalInstructions' => array(
					'description' => __( 'Additional instructions for form generation.', 'quillforms' ),
					'type'        => 'string',
				),
			),
		);
		return $schema;
	}

	/**
	 * Get the arguments for generate form endpoint.
	 *
	 * @since next.version
	 *
	 * @return array
	 */
	public function get_generate_form_args() {
		return array(
			'prompt' => array(
				'description'       => __( 'The description of the form to generate.', 'quillforms' ),
				'type'              => 'string',
				'required'          => true,
				'validate_callback' => function( $param ) {
					return is_string( $param ) && strlen( trim( $param ) ) >= 5;
				},
				'sanitize_callback' => 'sanitize_text_field',
			),
			'complexity' => array(
				'description'       => __( 'The complexity level of the form.', 'quillforms' ),
				'type'              => 'string',
				'default'           => 'Medium',
				'enum'              => array( 'Simple', 'Medium', 'Complex' ),
				'sanitize_callback' => 'sanitize_text_field',
			),
			'formType' => array(
				'description'       => __( 'The type of form to generate.', 'quillforms' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'industry' => array(
				'description'       => __( 'The industry for the form.', 'quillforms' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'additionalInstructions' => array(
				'description'       => __( 'Additional instructions for form generation.', 'quillforms' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_textarea_field',
			),
		);
	}

	/**
	 * Generate a form using AI.
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function generate_form( $request ) {
		// Get parameters
		$prompt                   = $request->get_param( 'prompt' );
		$complexity               = $request->get_param( 'complexity' );
		$form_type                = $request->get_param( 'formType' );
		$industry                 = $request->get_param( 'industry' );
		$additional_instructions  = $request->get_param( 'additionalInstructions' );

		// Prepare request data
		$request_data = array(
			'prompt'     => trim( $prompt ),
			'complexity' => $complexity,
		);

		// Add optional fields
		if ( ! empty( $form_type ) ) {
			$request_data['formType'] = trim( $form_type );
		}

		if ( ! empty( $industry ) ) {
			$request_data['industry'] = trim( $industry );
		}

		if ( ! empty( $additional_instructions ) ) {
			$request_data['additionalInstructions'] = trim( $additional_instructions );
		}

		// Get AI API key from settings or use default
		$api_key = get_option( 'quillforms_ai_api_key', $this->ai_api_key );

		// Make request to AI service
		$response = wp_remote_post(
			$this->ai_service_url,
			array(
				'timeout'     => 30,
				'redirection' => 5,
				'httpversion' => '1.1',
				'blocking'    => true,
				'headers'     => array(
					'Content-Type'  => 'application/json',
					'X-API-Key'     => $api_key,
					'Origin'        => get_site_url(),
					'User-Agent'    => 'QuillForms-Plugin/2.0',
				),
				'body'        => wp_json_encode( $request_data ),
			)
		);

		// Check for WP error
		if ( is_wp_error( $response ) ) {
			return new WP_Error(
				'quillforms_ai_connection_error',
				__( 'Failed to connect to AI service: ', 'quillforms' ) . $response->get_error_message(),
				array( 'status' => 500 )
			);
		}

		// Get response code
		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );

		// Try to decode response
		$data = json_decode( $response_body, true );

		// Check for non-200 response codes
		if ( $response_code !== 200 ) {
			$error_message = isset( $data['error'] ) ? $data['error'] : __( 'AI service returned an error', 'quillforms' );

			// Handle specific error codes
			if ( $response_code === 429 ) {
				$error_message = __( 'Too many requests. Please wait a moment and try again.', 'quillforms' );
			} elseif ( $response_code === 401 ) {
				$error_message = __( 'Invalid API key. Please check your QuillForms AI settings.', 'quillforms' );
			} elseif ( $response_code === 503 ) {
				$error_message = __( 'AI service is temporarily unavailable. Please try again later.', 'quillforms' );
			}

			return new WP_Error(
				'quillforms_ai_service_error',
				$error_message,
				array( 'status' => $response_code )
			);
		}

		// Check if we got valid JSON
		if ( json_last_error() !== JSON_ERROR_NONE ) {
			return new WP_Error(
				'quillforms_ai_invalid_response',
				__( 'Invalid response from AI service', 'quillforms' ),
				array( 'status' => 500 )
			);
		}

		// Check for success flag
		if ( ! isset( $data['success'] ) || ! $data['success'] ) {
			return new WP_Error(
				'quillforms_ai_generation_failed',
				isset( $data['error'] ) ? $data['error'] : __( 'Failed to generate form', 'quillforms' ),
				array( 'status' => 422 )
			);
		}

		// Return successful response
		return new WP_REST_Response(
			array(
				'success' => true,
				'form'    => isset( $data['form'] ) ? $data['form'] : $data['data'],
				'message' => isset( $data['message'] ) ? $data['message'] : __( 'Form generated successfully', 'quillforms' ),
			),
			200
		);
	}

	/**
	 * Check if a given request has access to generate forms.
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function generate_form_permissions_check( $request ) {
		// Check if user can create forms
		$capability = 'manage_quillforms'; 
		return current_user_can( $capability );
	}

	/**
	 * Test connection to AI service.
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function test_connection( $request ) {
		// Get AI API key from settings or use default
		$api_key = get_option( 'quillforms_ai_api_key', $this->ai_api_key );

		// Make test request to AI service
		$response = wp_remote_get(
			$this->ai_service_url,
			array(
				'timeout'     => 10,
				'headers'     => array(
					'X-API-Key'  => $api_key,
					'User-Agent' => 'QuillForms-Plugin/2.0',
				),
			)
		);

		// Check for WP error
		if ( is_wp_error( $response ) ) {
			return new WP_Error(
				'quillforms_ai_connection_test_failed',
				__( 'Connection test failed: ', 'quillforms' ) . $response->get_error_message(),
				array( 'status' => 500 )
			);
		}

		// Get response code
		$response_code = wp_remote_retrieve_response_code( $response );

		// Return test result
		return new WP_REST_Response(
			array(
				'success'       => $response_code === 200,
				'status_code'   => $response_code,
				'message'       => $response_code === 200 
					? __( 'Connection to AI service successful', 'quillforms' ) 
					: __( 'Connection test failed with status: ', 'quillforms' ) . $response_code,
			),
			200
		);
	}

	/**
	 * Check if a given request has access to test connection.
	 *
	 * @since next.version
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|bool
	 */
	public function test_connection_permissions_check( $request ) {
		// Check if user can manage forms
		$capability = 'manage_quillforms'; 
		return current_user_can( $capability );
	}

}