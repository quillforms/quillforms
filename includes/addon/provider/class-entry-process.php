<?php
/**
 * Entry_Process class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider;

use QuillForms\Abstracts\Log_Levels;
use QuillForms\Entry;
use QuillForms\Logic_Conditions;
use QuillForms\Merge_Tags;
use Throwable;

/**
 * Entry_Process class.
 *
 * @since 1.3.0
 */
abstract class Entry_Process {

	const SUCCEEDED = 'succeeded';
	const FAILED    = 'failed';
	const SKIPPED   = 'skipped';

	/**
	 * Provider
	 *
	 * @since 1.10.0
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Entry
	 *
	 * @since 1.10.0
	 *
	 * @var Entry
	 */
	protected $entry;

	/**
	 * Form data
	 *
	 * @since 1.10.0
	 *
	 * @var array
	 */
	protected $form_data;

	/**
	 * Constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Provider $provider Provider.
	 * @param Entry    $entry Entry.
	 * @param array    $form_data Form data.
	 */
	public function __construct( $provider, $entry, $form_data ) {
		$this->provider  = $provider;
		$this->entry     = $entry;
		$this->form_data = $form_data;
	}

	/**
	 * Run all connections
	 *
	 * @since 1.10.0
	 *
	 * @param array|null $connections Connections.
	 * @return void
	 */
	final public function run( $connections = null ) {
		$connections = $connections ?? $this->provider->form_data->get( $this->entry->form_id, 'connections' ) ?? array();
		foreach ( $connections as $connection_id => $connection ) {
			$this->run_connection( $connection_id, $connection );
		}
	}

	/**
	 * Run connection
	 *
	 * @since 1.20.0
	 *
	 * @param string     $connection_id Connection id.
	 * @param array|null $connection    Connection.
	 * @return array|null
	 */
	final public function run_connection( $connection_id, $connection = null ) {
		$connection = $connection ?? $this->provider->form_data->get( $this->entry->form_id, 'connections' )[ $connection_id ] ?? null;
		if ( ! $connection ) {
			return;
		}

		// check conditions.
		if ( empty( $connection['conditions'] ) || Logic_Conditions::instance()->is_conditions_met( $connection['conditions'], $this->entry, $this->form_data ) ) {
			try {
				$result = $this->execute_connection( $connection_id, $connection );
			} catch ( Throwable $e ) {
				$result = array(
					'status'  => self::FAILED,
					'details' => array(
						'exception' => array(
							'code'    => $e->getCode(),
							'message' => $e->getMessage(),
							'trace'   => $e->getTraceAsString(),
						),
					),
				);
			}
		} else {
			$result = array(
				'status'  => self::SKIPPED,
				'details' => array(
					'reason' => "logic conditions aren't met",
				),
			);
		}

		// log result.
		$this->log_result( $connection_id, $connection, $result );

		// do action.
		do_action( 'quillforms_provider_connection_processed', $this->form_data['id'], $this->provider->slug, $connection_id, $this->entry->ID, $result );

		return $result;
	}

	/**
	 * Process connection
	 *
	 * @since 1.10.0
	 *
	 * @param string $connection_id Connection id.
	 * @param array  $connection Connection data.
	 * @return array includes 'status' (one of status constants) and 'details'
	 */
	abstract protected function execute_connection( $connection_id, $connection );

	/**
	 * Get connection field value
	 *
	 * @since 1.6.0
	 *
	 * @param array  $field Connection field array, has 'type' and 'value' keys.
	 * @param string $context Context.
	 * @return mixed
	 */
	protected function get_connection_field_value( $field, $context = 'plain' ) {
		return Merge_Tags::instance()->process( $field, $this->entry, $this->form_data, $context );
	}

	/**
	 * Is field value empty
	 *
	 * @since 1.6.0
	 *
	 * @param mixed $value Field value.
	 * @return boolean
	 */
	protected function is_field_value_empty( $value ) {
		return null === $value || '' === $value || array() === $value;
	}

	/**
	 * Log connection process result
	 *
	 * @since 1.10.0
	 *
	 * @param string $connection_id Connection id.
	 * @param array  $connection Connection data.
	 * @param array  $result includes 'status' and 'details'.
	 * @return void
	 */
	private function log_result( $connection_id, $connection, $result ) {
		switch ( $result['status'] ) {
			case self::SUCCEEDED:
				$level   = Log_Levels::INFO;
				$message = esc_html__( 'Connection processed successfully', 'quillforms' );
				$code    = 'connection_processed_successfully';
				break;
			case self::FAILED:
				$level   = Log_Levels::ERROR;
				$message = esc_html__( 'Cannot process connection', 'quillforms' );
				$code    = 'cannot_process_connection';
				break;
			case self::SKIPPED:
				$level   = Log_Levels::INFO;
				$message = esc_html__( 'Connection process skipped', 'quillforms' );
				$code    = 'connection_process_skipped';
				break;
		}

		// add basic log context info.
		$context = array(
			'source'          => static::class . '->execute',
			'code'            => $code,
			'connection_id'   => $connection_id,
			'connection_name' => $connection['name'],
		);

		// add result details to context.
		$context = array_merge( $context, $result['details'] ?? array() );

		// add additional info for failed and skipped connections.
		if ( in_array( $result['status'], array( self::FAILED, self::SKIPPED ), true ) ) {
			$context = array_merge(
				$context,
				array(
					'connection' => $connection,
					'entry'      => $this->entry,
					'form_data'  => $this->form_data,
				)
			);
		}

		quillforms_get_logger()->log( $level, $message, $context );
	}

}
