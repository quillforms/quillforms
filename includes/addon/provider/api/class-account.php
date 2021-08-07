<?php
/**
 * Account class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider\API;

/**
 * Account abstract class.
 *
 * @since 1.3.0
 */
abstract class Account {

	/**
	 * Account API
	 *
	 * @var object
	 */
	protected $api;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param array $account_data Account data.
	 */
	abstract public function __construct( $account_data );

}
