<?php
/**
 * REST class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\REST;

/**
 * REST abstract class.
 *
 * @since 1.3.0
 */
abstract class REST {

	/**
	 * Provider
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Account_Controller class
	 *
	 * @var string
	 */
	protected static $account_controller_class;

	/**
	 * Form_Data_Controller class
	 *
	 * @var string
	 */
	protected static $form_data_controller_class;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $provider Provider.
	 */
	public function __construct( $provider ) {
		$this->provider = $provider;
		new static::$account_controller_class( $this->provider ); // phpcs:ignore
		new static::$form_data_controller_class( $this->provider ); // phpcs:ignore
	}

}
