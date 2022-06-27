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
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Entry
	 *
	 * @var Entry
	 */
	protected $entry;

	/**
	 * Form data
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
	 * Start entry process
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	final public function execute() {
		$connections = $this->provider->form_data->get( $this->entry->form_id, 'connections' ) ?? array();
		foreach ( $connections as $connection_id => $connection ) {
			// check conditions.
			if ( $connection['conditions'] ?? null ) {
				if ( ! Logic_Conditions::instance()->is_conditions_met( $connection['conditions'], $this->entry, $this->form_data ) ) {
					$this->log_result(
						$connection_id,
						$connection,
						array(
							'status'  => self::SKIPPED,
							'details' => array(
								'reason' => "logic conditions aren't met",
							),
						)
					);
					continue;
				}
			}

			// process connection.
			try {
				$result = $this->execute_connection( $connection_id, $connection );
				$this->log_result( $connection_id, $connection, $result );
			} catch ( Throwable $e ) {
				$this->log_result(
					$connection_id,
					$connection,
					array(
						'status'  => self::FAILED,
						'details' => array(
							'exception' => $e,
						),
					)
				);
			}
		}
	}

	// @codingStandardsIgnoreStart
	/**
	 * Process connection
	 * This function will be abstract in the future. All addons must use it and remove process().
	 *
	 * @since 1.10.0
	 *
	 * @param string $connection_id Connection id.
	 * @param array  $connection Connection data.
	 * @return array includes 'status' (one of status constants) and 'details'
	 */
	protected function execute_connection( $connection_id, $connection ) {}
	// @codingStandardsIgnoreEnd

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

	/**
	 * Get client ip address
	 * https://github.com/easydigitaldownloads/easy-digital-downloads/blob/master/includes/misc-functions.php
	 *
	 * @since 1.3.0
	 * @deprecated 1.7.1
	 *
	 * @return string
	 */
	final protected function get_client_ip() {
		$ip = false;

		if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			// Check ip from share internet.
			$ip = filter_var( wp_unslash( $_SERVER['HTTP_CLIENT_IP'] ), FILTER_VALIDATE_IP );
		} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			// To check ip is pass from proxy.
			// Can include more than 1 ip, first is the public one.
			// WPCS: sanitization ok.
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$ips = explode( ',', wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) );
			if ( is_array( $ips ) ) {
				$ip = filter_var( $ips[0], FILTER_VALIDATE_IP );
			}
		} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			$ip = filter_var( wp_unslash( $_SERVER['REMOTE_ADDR'] ), FILTER_VALIDATE_IP );
		}

		$ip = false !== $ip ? $ip : '127.0.0.1';

		// Fix potential CSV returned from $_SERVER variables.
		$ip_array = explode( ',', $ip );
		$ip_array = array_map( 'trim', $ip_array );

		return apply_filters( 'quillforms_entry_meta_ip', $ip_array[0] );
	}

}
