<?php
/**
 * Form Submission: class Form_Submission
 *
 * @since 1.0.0
 *
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Addon\Payment_Gateway\Payment_Gateway;
use QuillForms\Emails\Emails;
use QuillForms\Managers\Addons_Manager;
use QuillForms\Managers\Blocks_Manager;

/**
 * Form Sumbission class is responsible for handling form submission and response with success or error messages.
 *
 * @since 1.0.0
 */
class Form_Submission {

	/**
	 * Form data
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	public $form_data;

	/**
	 * Entry data
	 *
	 * @since 1.8.0
	 *
	 * @var array
	 */
	public $entry;

	/**
	 * Submission id
	 * Defined if handling a pending submission
	 *
	 * @since 1.8.0
	 *
	 * @var integer
	 */
	public $submission_id;

	/**
	 * Step
	 * Defined if handling a pending submission
	 *
	 * @since 1.8.0
	 *
	 * @var string
	 */
	public $step;

	/**
	 * Form errors
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	public $errors = array();

	/**
	 * Class instance
	 *
	 * @since 1.0.0
	 *
	 * @var self instance
	 */
	private static $instance = null;

	/**
	 * Get class instance
	 *
	 * @since 1.0.0
	 *
	 * @return self
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		add_action( 'wp_ajax_quillforms_form_submit', array( $this, 'submit' ) );
		add_action( 'wp_ajax_nopriv_quillforms_form_submit', array( $this, 'submit' ) );
	}

	/**
	 * Ajax submit.
	 *
	 * @since 1.0.0
	 */
	public function submit() {
		$this->process_submission();
		$this->respond();
	}

