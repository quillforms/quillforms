<?php
/**
 * Form Submission: class Form_Submission
 *
 * @since 2.13.1
 *
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Addon\Payment_Gateway\Payment_Gateway;

/**
 * Form Submission class.
 *
 * @since 2.13.1
 */
class Discount_Coupons {

	/**
	 * Form data
	 *
	 * @since 2.13.1
	 *
	 * @var array
	 */
	public $form_data;

	/**
	 * Submission form
	 *
	 * @since 2.13.1
	 *
	 * @var Form_Submission
	 */
	public $form_submission;

	/**
	 * Coupon
	 *
	 * @since 2.13.1
	 *
	 * @var array
	 */
	public $coupon;

	/**
	 * Coupons
	 *
	 * @since 2.13.1
	 *
	 * @var array
	 */
	public $coupons;

	/**
	 * Class instance
	 *
	 * @since 2.13.1
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since 2.13.1
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
	 * @since 2.13.1
	 */
	private function __construct() {
		add_action( 'wp_ajax_quillforms_apply_discount', array( $this, 'apply_discount' ) );
		add_action( 'wp_ajax_nopriv_quillforms_apply_discount', array( $this, 'apply_discount' ) );
	}

	/**
	 * Apply discount.
	 *
	 * @since 1.0.0
	 */
	public function apply_discount() {
		$coupon_code          = sanitize_text_field( $_POST['coupon'] );
		$form_id              = sanitize_text_field( $_POST['formId'] );
		$submission_id        = sanitize_text_field( $_POST['submissionId'] );
		$hashed_submission_id = sanitize_text_field( $_POST['hashedSubmissionId'] );

		// Check if submission id is valid.
		if ( ! $this->is_valid_submission_id( $submission_id, $hashed_submission_id ) ) {
			wp_send_json_error( __( 'Invalid submission id!', 'quillforms' ) );
		}

		$this->form_submission = Form_Submission::instance();
		$restore               = $this->form_submission->restore_pending_submission( $submission_id );

		if ( ! $restore ) {
			wp_send_json_error( esc_html__( 'Cannot retrieve from submission', 'quillforms' ) );
		}

		$this->coupons = $this->form_submission->form_data['payments']['coupons'];

		// Check coupon valid.
		$validation_result = $this->validate_coupon( $coupon_code );
		if ( ! $validation_result['valid'] ) {
			wp_send_json_error( $validation_result['error'] );
		}

		// Get coupon id.
		$coupon_id    = $validation_result['id'];
		$this->coupon = $this->coupons[ $coupon_id ];
		// Payments.
		$payments = $this->form_submission->entry->get_meta_value( 'payments' );
		$products = $payments['products'];
		$amount   = $products['total'];

		// Apply coupon.
		$amount = $this->apply_coupon( $amount );

		// Update coupon usage count.
		// $this->update_coupon_usage_count( $coupon_id, $form_id );

		error_log( wp_json_encode( $payments ) . ' updated payments' );
		// Update entry.
		$payments['original_total']        = $products['total'];
		$payments['coupons'][ $coupon_id ] = $this->coupon;
		$payments['products']['total']     = $amount;
		error_log( wp_json_encode( $payments ) . ' updated payments' );
		$this->form_submission->entry->set_meta_value( 'payments', $payments );
		$this->form_submission->update_pending_submission();

		wp_send_json_success(
			array(
				'message' => esc_html__( 'Coupon applied successfully', 'quillforms' ),
				'amount'  => $amount,
			)
		);
	}

	/**
	 * Apply coupon.
	 *
	 * @since 1.0.0
	 *
	 * @param float $amount Amount.
	 *
	 * @return float
	 */
	private function apply_coupon( $amount ) {
		$discount_type = $this->coupon['discount_type'];
		$amount        = floatval( $amount );

		if ( 'percent' === $discount_type ) {
			$amount = $amount - ( $amount * ( $this->coupon['discount_amount'] / 100 ) );
		} else {
			$amount = $amount - $this->coupon['discount_amount'];
		}

		// Round amount with 2 decimal places.
		$amount = round( $amount, 2 );

		return $amount;
	}

