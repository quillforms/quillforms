<?php
/**
 * Class: License
 *
 * @since 1.6.0
 * @package QuillForms
 */

namespace QuillForms\Site;

use QuillForms\QuillForms;

/**
 * License Class
 *
 * @since 1.6.0
 */
class License {

	/**
	 * Plans
	 *
	 * @since 1.6.0
	 *
	 * @var array
	 */
	private $plans;

	/**
	 * Class instance
	 *
	 * @since 1.6.0
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since 1.6.0
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
		$this->define_plans();

		add_action( 'quillforms_loaded', array( $this, 'license_update_task' ), 100 );

		// ajax.
		add_action( 'wp_ajax_quillforms_license_activate', array( $this, 'ajax_activate' ) );
		add_action( 'wp_ajax_quillforms_license_update', array( $this, 'ajax_update' ) );
		add_action( 'wp_ajax_quillforms_license_deactivate', array( $this, 'ajax_deactivate' ) );
	}

	/**
	 * Define plans
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	private function define_plans() {
		$this->plans = array(
			'basic'      => array(
				'label' => esc_html__( 'Basic', 'quillforms' ),
			),
			'plus'       => array(
				'label' => esc_html__( 'Plus', 'quillforms' ),
			),
			'enterprise' => array(
				'label' => esc_html__( 'Enterprise', 'quillforms' ),
			),
		);
	}

	/**
	 * Get plans
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function get_plans() {
		return $this->plans;
	}

	/**
	 * Get plan label
	 *
	 * @since 1.6.0
	 *
	 * @param string $plan Plan key.
	 * @return string|null
	 */
	public function get_plan_label( $plan ) {
		if ( isset( $this->plans[ $plan ] ) ) {
			return $this->plans[ $plan ]['label'];
		} else {
			return null;
		}
	}

	/**
	 * Get current license info
	 *
	 * @since 1.6.0
	 *
	 * @param boolean $include_key Whether to include key or not.
	 * @return array|false
	 */
	public function get_license_info( $include_key = false ) {
		$license = get_option( 'quillforms_license' );
		if ( empty( $license ) ) {
			return null;
		} else {
			// add labels.
			$license['status_label'] = $this->get_status_label( $license['status'] );
			$license['plan_label']   = $this->get_plan_label( $license['plan'] );
			foreach ( array_keys( $license['upgrades'] ) as $upgrade_plan ) {
				$license['upgrades'][ $upgrade_plan ]['plan_label'] = $this->get_plan_label( $upgrade_plan );
			}
			// convert gmt dates to local.
			foreach ( array( 'expires', 'last_update', 'last_check' ) as $key ) {
				$license[ $key ] = get_date_from_gmt( $license[ $key ] );
			}
			// maybe remove plan key.
			if ( ! $include_key ) {
				unset( $license['key'] );
			}
			return $license;
		}
	}

	/**
	 * Is feature plan accessible to user plan
	 *
	 * @since 1.6.0
	 *
	 * @param string $user_plan User plan.
	 * @param string $feature_plan Feature plan.
	 * @return boolean
	 */
	public function is_plan_accessible( $user_plan, $feature_plan ) {
		$plans_keys = array_keys( $this->plans );

		$user_plan_level    = array_search( $user_plan, $plans_keys, true );
		$feature_plan_level = array_search( $feature_plan, $plans_keys, true );

		if ( false === $user_plan_level || false === $feature_plan_level ) {
			return false;
		}

		return $user_plan_level >= $feature_plan_level;
	}

	/**
	 * Update license
	 *
	 * @since 1.6.0
	 *
	 * @return array
	 */
	public function update_license() {
		// check current license.
		$license = get_option( 'quillforms_license' );
		if ( empty( $license['key'] ) ) {
			return array(
				'success' => false,
				'message' => esc_html__( 'No license key found', 'quillforms' ),
			);
		}

		$response = Site::instance()->api_request(
			array(
				'edd_action' => 'check_license',
				'license'    => $license['key'],
				'item_id'    => 'plan',
			)
		);

		// failed request.
		if ( ! $response['success'] ) {
			// update last check only.
			$license['last_check'] = gmdate( 'Y-m-d H:i:s' );
			update_option( 'quillforms_license', $license );

			$message = $response['message'] ?? esc_html__( 'An error occurred, please try again', 'quillforms' );
			return array(
				'success' => false,
				'message' => $message,
			);
		}

		if ( ! empty( $response['data']['plan'] ) ) {
			$license_status = $response['data']['license'];
			$license_plan   = $response['data']['plan'];
		} else {  // empty plan, shouldn't be reached normally.
			$license_status = 'item_name_mismatch';
			$license_plan   = null;
		}

		// new license data.
		$license = array(
			'status'      => $license_status,
			'plan'        => $license_plan,
			'key'         => $license['key'],
			'expires'     => $response['data']['expires'] ?? null,
			'upgrades'    => $response['data']['upgrades'] ?? array(),
			'last_update' => gmdate( 'Y-m-d H:i:s' ),
			'last_check'  => gmdate( 'Y-m-d H:i:s' ),
		);

		// update option.
		update_option( 'quillforms_license', $license );

		// clear addons update cache.
		Updater::instance()->clear_addons_update_cache();

		return array( 'success' => true );
	}

