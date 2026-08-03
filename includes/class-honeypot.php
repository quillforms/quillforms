<?php
/**
 * Honeypot: class Honeypot
 *
 * Spam protection for form submissions.
 *
 * Three layers run before anything is written to the database, emailed or
 * charged, ordered cheapest and most decisive first:
 *
 *  1. Nonce      - rejects blind POSTs to admin-ajax.php that never loaded the
 *                  form page.
 *  2. Honeypot   - a decoy field injected by JavaScript after page load. Bots
 *                  that fill every input they find are rejected.
 *  3. Rate limit - caps submission volume per IP address.
 *
 * All rejections use a generic message so a bot author cannot tell which layer
 * rejected the submission.
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms;

defined( 'ABSPATH' ) || exit;

/**
 * Honeypot class
 *
 * @since 1.0.0
 */
class Honeypot {

	/**
	 * Honeypot block name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'honeypot';

	/**
	 * Block id used for the injected honeypot block.
	 *
	 * This is the secondary trap: the block is stripped from the renderer payload,
	 * so a genuine visitor can never submit an answer for it.
	 *
	 * @var string
	 */
	const BLOCK_ID = 'field_email_confirm';

	/**
	 * Number of submissions allowed per IP within the rate limit window.
	 *
	 * Deliberately generous: offices, schools and mobile carrier NAT share a
	 * single egress IP, so this is a flood cap rather than a precision control.
	 *
	 * @var int
	 */
	const RATE_LIMIT = 10;

	/**
	 * Rate limit window in seconds.
	 *
	 * @var int
	 */
	const RATE_WINDOW = 600;

	/**
	 * Class instance.
	 *
	 * @var Honeypot
	 */
	private static $instance;

	/**
	 * Get class instance.
	 *
	 * @return Honeypot
	 */
	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		// Inject the honeypot block into the server side form data.
		add_filter( 'quillforms_form_data', array( $this, 'inject_block' ), 10, 1 );

		// Strip it from the payload sent to the browser, so it is never rendered.
		add_filter( 'quillforms_renderer_form_object', array( $this, 'strip_block' ), 10, 1 );

		// Run the checks before the submission is processed.
		add_filter( 'quillforms_submission_init_errors', array( $this, 'check_submission' ), 10, 2 );

