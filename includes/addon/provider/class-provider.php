<?php
/**
 * Provider class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider;

use QuillForms\Addon\Addon;

/**
 * Abstract class for provider plugin extensions.
 *
 * @since 1.3.0
 */
abstract class Provider extends Addon {

	/**
	 * Accounts
	 *
	 * @var Accounts
	 */
	public $accounts;

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// + classes from parent.
		// 'accounts'      => Accounts::class,
		// 'entry_process' => Entry_Process::class,
	);

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 */
	protected function __construct() {
		parent::__construct();

		$this->accounts = new static::$classes['accounts']( $this );
		if ( ! empty( static::$classes['entry_process'] ) ) {
			new static::$classes['entry_process']( $this );
		}
	}

}