	/**
	 * Validate submission id.
	 *
	 * @since 1.10.0
	 *
	 * @param string $submission_id Submission id.
	 * @param string $hashed_submission_id Hashed submission id.
	 *
	 * @return boolean
	 */
	private function is_valid_submission_id( $submission_id, $hashed_submission_id ) {
		$submission_hash = wp_hash( "quillforms_submission_{$submission_id}" );

		if ( $submission_hash !== $hashed_submission_id ) {
			return false;
		}

		return true;
	}

	/**
	 * Update coupon usage count.
	 *
	 * @since 1.0.0
	 *
	 * @param string $coupon_id Coupon id.
	 * @param int    $form_id   Form id.
	 *
	 * @return array
	 */
	private function update_coupon_usage_count( $coupon_id, $form_id ) {
		$this->coupon = $this->coupons[ $coupon_id ];
		$usage_count  = $this->coupon['usage_count'] ?? 0;
		$usage_count ++;
		$updated_payments = $this->form_submission->form_data['payments'];
		$updated_payments['coupons'][ $coupon_id ]['usage_count'] = $usage_count;

		update_post_meta( $form_id, 'payments', $updated_payments );
	}

	/**
	 * Validate coupon.
	 *
	 * @since 1.0.0
	 *
	 * @param string $coupon_code Coupon code.
	 *
	 * @return array
	 */
	private function validate_coupon( $coupon_code ) {
		$coupon_id = $this->get_coupon_id( $coupon_code );
		if ( ! $coupon_id ) {
			return array(
				'valid' => false,
				'error' => __( 'Coupon not found!', 'quillforms' ),
			);
		}

		// Check coupon already used.
		$payments = $this->form_submission->entry->get_meta_value( 'payments' );
		error_log( wp_json_encode( $payments['coupons'] ?? array() ) . ' - ' . $coupon_id );
		if ( isset( $payments['coupons'][ $coupon_id ] ) ) {
			return array(
				'valid' => false,
				'error' => __( 'Coupon already used!', 'quillforms' ),
			);
		}

		$coupon_data    = $this->coupons[ $coupon_id ];
		$start_date     = $coupon_data['start_date'];
		$end_date       = $coupon_data['end_date'];
		$usage_limit    = $coupon_data['usage_limit'];
		$individual_use = $coupon_data['individual_use'];
		$usage_count    = $coupon_data['usage_count'] ?? 0;
		error_log( $usage_count . ' - count - limit - ' . $usage_limit );
		// Check coupon expired.
		if ( $start_date ) {
			$today = strtotime( 'today' );
			if ( $today < strtotime( $start_date ) ) {
				return array(
					'valid' => false,
					'error' => __( 'Coupon expired!', 'quillforms' ),
				);
			}
		}

		// Check coupon expired.
		if ( $end_date ) {
			$today = strtotime( 'today' );
			if ( $today > strtotime( $end_date ) ) {
				return array(
					'valid' => false,
					'error' => __( 'Coupon expired!', 'quillforms' ),
				);
			}
		}

		// Check coupon usage limit.
		if ( $usage_limit ) {
			if ( $usage_count >= $usage_limit ) {
				return array(
					'valid' => false,
					'error' => __( 'Coupon usage limit reached!', 'quillforms' ),
				);
			}
		}

		// Check coupon individual use.
		if ( $individual_use ) {
			if ( ! empty( $this->form_submission->form_data['payments']['coupons'] ?? array() ) ) {
				return array(
					'valid' => false,
					'error' => __( 'Coupon can not be used with other coupons!', 'quillforms' ),
				);
			}
		}

		// Return success.
		return array(
			'valid' => true,
			'id'    => $coupon_id,
		);
	}

	/**
	 * Get coupon id from coupon code.
	 *
	 * @since 1.0.0
	 *
	 * @param string $coupon_code Coupon code.
	 *
	 * @return int|false
	 */
	private function get_coupon_id( $coupon_code ) {
		foreach ( $this->coupons as $coupon_id => $coupon_data ) {
			if ( $coupon_code === $coupon_data['code'] ) {
				return $coupon_id;
			}
		}
		return false;
	}

}