		// Inject the decoy field and forward its value on submit.
		//
		// Late priority so this prints after the enqueued scripts, otherwise
		// wp.hooks is not defined yet and the field is never built.
		add_action( 'wp_footer', array( $this, 'render_trap_field' ), 9999 );
	}

	/**
	 * Whether the honeypot is enabled.
	 *
	 * @return bool
	 */
	public function is_enabled() {
		return (bool) apply_filters( 'quillforms_honeypot_enabled', true );
	}

	/**
	 * Whether a valid nonce is required for submissions.
	 *
	 * Disabled by default. The nonce gate is the only layer that stops a bot
	 * posting straight to admin-ajax.php without ever loading the form page, so
	 * enable it if spam continues:
	 *
	 *     add_filter( 'quillforms_nonce_required', '__return_true' );
	 *
	 * @return bool
	 */
	public function is_nonce_required() {
		return (bool) apply_filters( 'quillforms_nonce_required', false );
	}

	/**
	 * Get the honeypot field name for a form.
	 *
	 * Derived from a server side secret so the name cannot be distinguished from a
	 * real field by anything that only reads the page. The value is never sent to
	 * the browser as a name a bot could recognise as the trap.
	 *
	 * @param int $form_id Form id.
	 * @return string
	 */
	public static function get_field_name( $form_id ) {
		return 'field_' . \substr( \hash_hmac( 'sha256', 'qf_hp_' . $form_id, \wp_salt( 'nonce' ) ), 0, 16 );
	}

	/**
	 * Resolve the client IP for rate limiting.
	 *
	 * Intentionally does not use quillforms_get_client_ip(): that helper trusts
	 * HTTP_CLIENT_IP and HTTP_X_FORWARDED_FOR ahead of REMOTE_ADDR, so a bot earns
	 * a fresh rate limit bucket per request just by varying a header.
	 *
	 * NOTE: this assumes no reverse proxy in front of the site. If this install
	 * moves behind Cloudflare or another CDN, REMOTE_ADDR becomes the edge IP and
	 * every visitor collapses into one bucket. In that case read the CDN header
	 * (e.g. HTTP_CF_CONNECTING_IP) here instead.
	 *
	 * @return string
	 */
	public function get_ip() {
		$remote_addr = isset( $_SERVER['REMOTE_ADDR'] ) ? wp_unslash( $_SERVER['REMOTE_ADDR'] ) : '';
		$ip          = \filter_var( $remote_addr, FILTER_VALIDATE_IP );

		return $ip ? $ip : '0.0.0.0';
	}

	/**
	 * Append the honeypot block to the form data blocks.
	 *
	 * @param array $form_data Form data.
	 * @return array
	 */
	public function inject_block( $form_data ) {
		if ( ! $this->is_enabled() || ! isset( $form_data['blocks'] ) || ! \is_array( $form_data['blocks'] ) ) {
			return $form_data;
		}

		$form_data['blocks'][] = array(
			'id'         => self::BLOCK_ID,
			'name'       => self::BLOCK_NAME,
			'attributes' => array(),
		);

		return $form_data;
	}

	/**
	 * Remove the honeypot block from the object sent to the renderer.
	 *
	 * @param array $form_object Form object.
	 * @return array
	 */
	public function strip_block( $form_object ) {
		if ( ! isset( $form_object['blocks'] ) || ! \is_array( $form_object['blocks'] ) ) {
			return $form_object;
		}

		$form_object['blocks'] = \array_values(
			\array_filter(
				$form_object['blocks'],
				function( $block ) {
					return self::BLOCK_NAME !== ( $block['name'] ?? '' );
				}
			)
		);

		return $form_object;
	}

	/**
	 * Output the decoy field and forward its value with the submission.
	 *
	 * The input is added by JavaScript after the page has loaded rather than
	 * printed into the server rendered HTML. Browsers and password managers scan
	 * the document at load time, so a field added afterwards is far less likely to
	 * be autofilled, which would otherwise reject genuine visitors.
	 *
	 * The wrapping label is moved off canvas and the input is display:none, so the
	 * field is hidden two independent ways and theme CSS cannot reveal it.
	 */
	public function render_trap_field() {
		if ( ! $this->is_enabled() || ! \is_singular( 'quill_forms' ) ) {
			return;
		}

		$field_name = self::get_field_name( \get_the_ID() );
		$is_rtl     = \is_rtl() ? 'right' : 'left';
		?>
		<script>
			( function () {
				if ( ! window.wp || ! wp.hooks || ! document.body ) {
					return;
				}

				var name = <?php echo wp_json_encode( $field_name ); ?>;

				// Build the decoy field once the page has settled.
				var label = document.createElement( 'label' );
				label.setAttribute( 'for', name );
				label.setAttribute( 'aria-hidden', 'true' );
				label.style.cssText = 'position:absolute !important;<?php echo esc_js( $is_rtl ); ?>:-9999em !important;' +
					'height:0 !important;margin:0 !important;padding:0 !important;overflow:hidden !important;';
				label.textContent = name;

				var input = document.createElement( 'input' );
				input.type = 'text';
				input.id = name;
				input.name = name;
				input.value = '';
				input.tabIndex = -1;
				input.setAttribute( 'autocomplete', 'off' );
				// Keep password managers out. WS Form omits these, which lets a
				// manager populate the trap and reject a real visitor.
				input.setAttribute( 'data-lpignore', 'true' );
				input.setAttribute( 'data-1p-ignore', 'true' );
				input.setAttribute( 'data-form-type', 'other' );
				input.style.cssText = 'display:none !important;';

				label.appendChild( input );
				document.body.appendChild( label );

				wp.hooks.addFilter(
					'QuillForms.Renderer.SubmissionFormData',
					'quillforms/honeypot',
					function ( formData ) {
						var trapped = input.value ? input.value.trim() : '';
						if ( trapped ) {
							formData.answers = formData.answers || {};
							formData.answers[ name ] = { value: trapped };
						}
						return formData;
					}
				);
			} )();
		</script>
		<?php
	}

	/**
	 * Run the spam checks before the submission is processed.
	 *
	 * quillforms_submission_init_errors fires in Form_Submission::process_submission()
	 * before the form data is loaded, the entry is created, or anything is written
	 * to the database, emailed or charged. Returning a non-empty errors array
	 * aborts the submission cleanly.
	 *
	 * @param array $errors            Errors collected so far.
	 * @param array $unsanitized_entry Raw submission payload.
	 * @return array
	 */
	public function check_submission( $errors, $unsanitized_entry ) {
		if ( ! empty( $errors ) ) {
			return $errors;
		}

		$form_id = $unsanitized_entry['formId'] ?? null;

		// 1. Nonce.
		//
		// Read from $_POST, not from the decoded payload: render.js appends
		// 'quillforms_nonce' as its own form field, while QuillForms core reads it
		// from inside the JSON, where it never appears. That mismatch is why core's
		// quillforms_renderer_nonce_verify filter is left at its default false --
		// enabling it would reject every legitimate submission.
		if ( $this->is_nonce_required() ) {
			$nonce = isset( $_POST['quillforms_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['quillforms_nonce'] ) ) : '';

			if ( ! wp_verify_nonce( $nonce, 'quillforms-renderer' ) ) {
				$this->log_rejection( 'nonce_invalid', $form_id );
				$errors['form'] = esc_html__( 'Could not verify your submission. Please reload the page and try again.', 'quillforms' );

				return $errors;
			}
		}

		// 2. Honeypot.
		if ( $this->is_enabled() ) {
			$answers = $unsanitized_entry['answers'] ?? array();

			// The decoy field, and the block id as a secondary trap.
			$trap_keys = array( self::get_field_name( $form_id ), self::BLOCK_ID );

			foreach ( $trap_keys as $trap_key ) {
				if ( ! isset( $answers[ $trap_key ] ) ) {
					continue;
				}

				$value = $answers[ $trap_key ]['value'] ?? null;

				// Whitespace is trimmed first so a stray space from a real visitor
				// is not treated as spam.
				if ( ! \is_scalar( $value ) || '' === \trim( (string) $value ) ) {
					continue;
				}

				$this->log_rejection( 'honeypot_triggered', $form_id );
				$errors['form'] = esc_html__( 'Submission rejected.', 'quillforms' );

				return $errors;
			}
		}

		// 3. Rate limit.
		$key  = 'qf_rl_' . md5( $this->get_ip() );
		$hits = (int) get_transient( $key );

		if ( $hits >= self::RATE_LIMIT ) {
			$this->log_rejection( 'rate_limited', $form_id );
			$errors['form'] = esc_html__( 'Too many submissions. Please try again later.', 'quillforms' );

			return $errors;
		}

		set_transient( $key, $hits + 1, self::RATE_WINDOW );

		return $errors;
	}

	/**
	 * Log a rejected submission.
	 *
	 * @param string   $code    Reason code.
	 * @param int|null $form_id Form id.
	 */
	private function log_rejection( $code, $form_id ) {
		quillforms_get_logger()->notice(
			esc_html__( 'Submission rejected by spam protection.', 'quillforms' ),
			array(
				'code'    => $code,
				'form_id' => $form_id,
				'ip'      => $this->get_ip(),
			)
		);
	}
}