	/**
	 * Initialize and handle license update task.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function license_update_task() {
		// schedule task.
		add_action(
			'init',
			function() {
				if ( QuillForms::instance()->tasks->get_next_timestamp( 'license_update' ) === false ) {
					QuillForms::instance()->tasks->schedule_recurring(
						time(),
						DAY_IN_SECONDS,
						'license_update'
					);
				}
			}
		);

		// scheduled task callback.
		QuillForms::instance()->tasks->register_callback(
			'license_update',
			array( $this, 'handle_license_update_task' )
		);

		// direct update in case of overdue.
		if ( is_admin() ) {
			$license = get_option( 'quillforms_license' );
			if ( $license && strtotime( $license['last_check'] ) < time() - 5 * DAY_IN_SECONDS ) {
				$this->handle_license_update_task( 'direct' );
			}
		}
	}

	/**
	 * Handle license update task callback
	 *
	 * @since 1.6.0
	 *
	 * @param string $trigger Trigger.
	 * @return void
	 */
	public function handle_license_update_task( $trigger = 'cron' ) {
		if ( get_option( 'quillforms_license' ) !== false ) {
			$result = $this->update_license();

			if ( $result['success'] ) {
				quillforms_get_logger()->debug(
					esc_html__( 'License update task done', 'quillforms' ),
					array(
						'code'    => 'license_update_task_done',
						'trigger' => $trigger,
					)
				);
			} else {
				quillforms_get_logger()->warning(
					esc_html__( 'License update task failed', 'quillforms' ),
					array(
						'code'    => 'license_update_task_failed',
						'trigger' => $trigger,
					)
				);
			}
		}
	}

	/**
	 * Handle activate request
	 *
	 * @since 1.6.0
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

		$response = Site::instance()->api_request(
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
		if ( ! ( $response['data']['success'] ?? false ) ) {
			$status_label = $this->get_status_label( $response['data']['error'] ?? null );
			if ( $status_label ) {
				$message = esc_html__( 'License error', 'quillforms' ) . ": $status_label";
			} else {
				$message = esc_html__( 'An error occurred, please try again', 'quillforms' );
			}
			wp_send_json_error( $message, 422 );
			exit;
		}

		if ( 'valid' !== $response['data']['license'] ) {
			$message = esc_html__( 'Invalid license', 'quillforms' );
			wp_send_json_error( $message, 422 );
			exit;
		}

		if ( empty( $response['data']['plan'] ) ) {
			$message = esc_html__( 'Server error, please contact the support', 'quillforms' );
			wp_send_json_error( $message, 422 );
			exit;
		}

		// new license data.
		$license = array(
			'status'      => 'valid',
			'plan'        => $response['data']['plan'],
			'key'         => $license_key,
			'expires'     => $response['data']['expires'],
			'upgrades'    => $response['data']['upgrades'] ?? array(),
			'last_update' => gmdate( 'Y-m-d H:i:s' ),
			'last_check'  => gmdate( 'Y-m-d H:i:s' ),
		);

		// update option.
		update_option( 'quillforms_license', $license );

		// clear addons update cache.
		Updater::instance()->clear_addons_update_cache();

		// return new license info.
		wp_send_json_success( $this->get_license_info(), 200 );
	}

	/**
	 * Handle update request
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function ajax_update() {
		$this->check_authorization();

		$update = $this->update_license();
		if ( $update['success'] ) {
			wp_send_json_success( $this->get_license_info(), 200 );
		} else {
			wp_send_json_error( $update['message'] );
		}
	}

	/**
	 * Handle deactivate request
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function ajax_deactivate() {
		$this->check_authorization();

		// check current license.
		$license = get_option( 'quillforms_license' );
		if ( ! empty( $license['key'] ) ) {
			Site::instance()->api_request(
				array(
					'edd_action' => 'deactivate_license',
					'license'    => $license['key'],
					'item_id'    => 'plan',
				)
			);

			delete_option( 'quillforms_license' );

			// clear addons update cache.
			Updater::instance()->clear_addons_update_cache();
		}

		wp_send_json_success( esc_html__( 'License removed successfully', 'quillforms' ), 200 );
	}

	/**
	 * Get translated status label
	 *
	 * @since 1.6.0
	 *
	 * @param string $status Status key.
	 * @return string|null
	 */
	public function get_status_label( $status ) {
		switch ( $status ) {
			case 'valid':
				return esc_html__( 'Valid', 'quillforms' );

			case 'expired':
				return esc_html__( 'Expired', 'quillforms' );

			case 'disabled':
			case 'revoked':
				return esc_html__( 'Disabled', 'quillforms' );

			case 'missing':
			case 'invalid':
				return esc_html__( 'Invalid', 'quillforms' );

			case 'inactive':
			case 'site_inactive':
				return esc_html__( 'Not active for this website', 'quillforms' );

			case 'item_name_mismatch':
				return esc_html__( 'Invalid key for a plan', 'quillforms' );

			case 'no_activations_left':
				return esc_html__( 'Key reached its activation limit', 'quillforms' );

			default:
				return null;
		}
	}

	/**
	 * Check ajax request authorization.
	 * Sends error response and exit if not authorized.
	 *
	 * @since 1.6.0
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

}
