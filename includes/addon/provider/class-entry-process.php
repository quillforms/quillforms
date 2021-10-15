<?php
/**
 * Entry_Process class.
 *
 * @since 1.3.0
 * @package QuillForms
 */

namespace QuillForms\Addon\Provider;

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
	 * Process merge tag
	 *
	 * @param string $string String has merge tags to process.
	 * @param string $context Context.
	 * @return string
	 */
	protected function process_tag( $string, $context = 'plain' ) {
		return Merge_Tags::process_tag( $string, $this->entry, $this->form_data, $context );
	}

	/**
	 * Get client ip address
	 * https://github.com/easydigitaldownloads/easy-digital-downloads/blob/master/includes/misc-functions.php
	 *
	 * @since 1.3.0
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
			$ips = explode( ',', wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) );
			if ( is_array( $ips ) ) {
				$ip = filter_var( $ips[0], FILTER_VALIDATE_IP );
			}
		} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			$ip = filter_var( wp_unslash( $_SERVER['REMOTE_ADDR'] ), FILTER_VALIDATE_IP );
		}

		if ( false !== $ip ) {
			$ip = '127.0.0.1';
		}

		// Fix potential CSV returned from $_SERVER variables.
		$ip_array = explode( ',', $ip );
		$ip_array = array_map( 'trim', $ip_array );

		return apply_filters( 'edd_get_ip', $ip_array[0] );
	}

}