	/**
	 * Process submission
	 *
	 * @since 1.0.0
	 */
	public function process_submission() {
		$unsanitized_entry = json_decode( stripslashes( $_POST['formData'] ), true );

		// Check if form id is valid.
		if ( ! isset( $unsanitized_entry ) || ! isset( $unsanitized_entry['formId'] ) ) {
			$this->errors['form'] = 'Form Id missing!';
			return;
		}

		// Check if answers is array.
		if ( ! isset( $unsanitized_entry['answers'] ) || ! is_array( $unsanitized_entry['answers'] ) ) {
			$this->errors['form'] = "Answers aren't sent or invalid";
			return;
		}

		$form_id = sanitize_text_field( $unsanitized_entry['formId'] );

		// Check if post type is quill_forms and its status is publish.
		if ( 'quill_forms' !== get_post_type( $form_id ) || 'publish' !== get_post_status( $form_id ) ) {
			$this->errors['form'] = 'Invalid form id!';
			return;
		}

		$this->form_data = Core::get_form_data( $form_id );

		// sanitizing answers.
		$answers = array();
		foreach ( $this->form_data['blocks'] as $block ) {
			$block_type = Blocks_Manager::instance()->create( $block );
			if ( ! $block_type || ! $block_type->supported_features['editable'] ) {
				continue;
			}

			$field_answer = $unsanitized_entry['answers'][ $block['id'] ]['value'] ?? null;
			if ( null !== $field_answer ) {
				$answers[ $block['id'] ] = array(
					'value' => $block_type->sanitize_field( $field_answer, $this->form_data ),
				);
			}
		}

		$entry = array(
			'form_id' => $form_id,
			'answers' => $answers,
		);

		list( $walk_path, $entry ) = apply_filters( 'quillforms_submission_walk_path', array( $this->form_data['blocks'], $entry ) );

		// Validate all fields at the walkpath.
		foreach ( $walk_path as $field ) {
			$block_type = Blocks_Manager::instance()->create( $field );
			if ( ! $block_type || ! $block_type->supported_features['editable'] ) {
				continue;
			}

			$field_answer = $entry['answers'][ $field['id'] ]['value'] ?? null;
			$block_type->validate_field( $field_answer, $this->form_data );
			if ( ! $block_type->is_valid && ! empty( $block_type->validation_err ) ) {
				$this->errors['fields'][ $field['id'] ] = $block_type->validation_err;
			}
		}

		// Stop if there are validation errors.
		if ( ! empty( $this->errors ) ) {
			return;
		}

		// Format the editable non-empty fields.
		foreach ( $walk_path as $field ) {
			$block_type = Blocks_Manager::instance()->create( $field );
			if ( ! $block_type || ! $block_type->supported_features['editable'] ) {
				continue;
			}

			$field_answer = $entry['answers'][ $field['id'] ]['value'] ?? null;
			if ( null !== $field_answer ) {
				$entry['answers'][ $field['id'] ]['value'] = $block_type->format_field( $field_answer, $this->form_data );
			}
		}

		// set entry property.
		$this->entry = $entry;

		// get walk path ids.
		$walk_path_ids = array_values(
			array_map(
				function( $block ) {
					return $block['id'];
				},
				$walk_path
			)
		);

		// add entry meta.
		$this->entry['meta'] = array(
			'walk_path' => $walk_path_ids,
			'user_id'   => get_current_user_id(),
		);
		if ( ! Settings::get( 'disable_collecting_user_ip', false ) ) {
			$this->entry['meta']['user_ip'] = $this->get_client_ip();
		}
		if ( ! Settings::get( 'disable_collecting_user_agent', false ) ) {
			$this->entry['meta']['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
		}

		// check payment.
		$products = $this->get_products();
		if ( $products ) {
			$this->entry['meta']['payments'] = array(
				'products'  => $products,
				'currency'  => $this->get_currency(),
				'customer'  => $this->get_customer(),
				'recurring' => $this->get_recurring(),
			);

			$this->submission_id = $this->save_pending_submission( 'payment' );
			if ( ! $this->submission_id ) {
				wp_send_json_error( array( 'message' => 'Cannot save the pending submission' ), 500 );
				exit;
			}

			wp_send_json_success( $this->get_pending_submission_renderer_data(), 200 );
			exit;
		}

		$this->process_entry();
	}

	/**
	 * Restore pending submission
	 *
	 * @since 1.8.0
	 *
	 * @param integer $submission_id Submission id.
	 * @return boolean
	 */
	public function restore_pending_submission( $submission_id ) {
		$pending_submission = $this->get_pending_submission( $submission_id );
		if ( ! $pending_submission ) {
			return false;
		}

		$this->submission_id = $pending_submission['ID'];
		$this->step          = $pending_submission['step'];
		$this->form_data     = $pending_submission['form_data'];
		$this->entry         = $pending_submission['entry_data'];

		return true;
	}

	/**
	 * Continue pending submission
	 *
	 * @since 1.8.0
	 *
	 * @return void
	 */
	public function continue_pending_submission() {
		switch ( $this->step ) {
			case 'payment':
				$this->process_entry();
				$this->delete_pending_submission( $this->submission_id );
				break;
		}
	}

	/**
	 * Process the entry after validation
	 *
	 * @return void
	 */
	public function process_entry() {
		if ( $this->submission_id ) {
			$this->entry['meta']['submission_id'] = $this->submission_id;
		}

		// this can add 'id' to entry array.
		$this->entry = apply_filters( 'quillforms_entry_save', $this->entry, $this->form_data );

		// do entry saved action.
		if ( ! empty( $this->entry['id'] ) ) {
			do_action( 'quillforms_entry_saved', $this->entry, $this->form_data );
		}

		// process email notifications.
		$this->entry_email();

		// finally do entry processed action.
		do_action( 'quillforms_entry_processed', $this->entry, $this->form_data );
	}

	/**
	 * Get products data
	 *
	 * @return array|null
	 */
	public function get_products() {
		if ( ! ( $this->form_data['payments']['enabled'] ?? null ) ) {
			return null;
		}
		$items = array();
		foreach ( $this->form_data['payments']['products'] ?? null as $product ) {
			switch ( $product['type'] ) {
				case 'single':
					$value = 0;
					switch ( $product['value_type'] ) {
						case 'specific':
							$value = (float) $product['value'] ?? 0;
							break;
						case 'field':
							$value = (float) $this->entry['answers'][ $product['value'] ]['value'] ?? 0;
							break;
						case 'variable':
							$value = (float) $this->entry['variables'][ $product['value'] ] ?? 0;
							break;
					}
					if ( is_numeric( $value ) && $value > 0 ) {
						$items[] = array(
							'name'  => $product['name'],
							'value' => $value,
						);
					}
					break;
				case 'mapping':
					$field_id   = $product['field'];
					$block_data = array_values(
						array_filter(
							$this->form_data['blocks'],
							function( $block ) use ( $field_id ) {
								return $block['id'] === $field_id;
							}
						)
					) [0] ?? null;
					if ( ! $block_data ) {
						break;
					}

					$choices_labels = array();
					foreach ( $block_data['attributes']['choices'] as $choice ) {
						$choices_labels[ $choice['value'] ] = $choice['label'];
					}

					$selected_choices = (array) $this->entry['answers'][ $field_id ]['value'] ?? array();
					foreach ( $product['values'] as $choice_id => $value ) {
						if ( is_numeric( $value ) && (float) $value > 0 && in_array( $choice_id, $selected_choices, true ) ) {
							$items[] = array(
								'name'  => $choices_labels[ $choice_id ],
								'value' => (float) $value,
							);
						}
					}
					break;
			}
		}

		$total = array_reduce(
			$items,
			function( $carry, $product ) {
				return $carry + $product['value'];
			},
			0
		);

		if ( empty( $items ) || empty( $total ) ) {
			return null;
		}

		return compact( 'items', 'total' );
	}

	/**
	 * Get currency data
	 *
	 * @since 1.8.0
	 *
	 * @return array
	 */
	public function get_currency() {
		$currency = $this->form_data['payments']['currency'];
		$symbol   = Payments::instance()->get_currencies()[ $currency['code'] ]['symbol'];
		return array(
			'code'       => $currency['code'],
			'symbol'     => $symbol,
			'symbol_pos' => $currency['symbol_pos'],
		);
	}

	/**
	 * Get customer info
	 *
	 * @since 1.8.0
	 *
	 * @return array
	 */
	public function get_customer() {
		$name_field  = $this->form_data['payments']['customer']['name']['value'] ?? null;
		$email_field = $this->form_data['payments']['customer']['email']['value'] ?? null;

		return array(
			'name'  => $name_field ? ( $this->entry['answers'][ $name_field ]['value'] ?? null ) : null,
			'email' => $email_field ? ( $this->entry['answers'][ $email_field ]['value'] ?? null ) : null,
		);
	}

	/**
	 * Get recurring
	 *
	 * @since 1.8.0
	 *
	 * @return array|null
	 */
	public function get_recurring() {
		$recurring = $this->form_data['payments']['recurring'] ?? null;
		if ( $recurring['enabled'] ?? null ) {
			return array(
				'interval_count' => (int) $recurring['interval_count'],
				'interval_unit'  => $recurring['interval_unit'],
			);
		} else {
			return null;
		}
	}

	/**
	 * Get pending submission renderer data
	 *
	 * @since 1.8.0
	 *
	 * @return array
	 */
	public function get_pending_submission_renderer_data() {
		return array(
			'status'             => 'pending_payment',
			'submission_id'      => $this->submission_id,
			'payments'           => array_merge(
				$this->entry['meta']['payments'],
				array(
					'methods' => $this->get_payment_methods(),
				)
			),
			'thankyou_screen_id' => $this->get_thankyou_screen_id(),
		);
	}

	/**
	 * Get payment methods
	 *
	 * @since 1.8.0
	 *
	 * @return array
	 */
	public function get_payment_methods() {
		$result = array();

		// enabled gateways & methods.
		$enabled_methods = array();
		foreach ( $this->form_data['payments']['methods'] ?? array() as $key => $data ) {
			if ( empty( $data['enabled'] ) ) {
				continue;
			}
			list( $gateway, $method )      = explode( ':', $key );
			$enabled_methods[ $gateway ][] = $method;
		}

		// check support.
		foreach ( $enabled_methods as $gateway => $methods ) {
			/** @var Payment_Gateway */ // phpcs:ignore
			$gateway_addon = Addons_Manager::instance()->get_registered( $gateway );

			// check if registered.
			if ( ! $gateway_addon ) {
				continue;
			}

			// check settings support.
			// this is a double check. settings shouldn't be saved if not supported.
			if ( ! $gateway_addon->is_currency_supported( $this->get_currency()['code'] ) ) {
				continue;
			}
			$recurring = $this->get_recurring();
			if ( $recurring && ! $gateway_addon->is_recurring_interval_supported( $recurring['interval_unit'], (int) $recurring['interval_count'] ) ) {
				continue;
			}

			// methods check and adding.
			foreach ( $methods as $method ) {
				// check if configured.
				if ( ! $gateway_addon->is_configured( $method ) ) {
					continue;
				}
				// check recurring support.
				if ( $recurring && ! $gateway_addon->is_recurring_supported( $method ) ) {
					continue;
				}

				$key            = "$gateway:$method";
				$result[ $key ] = array(
					'options' => $this->form_data['payments']['methods'][ $key ]['options'] ?? array(),
				);
			}
		}

		return $result;
	}

	/**
	 * Get thank you screen id
	 *
	 * @since 1.8.0
	 *
	 * @return string
	 */
	public function get_thankyou_screen_id() {
		$walk_path_ids = $this->entry['meta']['walk_path'];

		$last_block_id = $walk_path_ids[ count( $walk_path_ids ) - 1 ];
		$last_block    = array_values(
			array_filter(
				$this->form_data['blocks'],
				function( $block ) use ( $last_block_id ) {
					return $block['id'] === $last_block_id;
				}
			)
		)[0];

		if ( 'thankyou-screen' === $last_block['name'] ) {
			return $last_block['id'];
		} else {
			return 'default_thankyou_screen';
		}
	}

	/**
	 * Save pending submission
	 *
	 * @param string $step Step.
	 * @return id
	 */
	private function save_pending_submission( $step ) {
		global $wpdb;

		$insert = $wpdb->insert(
			"{$wpdb->prefix}quillforms_pending_submissions",
			array(
				'form_id'      => $this->entry['form_id'],
				'step'         => $step,
				'entry_data'   => maybe_serialize( $this->entry ),
				'form_data'    => maybe_serialize( $this->form_data ),
				'date_created' => gmdate( 'Y-m-d H:i:s' ),
			)
		);

		if ( ! $insert ) {
			quillforms_get_logger()->alert(
				'Cannot insert pending submission',
				array(
					'entry'     => $this->entry,
					'form_data' => $this->form_data,
				)
			);
			return false;
		}

		return $wpdb->insert_id;
	}

	/**
	 * Get pending submission
	 *
	 * @param integer $id Submission id.
	 * @return array
	 */
	private function get_pending_submission( $id ) {
		global $wpdb;

		$result = $wpdb->get_row(
			$wpdb->prepare(
				"
					SELECT *
					FROM {$wpdb->prefix}quillforms_pending_submissions
					WHERE ID = %d
				",
				$id
			),
			ARRAY_A
		);

		if ( ! $result ) {
			return null;
		}

		if ( isset( $result['entry_data'] ) ) {
			$result['entry_data'] = maybe_unserialize( $result['entry_data'] );
		}
		if ( isset( $result['form_data'] ) ) {
			$result['form_data'] = maybe_unserialize( $result['form_data'] );
		}

		return $result;
	}

	/**
	 * Delete pending submission
	 *
	 * @param integer $id Submission id.
	 * @return boolean
	 */
	private function delete_pending_submission( $id ) {
		global $wpdb;

		return (bool) $wpdb->delete(
			"{$wpdb->prefix}quillforms_pending_submissions",
			array( 'ID' => $id ),
			array( '%d' )
		);
	}

	/**
	 * Process emails based on entry and form data.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function entry_email() {
		quillforms_get_logger()->debug(
			'Start processing notifications',
			array(
				'form_data' => $this->form_data,
				'entry'     => $this->entry,
			)
		);

		foreach ( $this->form_data['notifications'] as $notification ) {

			$notification_id         = $notification['id'];
			$notification_properties = $notification['properties'];

			$process_email = apply_filters( 'quillforms_entry_email_process', true, $this->entry, $this->form_data, $notification_id );

			// if process email = false or notifcation isn't active, continue.
			if ( ! $process_email || ! $notification_properties['active'] ) {
				continue;
			}

			$email = array();

			// Setup email properties.
			/* translators: %s - form name. */
			$email['subject'] = ! empty( $notification_properties['subject'] ) ? $notification_properties['subject'] : sprintf( esc_html__( 'New %s Entry', 'quillforms' ), $this->form_data['title'] );
			$email['address'] = $notification_properties['recipients'];
			if ( 'field' === $notification_properties['toType'] ) {
				$email['address'] = array_map(
					function( $address ) {
						return Merge_Tags::process_tag( $address, $this->entry, $this->form_data );
					},
					$email['address']
				);
			}

			$email['address'] = array_map( 'sanitize_email', $email['address'] );
			$email['address'] = array_filter(
				$email['address'],
				function( $email ) {
					return ! ! $email;
				}
			);

			if ( empty( $email['address'] ) ) {
				continue;
			}
			$email['sender_address'] = get_option( 'admin_email' );
			$email['sender_name']    = get_bloginfo( 'name' );
			$email['replyto']        = ! empty( $notification['properties']['replyTo'] ) ? $notification['properties']['replyTo'] : false;
			$email['message']        = ! empty( $notification_properties['message'] ) ? $notification_properties['message'] : '{{form:all_answers}}';
			$email                   = apply_filters( 'quillforms_entry_email_atts', $email, $this->entry, $this->form_data, $notification_id );

			quillforms_get_logger()->debug( 'Initial email data', compact( 'email' ) );

			// Create new email.
			$emails                  = new Emails();
			$emails->form_data       = $this->form_data;
			$emails->entry           = $this->entry;
			$emails->notification_id = $notification_id;
			$emails->from_name       = $email['sender_name'];
			$emails->from_address    = $email['sender_address'];
			$emails->reply_to        = $email['replyto'];

			// Maybe include CC.
			if ( ! empty( $notification['carboncopy'] ) && Settings::get( 'email-carbon-copy' ) ) {
				$emails->cc = $notification['carboncopy'];
			}

			$emails = apply_filters( 'quillforms_entry_email_before_send', $emails );

			quillforms_get_logger()->debug( 'Emails object', compact( 'emails' ) );

			// Go.
			foreach ( $email['address'] as $address ) {
				$emails->send( trim( $address ), $email['subject'], $email['message'] );
			}
		}
	}

	/**
	 * Respond with error or success.
	 *
	 * @since 1.0.0
	 */
	protected function respond() {
		// Restore form instance ID.
		if ( ! empty( $this->errors ) ) {
			wp_send_json_error( $this->errors, 400 );
		} else {
			wp_send_json_success( array( 'status' => 'completed' ), 200 );
		}
	}

	/**
	 * Get client ip address
	 * https://github.com/easydigitaldownloads/easy-digital-downloads/blob/master/includes/misc-functions.php
	 *
	 * @since 1.1.0
	 *
	 * @return string
	 */
	private function get_client_ip() {
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
