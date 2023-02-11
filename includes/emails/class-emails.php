<?php
/**
 * Emails: class Emails
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage Emails
 */

namespace QuillForms\Emails;

use QuillForms\Entry;
use QuillForms\Core;
use QuillForms\Managers\Blocks_Manager;
use QuillForms\Merge_Tags;
use QuillForms\Settings;

/**
 * Emails.
 *
 * This class handles all (notification) emails sent by Quill Forms .
 *
 * Heavily influenced by the great AffiliateWP plugin by Pippin Williamson and WP forms.
 * https://github.com/JustinSainton/AffiliateWP/blob/master/includes/emails/class-affwp-emails.php
 *
 * @since 1.0.0
 */
class Emails {

	/**
	 * Store the from address.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $from_address;

	/**
	 * Store the from name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $from_name;

	/**
	 * Store the reply-to address.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $reply_to = false;

	/**
	 * Store the carbon copy addresses.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $cc = false;

	/**
	 * Store the email content type.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $content_type;

	/**
	 * Store the email headers.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $headers;

	/**
	 * Whether to send email in HTML.
	 *
	 * @since 1.0.0
	 *
	 * @var bool
	 */
	public $html = true;

	/**
	 * The email template to use.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $template;

	/**
	 * Form data and settings.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	public $form_data = array();

	/**
	 * Fields, formatted, and sanitized.
	 *
	 * @since 1.0.0
	 *
	 * @var Entry
	 */
	public $entry;

	/**
	 * Notification ID that is currently being processed.
	 *
	 * @since 1.0.0
	 *
	 * @var int
	 */
	public $notification_id = '';

	/**
	 * Get things going.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		if ( 'none' === $this->get_template() ) {
			$this->html = false;
		}

		add_action( 'quillforms_email_send_before', array( $this, 'send_before' ) );
		add_action( 'quillforms_email_send_after', array( $this, 'send_after' ) );
	}

	/**
	 * Get the email from name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The email from name
	 */
	public function get_from_name() {

		if ( ! empty( $this->from_name ) ) {
			$this->from_name = $this->process_tag( $this->from_name );
		} else {
			$this->from_name = get_bloginfo( 'name' );
		}

		return apply_filters( 'quillforms_email_from_name', quillforms_decode_string( $this->from_name ), $this );
	}

	/**
	 * Get the email from address.
	 *
	 * @since 1.0.0
	 *
	 * @return string The email from address.
	 */
	public function get_from_address() {

		if ( ! empty( $this->from_address ) ) {
			$this->from_address = $this->process_tag( $this->from_address );
		} else {
			$this->from_address = get_option( 'admin_email' );
		}

		return apply_filters( 'quillforms_email_from_address', quillforms_decode_string( $this->from_address ), $this );
	}

	/**
	 * Get the email reply-to.
	 *
	 * @since 1.0.0
	 *
	 * @return string The email reply-to address.
	 */
	public function get_reply_to() {

		if ( ! empty( $this->reply_to ) ) {

			$this->reply_to = $this->process_tag( $this->reply_to );

			if ( ! is_email( $this->reply_to ) ) {
				$this->reply_to = false;
			}
		}

		return apply_filters( 'quillforms_email_reply_to', quillforms_decode_string( $this->reply_to ), $this );
	}

	/**
	 * Get the email carbon copy addresses.
	 *
	 * @since 1.0.0
	 *
	 * @return string The email reply-to address.
	 */
	public function get_cc() {

		if ( ! empty( $this->cc ) ) {

			$this->cc = $this->process_tag( $this->cc );

			$addresses = array_map( 'trim', explode( ',', $this->cc ) );

			foreach ( $addresses as $key => $address ) {
				if ( ! is_email( $address ) ) {
					unset( $addresses[ $key ] );
				}
			}

			$this->cc = implode( ',', $addresses );
		}

		return apply_filters( 'quillforms_email_cc', quillforms_decode_string( $this->cc ), $this );
	}

	/**
	 * Get the email content type.
	 *
	 * @since 1.0.0
	 *
	 * @return string The email content type.
	 */
	public function get_content_type() {

		if ( ! $this->content_type && $this->html ) {
			$this->content_type = apply_filters( 'quillforms_email_default_content_type', 'text/html', $this );
		} elseif ( ! $this->html ) {
			$this->content_type = 'text/plain';
		}

		return apply_filters( 'quillforms_email_content_type', $this->content_type, $this );
	}

