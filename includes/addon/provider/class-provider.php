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
	 * @var Accounts|null
	 */
	public $accounts;

	/**
	 * Accounts data
	 *
	 * @var Accounts_Remote_Data|null
	 */
	public $accounts_remote_data;

	/**
	 * Class names
	 *
	 * @var array
	 */
	protected static $classes = array(
		// + classes from parent.
		// 'accounts'             => Accounts::class,
		// 'accounts_remote_data' => Accounts_Remote_Data::class,
		// 'entry_process'        => Entry_Process::class,
	);

	/**
	 * Initialize
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	protected function init() {
		parent::init();

		if ( ! empty( static::$classes['accounts'] ) ) {
			$this->accounts = new static::$classes['accounts']( $this );
		}
		if ( ! empty( static::$classes['accounts_remote_data'] ) ) {
			$this->accounts_remote_data = new static::$classes['accounts_remote_data']( $this );
		}

		$this->handle_entry_process();
	}

	/**
	 * Handle entry process
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	protected function handle_entry_process() {
		if ( \QuillForms\Settings::get( 'providers_sync_entry_process', false ) ) {
			$this->handle_entry_process_sync();
		} else {
			$this->handle_entry_process_async();
		}
	}

	/**
	 * Handle entry process sync
	 *
	 * @since 1.7.4
	 *
	 * @return void
	 */
	protected function handle_entry_process_sync() {
		add_action( 'quillforms_entry_processed', array( $this, 'handle_entry_process_action' ), 10, 2 );
	}

	/**
	 * Handle entry process async
	 *
	 * @since 1.7.4
	 *
	 * @return void
	 */
	protected function handle_entry_process_async() {
		// enqueue async task on entry added.
		add_action( 'quillforms_entry_processed', array( $this, 'add_entry_process_task' ), 10, 2 );

		// register callback for async task.
		$this->tasks->register_callback( 'entry_process', array( $this, 'handle_entry_process_task' ) );
	}

	/**
	 * Handle entry process action
	 *
	 * @since 1.7.4
	 *
	 * @param Entry $entry Entry.
	 * @param array $form_data Form data.
	 * @return void
	 */
	public function handle_entry_process_action( $entry, $form_data ) {
		$entry_process = new static::$classes['entry_process']( $this, $entry, $form_data );
		if ( method_exists( $entry_process, 'process' ) ) {
			$entry_process->process();
		} else {
			$entry_process->execute();
		}
	}

	/**
	 * Handle entry_processed action
	 *
	 * @since 1.7.4
	 *
	 * @param Entry $entry Entry.
	 * @param array $form_data Form data.
	 * @return void
	 */
	public function add_entry_process_task( $entry, $form_data ) {
		$connections = $this->form_data->get( $entry->form_id, 'connections' );
		if ( ! empty( $connections ) ) {
			$this->tasks->enqueue_async( 'entry_process', $entry, $form_data );
		}
	}

	/**
	 * Handle entry process task callback
	 *
	 * @since 1.7.4
	 *
	 * @param Entry $entry Entry.
	 * @param array $form_data Form data.
	 * @return void
	 */
	public function handle_entry_process_task( $entry, $form_data ) {
		$entry_process = new static::$classes['entry_process']( $this, $entry, $form_data );
		if ( method_exists( $entry_process, 'process' ) ) {
			$entry_process->process();
		} else {
			$entry_process->execute();
		}
	}

	/**
	 * Filter connections
	 *
	 * @since 1.6.0
	 * @deprecated 1.10.0
	 *
	 * @param integer $form_id Form id.
	 * @param array   $connections Connections.
	 * @return array
	 */
	public function filter_connections( $form_id, $connections ) {
		return $connections;
	}

	/**
	 * Filter connection fields
	 *
	 * @since 1.6.0
	 * @deprecated 1.10.0
	 *
	 * @param array $fields Fields.
	 * @param array $valid_blocks_ids Valid blocks ids.
	 * @return array
	 */
	protected function filter_connection_fields( $fields, $valid_blocks_ids ) { // phpcs:ignore
		return $fields;
	}

}
