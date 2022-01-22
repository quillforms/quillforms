<?php
/**
 * Payment_Gateway class.
 *
 * @since 1.8.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Payment_Gateway;

use QuillForms\Addon\Addon;

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

}