	/**
	 * Get the email headers.
	 *
	 * @since 1.0.0
	 *
	 * @return string The email headers.
	 */
	public function get_headers() {

		if ( ! $this->headers ) {
			$this->headers = "From: {$this->get_from_name()} <{$this->get_from_address()}>\r\n";
			if ( $this->get_reply_to() ) {
				$this->headers .= "Reply-To: {$this->get_reply_to()}\r\n";
			}
			if ( $this->get_cc() ) {
				$this->headers .= "Cc: {$this->get_cc()}\r\n";
			}
			$this->headers .= "Content-Type: {$this->get_content_type()}; charset=utf-8\r\n";
		}

		return apply_filters( 'quillforms_email_headers', $this->headers, $this );
	}

	/**
	 * Build the email.
	 *
	 * @since 1.0.0
	 *
	 * @param string $message The email message.
	 *
	 * @return string
	 */
	public function build_email( $message ) {

		// Plain text email shortcut.
		if ( false === $this->html ) {
			$message = $this->process_tag( $message );
			$message = str_replace( '{{form:all_answers}}', $this->html_field_value( false ), $message );

			return apply_filters( 'quillforms_email_message', quillforms_decode_string( $message ), $this );
		}

		/*
		 * Generate an HTML email.
		 */

		ob_start();

		$this->get_template_part( 'header', $this->get_template(), true );

		// Hooks into the email header.
		do_action( 'quillforms_email_header', $this );

		$this->get_template_part( 'body', $this->get_template(), true );

		// Hooks into the email body.
		do_action( 'quillforms_email_body', $this );

		$this->get_template_part( 'footer', $this->get_template(), true );

		// Hooks into the email footer.
		do_action( 'quillforms_email_footer', $this );

		$message = $this->process_tag( $message );
		$message = nl2br( $message );

		$body = ob_get_clean();

		$message = str_replace( '{email}', $message, $body );
		$message = str_replace( '{{form:all_answers}}', $this->html_field_value( true ), $message );
		$message = make_clickable( $message );

		return apply_filters( 'quillforms_email_message', $message, $this );
	}

	/**
	 * Send the email.
	 *
	 * @since 1.0.0
	 *
	 * @param string $to          The To address.
	 * @param string $subject     The subject line of the email.
	 * @param string $message     The body of the email.
	 * @param array  $attachments Attachments to the email.
	 *
	 * @return bool
	 */
	public function send( $to, $subject, $message, $attachments = array() ) {

		quillforms_get_logger()->debug( 'Sending an email', compact( 'to', 'subject', 'message', 'attachments' ) );

		// if ( ! did_action( 'init' ) && ! did_action( 'admin_init' ) ) {
		// 	quillforms_get_logger()->debug( 'Wrong config', array(
		// 		"code" => "wrong-config"
		// 	) );
		// 	_doing_it_wrong( __FUNCTION__, esc_html__( 'You cannot send emails with Emails() until init/admin_init has been reached.', 'quillforms' ), null );

		// 	return false;
		// }

		// Don't send anything if emails have been disabled.
		if ( $this->is_email_disabled() ) {
			quillforms_get_logger()->debug( 'Disabled email', array(
				"code" => "disabled-email"
			) );
			return false;
		}

		// Don't send if email address is invalid.
		if ( ! is_email( $to ) ) {
			quillforms_get_logger()->debug( 'Incorrect email', array(
				"code" => "wrong-email"
			) );

			return false;
		}

		quillforms_get_logger()->debug( 'Pre sending email', array(
			"code" => "pre-sending-email"
		) );
		// Hooks before email is sent.
		do_action( 'quillforms_email_send_before', $this );

		/*
		 * Allow to filter data on per-email basis,
		 * useful for localizations based on recipient email address, form settings,
		 * or for specific notifications - whatever available in Emails class.
		 */
		$data = apply_filters(
			'quillforms_emails_send_email_data',
			array(
				'to'          => $to,
				'subject'     => $subject,
				'message'     => $message,
				'headers'     => $this->get_headers(),
				'attachments' => $attachments,
			),
			$this
		);


		quillforms_get_logger()->debug( 'Email data', compact( 'data' ) );

		// Prepare subject and message.
		$prepared_subject = $this->get_prepared_subject( $data['subject'] );
		$prepared_message = $this->build_email( $data['message'] );

		quillforms_get_logger()->debug( 'Prepared email data', compact( 'prepared_subject', 'prepared_message' ) );

		$on_mail_error = function( $wp_error ) {
			quillforms_get_logger()->debug( 'Email error', compact( 'wp_error' ) );
		};
		add_action( 'wp_mail_failed', $on_mail_error );

		// Let's do this NOW.
		$result = wp_mail(
			$data['to'],
			$prepared_subject,
			$prepared_message,
			$data['headers'],
			$data['attachments']
		);

		remove_action( 'wp_mail_failed', $on_mail_error );

		quillforms_get_logger()->debug( 'Email result', compact( 'result' ) );

		// Hooks after the email is sent.
		do_action( 'quillforms_email_send_after', $this );

		return $result;
	}

