<?php
/**
 * Payment_Gateway class.
 *
 * @since next.version
 * @package QuillForms
 */

namespace QuillForms\Addon\Payment_Gateway;

use QuillForms\Addon\Addon;
use WP_Error;

/**
 * Abstract class for payment gateway plugin extensions.
 *
 * @since next.version
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
	 * Is gateway and method configured
	 *
	 * @since next.version
	 *
	 * @param string $method Method.
	 * @return boolean
	 */
	abstract public function is_configured( $method );

	/**
	 * Is currency supported by the gateway
	 *
	 * @since next.version
	 *
	 * @param string $currency Currency.
	 * @return boolean
	 */
	abstract public function is_currency_supported( $currency );

	/**
	 * Is recurring supported by method
	 *
	 * @since next.version
	 *
	 * @param string $method Method.
	 * @return boolean
	 */
	abstract public function is_recurring_supported( $method );

	/**
	 * Is recurring interval supported
	 *
	 * @since next.version
	 *
	 * @param string  $unit Interval unit.
	 * @param integer $count Interval count.
	 * @return boolean
	 */
	abstract public function is_recurring_interval_supported( $unit, $count );

	/**
	 * Is transaction status ok
	 *
	 * @since next.version
	 *
	 * @param string $status Transaction status.
	 * @return boolean
	 */
	abstract public function is_transaction_status_ok( $status );

	/**
	 * Is subscription status ok
	 *
	 * @since next.version
	 *
	 * @param string $status Subscription status.
	 * @return boolean
	 */
	abstract public function is_subscription_status_ok( $status );

}
