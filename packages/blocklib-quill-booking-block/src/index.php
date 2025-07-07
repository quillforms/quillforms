<?php
/**
 * Block Library: class Quill_Booking_Block_Type
 *
 * @package QuillForms
 * @subpackage BlockLibrary
 * @since 1.0.0
 */

namespace QuillForms\Blocks;

use QuillForms\Abstracts\Block_Type;
use QuillForms\Managers\Blocks_Manager;

defined( 'ABSPATH' ) || exit;

/**
 * Booking Block
 *
 * @class    Quill_Booking_Block_Type
 *
 * @since 1.0.0
 */
class Quill_Booking_Block_Type extends Block_Type {

	/**
	 * Metadata json file.
	 *
	 * @var string
	 *
	 * @access private
	 */
	private $metadata;

	/**
	 * Get block name.
	 * It must be unique name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The block name
	 */
	public function get_name() : string {
		return $this->get_metadata()['name'];
	}

	/**
	 * Get block supported features.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block supported features
	 */
	public function get_block_supported_features() : iterable {
		return $this->get_metadata()['supports'];
	}

	/**
	 * Get block admin assets.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block admin assets
	 */
	public function get_block_admin_assets() : iterable {
		return array(
			'style'  => 'quillforms-blocklib-quill-booking-block-admin-style',
			'script' => 'quillforms-blocklib-quill-booking-block-admin-script',
		);
	}

	/**
	 * Get block renderer assets.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block renderer assets.
	 */
	public function get_block_renderer_assets() : iterable {
		return array(
			'style'  => 'quillforms-blocklib-quill-booking-block-renderer-style',
			'script' => 'quillforms-blocklib-quill-booking-block-renderer-script',
		);
	}

	/**
	 * Get block custom attributes.
	 *
	 * @since 1.0.0
	 *
	 * @return array The block custom attributes
	 */
	public function get_custom_attributes() : iterable {
		return $this->get_metadata()['attributes'];
	}

	/**
	 * Get logical operators
	 *
	 * @since 1.0.0
	 *
	 * @return array The logical operators
	 */
	public function get_logical_operators() : iterable {
		return $this->get_metadata()['logicalOperators'];
	}

	/**
	 * Check if the block value should be stored as an array
	 *
	 * @since 1.0.0
	 *
	 * @return boolean
	 */
	public function is_value_array() {
		return true;
	}

	/**
	 * Get meta data
	 * This file is just for having some shared properties between front end and back end.
	 * Just as the block type.
	 *
	 * @access private
	 *
	 * @return array|null metadata from block . json file
	 */
	private function get_metadata() {
		if ( ! $this->metadata ) {
			$this->metadata = json_decode(
				file_get_contents(
					$this->get_dir() . 'block.json'
				),
				true
			);
		}
		return $this->metadata;
	}

	/**
	 * Get block directory.
	 *
	 * @since 1.0.0
	 *
	 * @access private
	 *
	 * @return string The directory path
	 */
	private function get_dir() : string {
		return trailingslashit( dirname( __FILE__ ) );
	}

	/**
	 * Validate Field.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value     The field value.
	 * @param array $form_data The form data.
	 */
	public function validate_field( $value, $form_data ) {
		$messages = $form_data['messages'];

		// Check if QuillBooking plugin is active
		$is_quillbooking_active = false;
		if ( function_exists( 'is_plugin_active' ) ) {
			// Check if QuillBooking plugin is active
			$active_plugins = get_option( 'active_plugins' );
			foreach ( $active_plugins as $plugin ) {
				if ( strpos( $plugin, 'quillbooking' ) !== false ) {
					$is_quillbooking_active = true;
					break;
				}
			}
		} else {
			// Fallback: check if QuillBooking functions exist
			$is_quillbooking_active = function_exists( 'quillbooking_create_booking' ) ||
									  class_exists( 'QuillBooking\\QuillBooking' ) ||
									  defined( 'QUILLBOOKING_VERSION' );
		}

		// If QuillBooking is not active, skip required validation (make field optional)
		if ( ! $is_quillbooking_active ) {
			$this->is_valid = true;
			return;
		}

		if ( empty( $value ) ) {
			if ( $this->attributes['required'] ) {
				$this->is_valid       = false;
				$this->validation_err = $messages['label.errorAlert.required'];
			}
		} else {
			// Accept either the expected structure or any non-empty value
			if ( is_array( $value ) && ( isset( $value['bookingId'] ) || isset( $value['eventId'] ) || isset( $value['status'] ) ) ) {
				$this->is_valid = true;
			} elseif ( ! empty( $value ) ) {
				$this->is_valid = true;
			} else {
				$this->is_valid       = false;
				$this->validation_err = esc_html__( 'Booking data error', 'quillforms' );
			}
		}
	}

