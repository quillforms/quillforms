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
			if ( ! empty( $field ) ) {
				$filtered_field = $this->filter_connection_field( $field, $valid_blocks_ids );
				if ( ! empty( $filtered_field ) ) {
					$filtered_fields[ $field_key ] = $filtered_field;
				}
			}
		}
		return $filtered_fields;
	}

	/**
	 * Filter connection field
	 *
	 * @param array $field Field.
	 * @param array $valid_blocks_ids Valid blocks ids.
	 * @return array|false
	 */
	protected function filter_connection_field( $field, $valid_blocks_ids ) {
		$field_type  = $field['type'] ?? null;
		$field_value = $field['value'] ?? '';
		switch ( $field_type ) {
			case 'field':
				if ( in_array( $field_value, $valid_blocks_ids, true ) ) {
					return $field;
				} else {
					return false;
				}
			case 'text':
				$field_value = preg_replace_callback(
					'/{{field:([a-zA-Z0-9-_]+)}}/',
					function( $matches ) use ( $valid_blocks_ids ) {
						return in_array( $matches[1], $valid_blocks_ids, true ) ? $matches[0] : '';
					},
					$field_value
				);
				if ( ! $field_value ) {
					return false;
				}
				$field['value'] = $field_value;
				return $field;
			default:
				return false;
		}
	}

}
