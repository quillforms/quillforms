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

}
