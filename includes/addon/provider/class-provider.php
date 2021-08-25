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

		$this->handle_entry_process();
	}

	/**
	 * Handle entry process
	 *
	 * @return void
	 */
	protected function handle_entry_process() {
		// enqueue async task on entry added.
		add_action(
			'quillforms_entry_processed',
			function( $entry, $form_data ) {
				$connections = $this->form_data->get( $entry['form_id'], 'connections' );
				if ( ! empty( $connections ) ) {
					$this->tasks->enqueue_async( 'entry_process', compact( 'entry', 'form_data' ) );
				}
			},
			10,
			2
		);

		// register callback for async task.
		$this->tasks->register_callback(
			'entry_process',
			function( $entry, $form_data ) {
				$entry_process = new static::$classes['entry_process']( $this, $entry, $form_data );
				$entry_process->process();
			},
			2
		);
	}

}