	/**
	 * Get readable value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed  $value     The entry value.
	 * @param array  $form_data The form data.
	 * @param string $context   The context.
	 *
	 * @return mixed $value The entry value.
	 */
	public function get_readable_value( $value, $form_data, $context = 'html' ) {
		// First try to find booking data in the value - handle both camelCase and lowercase
		$has_booking_data = is_array( $value ) && (
			isset( $value['bookingId'] ) || isset( $value['bookingid'] ) ||
			isset( $value['eventId'] ) || isset( $value['eventid'] )
		);

		if ( $has_booking_data ) {
			// Get the eventId from form data
			$event_id_from_form = '';
			if ( isset( $form_data['blocks'] ) && is_array( $form_data['blocks'] ) ) {
				foreach ( $form_data['blocks'] as $block ) {
					if ( isset( $block['name'] ) && $block['name'] === 'quill-booking' && isset( $block['attributes']['eventId'] ) ) {
						$event_id_from_form = $block['attributes']['eventId'];
						break;
					}
				}
			}

			// Handle both camelCase and lowercase field names
			$booking_id = $value['bookingId'] ?? $value['bookingid'] ?? $value['id'] ?? null;
			$event_id   = $value['eventId'] ?? $value['eventid'] ?? $value['event'] ?? $event_id_from_form ?? null;

			// Generate URL for booking confirmation
			$url = null;
			if ( $booking_id ) {
				// Use the correct QuillBooking confirmation URL format
				// Format: ?quillbooking=booking&id={bookingId}&type=confirm
				$base_url = home_url();
				$url      = $base_url . '?' . http_build_query(
					array(
						'quillbooking' => 'booking',
						'id'           => $booking_id,
						'type'         => 'confirm',
					)
				);
			}

			if ( $url ) {
				switch ( $context ) {
					case 'html':
						return '<a href="' . esc_url( $url ) . '" target="_blank">' . esc_html( $url ) . '</a>';
					case 'spreadsheet':
						return '=HYPERLINK("' . $url . '","' . $url . '")';
					case 'plain':
						return $url;
					default:
						return $value;
				}
			}
		}

		// Handle string values that might be JSON
		if ( is_string( $value ) && ! empty( $value ) ) {
			if ( strpos( $value, '{' ) === 0 ) {
				$decoded = json_decode( $value, true );
				if ( json_last_error() === JSON_ERROR_NONE ) {
					return $this->get_readable_value( $decoded, $form_data, $context );
				}
			}
			return $value;
		}

		// For arrays, show the contents
		if ( is_array( $value ) ) {
			return implode(
				', ',
				array_map(
					function( $k, $v ) {
						if ( is_array( $v ) || is_object( $v ) ) {
							  return "$k: " . print_r( $v, true );
						}
						return "$k: $v";
					},
					array_keys( $value ),
					$value
				)
			);
		}

		return $value;
	}

	/**
	 * Sanitize entry value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value     The entry value.
	 * @param array $form_data The form data.
	 *
	 * @return string|array The sanitized booking data
	 */
	public function sanitize_field( $value, $form_data ) {
		// If the value is a JSON string (from the booking confirmation)
		if ( is_string( $value ) && strpos( $value, '{' ) === 0 ) {
			$decoded = json_decode( $value, true );
			if ( json_last_error() === JSON_ERROR_NONE ) {
				// Sanitize each value in the array
				$sanitized = array();
				foreach ( $decoded as $key => $val ) {
					$sanitized[ sanitize_key( $key ) ] = sanitize_text_field( $val );
				}
				return $sanitized;
			}
		}

		// If it's already an array, sanitize each value
		if ( is_array( $value ) ) {
			$sanitized = array();
			foreach ( $value as $key => $val ) {
				$sanitized[ sanitize_key( $key ) ] = sanitize_text_field( $val );
			}
			return $sanitized;
		}

		// Otherwise, just sanitize as text
		return sanitize_text_field( $value );
	}

	/**
	 * Process form submission and handle name/email integration.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value     The field value.
	 * @param array $form_data The form data.
	 * @param int   $entry_id  The entry ID.
	 */
	public function process_field( $value, $form_data, $entry_id ) {
		// If QuillBooking plugin exists and we have a booking value
		if ( function_exists( 'quillbooking_create_booking' ) && ! empty( $value ) ) {
			$booking_data = is_array( $value ) ? $value : json_decode( $value, true );

			if ( is_array( $booking_data ) && isset( $booking_data['eventId'] ) ) {
				// Get name and email from the form if specified in the block attributes
				$name  = '';
				$email = '';

				// Get name field value if configured
				if ( ! empty( $this->attributes['username']['value'] ) && isset( $form_data['answers'][ $this->attributes['username']['value'] ] ) ) {
					$name = $form_data['answers'][ $this->attributes['username']['value'] ];
				}

				// Get email field value if configured
				if ( ! empty( $this->attributes['email']['value'] ) && isset( $form_data['answers'][ $this->attributes['email']['value'] ] ) ) {
					$email = $form_data['answers'][ $this->attributes['email']['value'] ];
				}

				// Create the booking in QuillBooking
				$booking_args = array(
					'event_ids'       => array( $booking_data['eventId'] ),
					'customer_name'   => $name,
					'customer_email'  => $email,
					'form_entry_id'   => $entry_id,
					'additional_data' => $booking_data,
				);

				quillbooking_create_booking( $booking_args );
			}
		}
	}
}

// Register the block with the Blocks Manager
Blocks_Manager::instance()->register( new Quill_Booking_Block_Type() );

