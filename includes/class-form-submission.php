<?php
/**
 * Form Submission: class Form_Submission
 *
 * @since 1.0.0
 *
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Emails\Emails;
use QuillForms\Managers\Blocks_Manager;

/**
 * Form Sumbission class is responsible for handling form submission and response with success or error messages.
 *
 * @since 1.0.0
 */
class Form_Submission {

	/**
	 * Class instance.
	 *
	 * @var Form_Submission instance
	 */
	private static $instance = null;

	/**
	 * Form data and settings
	 *
	 * @var $form_data
	 *
	 * @since 1.0.0
	 */
	public $form_data = array();

	/**
	 * Form errors
	 *
	 * @var $errors
	 *
	 * @since 1.0.0
	 */
	public $errors = array();

	/**
	 * Get class instance.
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
		if (
		'quill_forms' !== get_post_type( $form_id )
		|| 'publish' !== get_post_status( $form_id )
		) {
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

		$fields = array_filter(
			$this->form_data['blocks'],
			function ( $block ) {
				return 'welcome-screen' !== $block['name'] && 'thankyou-screen' !== $block['name'];
			}
		);

		list( $walk_path, $entry ) = apply_filters( 'quillforms_submission_walk_path', array( $fields, $entry ) );

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

		// this can add 'id' to entry array.
		$entry = apply_filters( 'quillforms_entry_save', $entry, $this->form_data );

		// do entry saved action.
		if ( ! empty( $entry['id'] ) ) {
			do_action( 'quillforms_entry_saved', $entry, $this->form_data );
		}

		// process email notifications.
		$this->entry_email( $entry, $this->form_data );

		// finally do entry processed action.
		do_action( 'quillforms_entry_processed', $entry, $this->form_data );
	}

	/**
	 * Process emails based on entry and form data.
	 *
	 * @since 1.0.0
	 *
	 * @param array $entry     User submitted data after being validated and formatted.
	 * @param array $form_data Prepared form settings.
	 */
	public function entry_email( $entry, $form_data ) {
		$notifications = $form_data['notifications'];

		quillforms_get_logger()->debug( 'Start processing notifications', compact( 'notifications', 'entry', 'form_data' ) );

		foreach ( $notifications as $notification ) :

			$notification_id         = $notification['id'];
			$notification_properties = $notification['properties'];

			$process_email = apply_filters( 'quillforms_entry_email_process', true, $entry, $form_data, $notification_id );

			// if process email = false or notifcation isn't active, continue.
			if ( ! $process_email || ! $notification_properties['active'] ) {
				continue;
			}

			$email = array();

			// Setup email properties.
			/* translators: %s - form name. */
			$email['subject'] = ! empty( $notification_properties['subject'] ) ? $notification_properties['subject'] : sprintf( esc_html__( 'New %s Entry', 'quillforms' ), $form_data['title'] );
			$email['address'] = $notification_properties['recipients'];
			if ( 'field' === $notification_properties['toType'] ) {
				$email['address'] = array_map(
					function( $address ) use ( $entry, $form_data ) {
						return Merge_Tags::process_tag( $address, $entry, $form_data );
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
			$email                   = apply_filters( 'quillforms_entry_email_atts', $email, $entry, $form_data, $notification_id );

			quillforms_get_logger()->debug( 'Initial email data', compact( 'email' ) );

			// Create new email.
			$emails                  = new Emails();
			$emails->form_data       = $form_data;
			$emails->entry           = $entry;
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
		endforeach;
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
			wp_send_json_success( 'Updated successfully!', 200 );
		}
	}
}
