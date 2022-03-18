<?php
/**
 * Entry_Process class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider;

use QuillForms\Managers\Blocks_Manager;
use QuillForms\Merge_Tags;

/**
 * Entry_Process class.
 *
 * @since 1.3.0
 */
abstract class Entry_Process {

	/**
	 * Provider
	 *
	 * @var Provider
	 */
	protected $provider;

	/**
	 * Entry
	 *
	 * @var array
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
	 * @param array    $entry Entry.
	 * @param array    $form_data Form data.
	 */
	public function __construct( $provider, $entry, $form_data ) {
		$this->provider  = $provider;
		$this->entry     = $entry;
		$this->form_data = $form_data;
	}

	/**
	 * Process entry
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	abstract public function process();

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
		if ( empty( $field ) ) {
			return null;
		}
		$field_type  = $field['type'] ?? null;
		$field_value = $field['value'] ?? '';
		if ( in_array( $field_type, Merge_Tags::instance()->get_registered_types(), true ) ) {
			return Merge_Tags::instance()->process_tag( $field_type, $field_value, $this->entry, $this->form_data, $context );
		} else {
			return Merge_Tags::instance()->process_text( $field_value, $this->entry, $this->form_data, $context );
		}
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
