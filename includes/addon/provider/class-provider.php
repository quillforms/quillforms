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
	 * Accounts data
	 *
	 * @var Accounts_Remote_Data
	 */
	public $accounts_remote_data;

	/**
	 * Connection properties that holds fields
	 *
	 * @since 1.6.0
	 *
	 * @var array
	 */
	protected $connection_fields_props = array();

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

		$this->accounts = new static::$classes['accounts']( $this );
		if ( ! empty( static::$classes['accounts_remote_data'] ) ) {
			$this->accounts_remote_data = new static::$classes['accounts_remote_data']( $this );
		}

		$this->handle_entry_process();
		$this->handle_form_blocks_updated();
	}

	/**
	 * Handle entry process
	 *
	 * @since 1.6.0
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
					$this->tasks->enqueue_async( 'entry_process', $entry, $form_data );
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
			}
		);
	}

	/**
	 * Handle form blocks updated action
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	protected function handle_form_blocks_updated() {
		add_action(
			'quillforms_form_blocks_updated',
			function( $form_id, $blocks ) {
				if ( empty( $this->connection_fields_props ) ) {
					return;
				}

				$blocks_ids = array();
				foreach ( $blocks as $block ) {
					$blocks_ids[] = $block['id'];
				}

				$connections = $this->form_data->get( $form_id, 'connections' );
				if ( empty( $connections ) ) {
					return;
				}

				foreach ( $connections as &$connection ) {
					foreach ( $this->connection_fields_props as $field_prop ) {
						$connection[ $field_prop ] = $this->filter_connection_fields( $connection[ $field_prop ], $blocks_ids );
					}
				}
				$this->form_data->update( $form_id, compact( 'connections' ) );
			},
			10,
			2
		);
	}

	/**
	 * Filter form data
	 *
	 * @since 1.6.0
	 *
	 * @param integer $form_id Form id.
	 * @param array   $form_data Form data.
	 * @return array
	 */
	public function filter_form_data( $form_id, $form_data ) {
		$form_data['connections'] = $this->filter_connections( $form_id, $form_data['connections'] ?? array() );
		return $form_data;
	}

	/**
	 * Filter connections
	 *
	 * @since 1.6.0
	 *
	 * @param integer $form_id Form id.
	 * @param array   $connections Connections.
	 * @return array
	 */
	abstract public function filter_connections( $form_id, $connections );

	/**
	 * Filter connection fields
	 *
	 * @since 1.6.0
	 *
	 * @param array $fields Fields.
	 * @param array $valid_blocks_ids Valid blocks ids.
	 * @return array
	 */
	protected function filter_connection_fields( $fields, $valid_blocks_ids ) {
		$filtered_fields = array();
		foreach ( $fields as $field_key => $field ) {
			if ( ! empty( $field['value'] ) ) {
				$field_value = $this->filter_connection_field_value( $field['value'], $valid_blocks_ids );
				if ( ! empty( $field_value ) ) {
					$filtered_fields[ $field_key ] = array_merge(
						$field,
						array( 'value' => $field_value )
					);
				}
			}
		}
		return $filtered_fields;
	}

	/**
	 * Filter connection field value
	 *
	 * @param string $field_value Field value.
	 * @param array  $valid_blocks_ids Valid blocks ids.
	 * @return array
	 */
	protected function filter_connection_field_value( $field_value, $valid_blocks_ids ) {
		return preg_replace_callback(
			'/{{field:([a-zA-Z0-9-_]+)}}/',
			function( $matches ) use ( $valid_blocks_ids ) {
				return in_array( $matches[1], $valid_blocks_ids, true ) ? $matches[0] : '';
			},
			$field_value
		);
	}

}
