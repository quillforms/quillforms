<?php
/**
 * Payment_Gateway class.
 *
 * @since 1.8.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Payment_Gateway;

use QuillForms\Addon\Addon;
use WP_Error;

/**
 * Abstract class for payment gateway plugin extensions.
 *
 * @since 1.8.0
 */
abstract class Payment_Gateway extends Addon {

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// + classes from parent.
	);

	/**
	 * Initialize
	 *
	 * @since 1.8.0
	 *
	 * @return void
	 */
	protected function init() {
		parent::init();
	}

	/**
	 * Is gateway and method configured
	 *
	 * @since 1.8.0
	 *
	 * @param string $method Method.
	 * @return boolean
	 */
	abstract public function is_configured( $method );

	/**
	 * Is currency supported by the gateway
	 *
	 * @since 1.8.0
	 *
	 * @param string $currency Currency.
	 * @return boolean
	 */
	abstract public function is_currency_supported( $currency );

	/**
	 * Is recurring supported by method
	 *
	 * @since 1.8.0
	 *
	 * @param string $method Method.
	 * @return boolean
	 */
	abstract public function is_recurring_supported( $method );

	/**
	 * Is recurring interval supported
	 *
	 * @since 1.8.0
	 *
	 * @param string  $unit Interval unit.
	 * @param integer $count Interval count.
	 * @return boolean
	 */
	abstract public function is_recurring_interval_supported( $unit, $count );

	/**
	 * Is transaction status ok
	 *
	 * @since 1.8.0
	 *
	 * @param string $status Transaction status.
	 * @return boolean
	 */
	abstract public function is_transaction_status_ok( $status );

	/**
	 * Is subscription status ok
	 *
	 * @since 1.8.0
	 *
	 * @param string $status Subscription status.
	 * @return boolean
	 */
	abstract public function is_subscription_status_ok( $status );

	/**
	 * Check new form payments settings before update
	 *
	 * @since 1.8.0
	 *
	 * @param integer $form_id Form id.
	 * @param array   $new_settings New form payments settings.
	 * @param array   $current_settings Current form payments settings.
	 * @return true|WP_Error WP_Error if some settings are invalid.
	 */
	public function check_form_settings_update( $form_id, $new_settings, $current_settings ) { // phpcs:ignore
		return true;
	}

}
