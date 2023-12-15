<?php
/**
 * Form Submission: class Form_Submission
 *
 * @since 2.13.1
 *
 * @package QuillForms
 */

namespace QuillForms;

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
		// Ajax.
		add_action( 'wp_ajax_quillforms_apply_discount', array( $this, 'apply_discount' ) );
		add_action( 'wp_ajax_nopriv_quillforms_apply_discount', array( $this, 'apply_discount' ) );

		add_action( 'wp_ajax_quillforms_delete_coupon', array( $this, 'delete_coupon' ) );
		add_action( 'wp_ajax_nopriv_quillforms_delete_coupon', array( $this, 'delete_coupon' ) );

		// Update coupon usage count.
		add_action( 'quillforms_entry_payment_processed', array( $this, 'update_coupon_usage_count' ), 10, 3 );
	}

	/**
	 * Update coupon usage count.
	 *
	 * @since 2.13.1
	 *
	 * @param int   $submission_id Submission id.
	 * @param Entry $entry Entry.
	 * @param array $form_data Form data.
	 */
	public function update_coupon_usage_count( $submission_id, $entry, $form_data ) {
		$form_id                  = $entry->form_id;
		$entry_payments           = $entry->get_meta_value( 'payments' );
		$entry_coupons            = $entry_payments['coupons'] ?? array();
		$form_payments            = $form_data['payments'];
		$form_coupons             = $form_payments['coupons'] ?? array();
		$form_coupons_usage_count = is_array( $form_data['coupons_usage_count'] ) ? $form_data['coupons_usage_count'] : array();
		foreach ( $entry_coupons as $coupon_id => $coupon ) {
			if ( ! isset( $form_coupons[ $coupon_id ] ) ) {
				continue;
			}

			$usage_count                            = $form_coupons_usage_count[ $coupon_id ] ?? 0;
			$usage_count                            = $usage_count + 1;
			$form_coupons_usage_count[ $coupon_id ] = $usage_count;
			update_post_meta( $form_id, 'coupons_usage_count', $form_coupons_usage_count );
		}
	}

	/**
	 * Delete coupon.
	 *
	 * @since 2.13.1
	 *
	 * @return void
	 */
	public function delete_coupon() {
		$this->ajax_init_form_submission();
		$coupon_code = sanitize_text_field( $_POST['coupon'] ?? '' );

		if ( ! $coupon_code ) {
			wp_send_json_error( esc_html__( 'Coupon not found', 'quillforms' ) );
		}

		$this->coupons = $this->form_submission->form_data['payments']['coupons'];

		$coupon_id = $this->get_coupon_id( $coupon_code );
		if ( ! $coupon_id ) {
			wp_send_json_error( esc_html__( 'Coupon not found', 'quillforms' ) );
		}

		$payments = $this->form_submission->entry->get_meta_value( 'payments' );
		$coupons  = $payments['coupons'] ?? array();
		unset( $coupons[ $coupon_id ] );
		$payments['coupons']           = $coupons;
		$products                      = $payments['products'];
		$payments['products']['total'] = $products['original_total'] ?? $products['total'];
		$this->form_submission->entry->set_meta_value( 'payments', $payments );
		$this->form_submission->update_pending_submission();

		wp_send_json_success( esc_html__( 'Coupon deleted successfully', 'quillforms' ) );
	}

	/**
	 * Apply discount.
	 *
	 * @since 2.13.1
	 */
	public function apply_discount() {
		$this->ajax_init_form_submission();

		$coupon_code   = sanitize_text_field( $_POST['coupon'] );
		$this->coupons = $this->form_data['payments']['coupons'];

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
		$amount   = $products['original_total'] ?? $products['total'];
		// Apply coupon.
		$discount = $this->apply_coupon( $amount );

		// Update entry.
		$payments['products']['original_total'] = $products['original_total'] ?? $products['total'];
		$payments['coupons'][ $coupon_id ]      = $this->coupon;
		$payments['products']['total']          = $discount['amount'];
		$this->form_submission->entry->set_meta_value( 'payments', $payments );
		$this->form_submission->update_pending_submission();

		wp_send_json_success(
			array(
				'message' => esc_html__( 'Coupon applied successfully', 'quillforms' ),
				'details' => array(
					'amount'          => $discount['amount'],
					'discount'        => $discount['discount'],
					'code'            => $coupon_code,
					'type'            => $this->coupon['discount_type'],
					'discount_amount' => $this->coupon['discount_amount'],
				),
			)
		);
	}

	/**
	 * Apply coupon.
	 *
	 * @since 2.13.1
	 *
	 * @param float $amount Amount.
	 *
	 * @return float
	 */
	private function apply_coupon( $amount ) {
		$discount_type = $this->coupon['discount_type'];
		$amount        = floatval( $amount );
		$discount      = null;

		if ( 'percent' === $discount_type ) {
			$discount = $amount * ( $this->coupon['discount_amount'] / 100 );
		} else {
			$discount = $this->coupon['discount_amount'];
		}

		$amount = $amount - $discount;
		$amount = round( $amount, 2 );

		return array(
			'amount'   => $amount,
			'discount' => round( $discount, 2 ),
		);
	}

	/**
	 * Validate coupon.
	 *
	 * @since 2.13.1
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

		$coupon_data         = $this->coupons[ $coupon_id ];
		$start_date          = $coupon_data['start_date'];
		$end_date            = $coupon_data['end_date'];
		$usage_limit         = $coupon_data['usage_limit'];
		$coupons_usage_count = is_array( $this->form_data['coupons_usage_count'] ) ? $this->form_data['coupons_usage_count'] : array();
		$usage_count         = isset( $coupons_usage_count[ $coupon_id ] ) ? $coupons_usage_count[ $coupon_id ]
		: 0;

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
					'error' => __( 'Coupon expired!', 'quillforms' ),
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
	 * @since 2.13.1
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

	/**
	 * Initialize form submission for ajax request
	 *
	 * @since 2.13.1
	 *
	 * @return void
	 */
	private function ajax_init_form_submission() {
		$submission_id = sanitize_text_field( $_POST['submissionId'] );
		$hashed_id     = sanitize_text_field( $_POST['hashedId'] );

		$this->form_submission = Form_Submission::instance();
		$restore               = $this->form_submission->restore_pending_submission( $submission_id );

		if ( ! $restore ) {
			wp_send_json_error( esc_html__( 'Cannot retrieve from submission', 'quillforms' ) );
			exit;
		}

		$entry_hashed_id = $this->form_submission->entry->get_meta_value( 'hashed_id' );
		if ( $entry_hashed_id !== $hashed_id ) {
			wp_send_json_error( esc_html__( 'Invalid submission', 'quillforms' ) );
			exit;
		}

		$form_id         = $this->form_submission->form_data['id'];
		$this->form_data = Core::get_form_data( $form_id );
	}

}