	/**
	 * Add filters/actions before the email is sent.
	 *
	 * @since 1.0.0
	 */
	public function send_before() {

		add_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );
		add_filter( 'wp_mail_from_name', array( $this, 'get_from_name' ) );
		add_filter( 'wp_mail_content_type', array( $this, 'get_content_type' ) );
	}

	/**
	 * Remove filters/actions after the email is sent.
	 *
	 * @since 1.0.0
	 */
	public function send_after() {

		remove_filter( 'wp_mail_from', array( $this, 'get_from_address' ) );
		remove_filter( 'wp_mail_from_name', array( $this, 'get_from_name' ) );
		remove_filter( 'wp_mail_content_type', array( $this, 'get_content_type' ) );
	}

	/**
	 * Convert text formatted HTML. This is primarily for turning line breaks
	 * into <p> and <br/> tags.
	 *
	 * @since 1.0.0
	 *
	 * @param string $message Text to convert.
	 *
	 * @return string
	 */
	public function text_to_html( $message ) {

		if ( 'text/html' === $this->content_type || true === $this->html ) {
			$message = wpautop( $message );
		}

		return $message;
	}

	/**
	 * Process a smart tag.
	 * Decodes entities and sanitized (keeping line breaks) by default.
	 *
	 * @uses quillforms_decode_string()
	 *
	 * @since 1.0.0
	 *
	 * @param string $string String that may contain tags.
	 *
	 * @return string
	 */
	public function process_tag( $string = '' ) {

		return Merge_Tags::instance()->process_text( $string, $this->entry, $this->form_data );
	}

	/**
	 * Process the all fields merge tag if present.
	 *
	 * @since 1.0.0
	 *
	 * @param bool $is_html_email Toggle to use HTML or plaintext.
	 *
	 * @return string
	 */
	public function html_field_value( $is_html_email = true ) { // phpcs:ignore

		if ( empty( $this->entry->records['fields'] ) ) {
			return '';
		}

		if ( empty( $this->form_data['blocks'] ) ) {
			$is_html_email = false;
		}

		$message = '';

		if ( $is_html_email ) {
			/*
			 * HTML emails.
			 */
			ob_start();

			// Hooks into the email field.
			do_action( 'quillforms_email_field', $this );

			$this->get_template_part( 'field', $this->get_template(), true );

			$field_template = ob_get_clean();

			$x = 1;

			foreach ( Core::get_blocks_recursively( $this->form_data['blocks'] ) as $block ) {

				$block_type  = Blocks_Manager::instance()->create( $block );
				$field_label = '';
				$field_val   = '';

				if ( ! isset( $this->entry->records['fields'][ $block['id'] ] ) || '' === (string) $this->entry->records['fields'][ $block['id'] ] ) {
						continue;
				}

				$field_label = $block['attributes']['label'];
				$field_val   = empty( $this->entry->records['fields'][ $block['id'] ]['value'] ) ? '<em>' . esc_html__( '(empty)', 'quillforms' ) . '</em>' : $block_type->get_readable_value( $this->entry->records['fields'][ $block['id'] ]['value'], $this->form_data );

				if ( empty( $field_label ) && null !== $field_label ) {
					$field_label = sprintf( /* translators: %d - field ID. */
						esc_html__( 'Field ID #%s', 'quillforms' ),
						$block['id']
					);
				}

				$field_item = $field_template;

				if ( 1 === $x ) {
					$field_item = str_replace( 'border-top:1px solid #dddddd;', '', $field_item );
				}
				$field_item = str_replace( '{field_label}', $field_label, $field_item );
				$field_item = str_replace(
					'{field_value}',
					$field_val,
					$field_item
				);

				$message .= wpautop( $field_item );

				$x ++;
			}
		} else {
			/*
			 * Plain Text emails.
			 */
			foreach ( Core::get_blocks_recursively( $this->form_data['blocks'] ) as $block ) {

				$block_type  = Blocks_Manager::instance()->create( $block );
				$field_label = '';
				$field_val   = '';

				if ( ! isset( $this->entry->records['fields'][ $block['id'] ] ) || '' === (string) $this->entry->records['fields'][ $block['id'] ] ) {
					continue;
				}

				$field_label = $block['attributes']['label'];
				$field_val   = empty( $this->entry->records['fields'][ $block['id'] ]['value'] ) ? esc_html__( '(empty)', 'quillforms' ) : $block_type->get_readable_value( $this->entry->records['fields'][ $block['id'] ]['value'], $this->form_data );

				if ( empty( $field_label ) ) {
					$field_label = sprintf( /* translators: %d - field ID. */
						esc_html__( 'Field ID #%s', 'quillforms' ),
						esc_attr( $block['id'] )
					);
				}

				$message    .= '--- ' . $field_label . " ---\r\n\r\n";
				$field_value = $field_val . "\r\n\r\n";
				$message    .= $field_value;
			}
		}

		if ( empty( $message ) ) {
			$empty_message = esc_html__( 'An empty form was submitted.', 'quillforms' );
			$message       = $is_html_email ? wpautop( $empty_message ) : $empty_message;
		}

		return $message;
	}

	/**
	 * Email kill switch if needed.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function is_email_disabled() {

		return (bool) apply_filters( 'quillforms_disable_all_emails', false, $this );
	}

	/**
	 * Get the enabled email template.
	 *
	 * @since 1.0.0
	 *
	 * @return string When filtering return 'none' to switch to text/plain email.
	 */
	public function get_template() {

		if ( ! $this->template ) {
			$this->template = Settings::get( 'email-template', 'default' );
		}

		return apply_filters( 'quillforms_email_template', $this->template );
	}

	/**
	 * Retrieve a template part. Taken from bbPress.
	 *
	 * @since 1.0.0
	 *
	 * @param string $slug Template file slug.
	 * @param string $name Optional. Default null.
	 * @param bool   $load Maybe load.
	 *
	 * @return string
	 */
	public function get_template_part( $slug, $name = null, $load = true ) {

		// Setup possible parts.
		$templates = array();
		if ( isset( $name ) ) {
			$templates[] = $slug . '-' . $name . '.php';
		}
		$templates[] = $slug . '.php';

		// Return the part that is found.
		return $this->locate_template( $templates, $load, false );
	}

	/**
	 * Retrieve the name of the highest priority template file that exists.
	 *
	 * Search in the STYLESHEETPATH before TEMPLATEPATH so that themes which
	 * inherit from a parent theme can just overload one file. If the template is
	 * not found in either of those, it looks in the theme-compat folder last.
	 *
	 * Taken from bbPress.
	 *
	 * @since 1.0.0
	 *
	 * @param string|array $template_names Template file(s) to search for, in order.
	 * @param bool         $load           If true the template file will be loaded if it is found.
	 * @param bool         $require_once   Whether to require_once or require. Default true.
	 *                                     Has no effect if $load is false.
	 *
	 * @return string The template filename if one is located.
	 */
	public function locate_template( $template_names, $load = false, $require_once = true ) {

		// No file found yet.
		$located = false;

		// Try to find a template file.
		foreach ( (array) $template_names as $template_name ) {

			// Continue if template is empty.
			if ( empty( $template_name ) ) {
				continue;
			}

			// Trim off any slashes from the template name.
			$template_name = ltrim( $template_name, '/' );

			// Try locating this template file by looping through the template paths.
			foreach ( $this->get_theme_template_paths() as $template_path ) {
				if ( file_exists( $template_path . $template_name ) ) {
					$located = $template_path . $template_name;
					break;
				}
			}
		}

		if ( ( true === $load ) && ! empty( $located ) ) {
			load_template( $located, $require_once );
		}

		return $located;
	}

	/**
	 * Return a list of paths to check for template locations
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_theme_template_paths() {

		$template_dir = 'quillforms-email';

		$file_paths = array(
			1   => trailingslashit( get_stylesheet_directory() ) . $template_dir,
			10  => trailingslashit( get_template_directory() ) . $template_dir,
			100 => QUILLFORMS_PLUGIN_DIR . 'includes/emails/templates',
		);

		$file_paths = apply_filters( 'quillforms_email_template_paths', $file_paths );

		// Sort the file paths based on priority.
		ksort( $file_paths, SORT_NUMERIC );

		return array_map( 'trailingslashit', $file_paths );
	}

	/**
	 * Perform email subject preparation: process tags, remove new lines, etc.
	 *
	 * @since 1.0.0
	 *
	 * @param string $subject Email subject to post-process.
	 *
	 * @return string
	 */
	private function get_prepared_subject( $subject ) {

		$subject = $this->process_tag( $subject );

		$subject = trim( str_replace( array( "\r\n", "\r", "\n" ), ' ', $subject ) );

		return quillforms_decode_string( $subject );
	}
}
