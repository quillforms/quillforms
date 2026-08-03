<?php
/**
 * Honeypot: class Honeypot
 *
 * Spam trap for form submissions.
 *
 * The honeypot block is appended to every form's block list on the server, but is
 * stripped from the form object before it is sent to the browser. A genuine
 * visitor therefore never sees it and cannot submit an answer for it. A
 * submission that carries an answer for the honeypot block did not originate from
 * the rendered form, and is rejected before anything is saved.
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
	 * Block name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'honeypot';

	/**
	 * Block id used for the injected honeypot block.
	 *
	 * Kept deliberately generic so it resembles an ordinary field id.
	 *
	 * @var string
	 */
	const BLOCK_ID = 'field_email_confirm';

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
		// Inject into the server side form data, so the block is part of the form
		// during submission processing.
		add_filter( 'quillforms_form_data', array( $this, 'inject_block' ), 10, 1 );

		// Strip from the payload sent to the browser, so it is never rendered.
		add_filter( 'quillforms_renderer_form_object', array( $this, 'strip_block' ), 10, 1 );

		// Reject submissions that carry an answer for the honeypot block.
		add_filter( 'quillforms_submission_init_errors', array( $this, 'check_submission' ), 10, 2 );

		// Print the decoy input into the form page and forward its value on submit.
		add_action( 'wp_footer', array( $this, 'render_trap_field' ) );
	}

	/**
	 * Output the decoy input and forward its value with the submission.
	 *
	 * A real, focusable <input> is printed into the page so that a bot which parses
	 * the HTML finds it and fills it in. It is hidden from human visitors, kept out
	 * of the tab order, and told not to autofill so a browser password manager
	 * never populates it on a real user's behalf.
	 *
	 * The value is forwarded through the QuillForms.Renderer.SubmissionFormData JS
	 * filter, which is the last hook before the payload is sent, so the field
	 * travels as an ordinary answer and is checked by check_submission().
	 */
	public function render_trap_field() {
		if ( ! $this->is_enabled() || ! is_singular( 'quill_forms' ) ) {
			return;
		}

		$field_id = self::BLOCK_ID;
		?>
		<div class="qf-field-confirm-wrap" aria-hidden="true">
			<label for="<?php echo esc_attr( $field_id ); ?>">
				<?php esc_html_e( 'Leave this field empty', 'quillforms' ); ?>
			</label>
			<input
				type="text"
				id="<?php echo esc_attr( $field_id ); ?>"
				name="<?php echo esc_attr( $field_id ); ?>"
				value=""
				tabindex="-1"
				readonly
				autocomplete="new-password"
				data-lpignore="true"
				data-1p-ignore="true"
				data-form-type="other"
			/>
		</div>
		<style>
			/* Positioned off-screen rather than display:none, since some bots skip
			   fields that are explicitly hidden. */
			.qf-field-confirm-wrap {
				position: absolute !important;
				left: -9999px !important;
				top: -9999px !important;
				width: 1px !important;
				height: 1px !important;
				overflow: hidden !important;
				opacity: 0 !important;
				pointer-events: none !important;
			}
		</style>
		<script>
			( function () {
				if ( ! window.wp || ! wp.hooks ) {
					return;
				}
				wp.hooks.addFilter(
					'QuillForms.Renderer.SubmissionFormData',
					'quillforms/honeypot',
					function ( formData ) {
						var input = document.getElementById( <?php echo wp_json_encode( $field_id ); ?> );
						// Trim before sending: a browser or password manager may pad or
						// autofill the hidden input even with autocomplete off, and that
						// must not be reported as a trap hit for a real visitor.
						var trapped = input && input.value ? input.value.trim() : '';
						if ( trapped ) {
							formData.answers = formData.answers || {};
							formData.answers[ <?php echo wp_json_encode( $field_id ); ?> ] = {
								value: trapped
							};
						}
						return formData;
					}
				);
			} )();
		</script>
		<?php
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
	 * Append the honeypot block to the form data blocks.
	 *
	 * @param array $form_data Form data.
	 * @return array
	 */
	public function inject_block( $form_data ) {
		if ( ! $this->is_enabled() || ! isset( $form_data['blocks'] ) || ! is_array( $form_data['blocks'] ) ) {
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
	 * The renderer builds its block list from Core::get_blocks() rather than
	 * Core::get_form_data(), so the injected block would not normally appear here.
	 * This runs regardless, so the block can never reach the browser even if a
	 * saved form contains one.
	 *
	 * @param array $form_object Form object.
	 * @return array
	 */
	public function strip_block( $form_object ) {
		if ( ! isset( $form_object['blocks'] ) || ! is_array( $form_object['blocks'] ) ) {
			return $form_object;
		}

		$form_object['blocks'] = array_values(
			array_filter(
				$form_object['blocks'],
				function( $block ) {
					return self::BLOCK_NAME !== ( $block['name'] ?? '' );
				}
			)
		);

		return $form_object;
	}

	/**
	 * Reject submissions that answered the honeypot block.
	 *
	 * Runs on quillforms_submission_init_errors, which fires before the form data
	 * is loaded, the entry is created, or anything is written to the database,
	 * emailed or charged.
	 *
	 * The answer is read from the raw submission payload because the honeypot
	 * block declares editable => false, which means its value is never copied into
	 * the entry object.
	 *
	 * @param array $errors            Errors collected so far.
	 * @param array $unsanitized_entry Raw submission payload.
	 * @return array
	 */
	public function check_submission( $errors, $unsanitized_entry ) {
		if ( ! empty( $errors ) || ! $this->is_enabled() ) {
			return $errors;
		}

		$answers = $unsanitized_entry['answers'] ?? array();

		if ( ! isset( $answers[ self::BLOCK_ID ] ) ) {
			return $errors;
		}

		$value = $answers[ self::BLOCK_ID ]['value'] ?? null;

		// Only a non-empty value counts as a trap hit.
		//
		// Whitespace is trimmed first: browsers and password managers sometimes
		// populate or pad hidden inputs despite autocomplete="off", and a stray
		// space from a real visitor must not be treated as spam.
		if ( ! \is_scalar( $value ) || '' === \trim( (string) $value ) ) {
			return $errors;
		}

		quillforms_get_logger()->notice(
			esc_html__( 'Honeypot triggered, submission rejected.', 'quillforms' ),
			array(
				'code'    => 'honeypot_triggered',
				'form_id' => $unsanitized_entry['formId'] ?? null,
				'ip'      => $_SERVER['REMOTE_ADDR'] ?? null,
			)
		);

		// Generic message: never reveal which check rejected the submission.
		$errors['form'] = esc_html__( 'Submission rejected.', 'quillforms' );

		return $errors;
	}
}
