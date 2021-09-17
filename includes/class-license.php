<?php
/**
 * Class: License
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms;

/**
 * License Class
 *
 * @since 1.6.0
 */
class License {

	/**
	 * Class instance
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Store website url
	 */
	const STORE_SITE = 'http://172.17.0.1:8040'; // TODO: temporary url.

	/**
	 * Get class instance
	 *
	 * @return self
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.6.0
	 */
	private function __construct() {
		add_action( 'wp_ajax_quillforms_license_activate', array( $this, 'ajax_activate' ) );
		add_action( 'wp_ajax_quillforms_license_deactivate', array( $this, 'ajax_deactivate' ) );
	}

	/**
	 * Get translated plan label
	 *
	 * @param string $plan Plan key.
	 * @return string
	 */
	public function get_plan_label( $plan ) {
		switch ( $plan ) {
			case 'basic':
				return esc_html__( 'Basic Plan', 'quillforms' );
			default:
				return 'unknown';
		}
	}

	/**
	 * Get current license info
	 *
	 * @param boolean $include_key Whether to include key or not.
	 * @return array|false
	 */
	public function get_license_info( $include_key = false ) {
		$license = get_option( 'quillforms_license' );
		if ( ! empty( $license ) ) {
			// add plan label.
			$license['plan_label'] = $this->get_plan_label( $license['plan'] );
			// maybe remove plan key.
			if ( ! $include_key ) {
				unset( $license['key'] );
			}
		}
		return $license;
	}

	/**
	 * Handle activate request
	 *
	 * @return void
	 */
	public function ajax_activate() {
		$this->check_authorization();

		// check current license.
		if ( ! empty( get_option( 'quillforms_license' ) ) ) {
			wp_send_json_error( esc_html__( 'Current license must be deactivated first', 'quillforms' ), 403 );
			exit;
		}

		// posted license key.
		$license_key = trim( $_POST['license_key'] ?? '' );
		if ( empty( $license_key ) ) {
			wp_send_json_error( esc_html__( 'License key is required', 'quillforms' ), 400 );
			exit;
		}

		$response = $this->api_request(
			array(
				'edd_action' => 'activate_license',
				'license'    => $license_key,
				'item_id'    => 'plan',
			)
		);

		// failed request.
		if ( ! $response['success'] ) {
			$message = $response['message'] ?? esc_html__( 'An error occurred, please try again', 'quillforms' );
			wp_send_json_error( $message, 422 );
			exit;
		}

		// api request error.
		if ( ! ( $response['data']->success ?? false ) ) {
			switch ( $response['data']->error ) {
				case 'expired':
					$message = sprintf(
						esc_html__( 'Your license key expired on %s.', 'quillforms' ), // phpcs:ignore
						date_i18n( get_option( 'date_format' ), strtotime( $response['data']->expires, current_time( 'timestamp' ) ) ) // phpcs:ignore
					);
					break;

				case 'disabled':
				case 'revoked':
					$message = esc_html__( 'Your license key has been disabled.', 'quillforms' );
					break;

				case 'missing':
					$message = esc_html__( 'Invalid license.', 'quillforms' );
					break;

				case 'invalid':
				case 'site_inactive':
					$message = esc_html__( 'Your license is not active for this URL.', 'quillforms' );
					break;

				case 'item_name_mismatch':
					$message = esc_html__( 'This appears to be an invalid license key for a plan.', 'quillforms' );
					break;

				case 'no_activations_left':
					$message = esc_html__( 'Your license key has reached its activation limit.', 'quillforms' );
					break;

				default:
					$message = esc_html__( 'An error occurred, please try again.', 'quillforms' );
					break;
			}
			wp_send_json_error( $message, 422 );
			exit;
		}

		if ( 'valid' !== $response['data']->license ) {
			$message = esc_html__( 'Invalid license.', 'quillforms' );
			wp_send_json_error( $message, 422 );
			exit;
		}

		if ( empty( $response['data']->plan ) ) {
			$message = esc_html__( 'Server error, please contact the support', 'quillforms' );
			wp_send_json_error( $message, 422 );
			exit;
		}

		// new license data.
		$license = array(
			'status'  => 'valid',
			'plan'    => $response['data']->plan,
			'key'     => $license_key,
			'expires' => $response['data']->expires,
		);

		// update option.
		update_option( 'quillforms_license', $license );

		// return new license info.
		wp_send_json_success( $this->get_license_info(), 200 );
	}

	/**
	 * Handle deactivate request
	 *
	 * @return void
	 */
	public function ajax_deactivate() {
		$this->check_authorization();

		// check current license.
		$license = get_option( 'quillforms_license' );
		if ( ! empty( $license['key'] ) ) {
			$this->api_request(
				array(
					'edd_action' => 'deactivate_license',
					'license'    => $license['key'],
					'item_id'    => 'plan',
				)
			);

			delete_option( 'quillforms_license' );
		}

		wp_send_json_success( esc_html__( 'License removed successfully', 'quillforms' ), 200 );
	}

	/**
	 * Check ajax request authorization.
	 * Sends error response and exit if not authorized.
	 *
	 * @return void
	 */
	private function check_authorization() {
		// check for valid nonce field.
		if ( ! check_ajax_referer( 'quillforms_license', '_nonce', false ) ) {
			wp_send_json_error( esc_html__( 'Invalid nonce', 'quillforms' ), 403 );
			exit;
		}

		// check for user capability.
		if ( ! current_user_can( 'manage_quillforms' ) ) {
			wp_send_json_error( esc_html__( 'Forbidden', 'quillforms' ), 403 );
			exit;
		}
	}

	/**
	 * API Request
	 *
	 * @param array   $body Body.
	 * @param integer $success_code Success code.
	 * @return array
	 */
	private function api_request( $body, $success_code = 200 ) {
		$body = array_merge(
			array(
				'url'         => home_url(),
				'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
			),
			$body
		);

		$response = wp_remote_post(
			self::STORE_SITE,
			array(
				'timeout'   => 15,
				'sslverify' => false,
				'body'      => $body,
			)
		);

		if ( is_wp_error( $response ) ) {
			return array(
				'success' => false,
				'code'    => $response->get_error_code(),
				'message' => $response->get_error_message(),
			);
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = json_decode( wp_remote_retrieve_body( $response ) );

		return array(
			'success' => $response_code === $success_code,
			'code'    => $response_code,
			'data'    => $response_body,
		);
	}

}
