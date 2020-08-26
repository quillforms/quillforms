<?php
/**
 * Messages API: class QF_Messages
 *
 * @package QuillForms
 * @since 1.0.0
 */

/**
 * Quill forms messages.
 *
 * Quill forms messages handler class is responsible for defining default messages
 *
 * @since 1.0.0
 */
class QF_Form_Messages {

	/**
	 * Container for the main instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @var QF_Form_Messages|null
	 */
	private static $instance = null;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->messages = $this->get_default_messages();
	}

	/**
	 * Get default messages.
	 *
	 * @since 1.0.0
	 *
	 * @return array The default messages.
	 */
	public function get_default_messages() {
		return apply_filters(
			'quillforms_default_messages',
			array(
				// Buttons, Hints and Placeholder.
				'label.button.ok'                    => array(
					'title'    => __( 'Button to confirm answer', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>OK</p>',
					'category' => 'buttons-hints-placeholders',
				),
				'label.hintText.enter'               => array(
					'title'    => __( 'Keyboard hint text for navigating to next question', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>press <strong>Enter ↵</strong></p>',
					'category' => 'buttons-hints-placeholders',
				),
				'label.hintText.multipleSelection'   => array(
					'title'    => __( 'Hint for multiple selection', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Choose as many as you like</p>',
					'category' => 'buttons-hints-placeholders',
				),
				'block.dropdown.placeholder'         => array(
					'title'    => __( 'Placeholder for dropdown', 'quillforms' ),
					'default'  => 'Please format or select an option',
					'category' => 'buttons-hints-placeholders',
				),
				'block.dropdown.placeholderTouch'    => array(
					'title'    => __( 'Placeholder for dropdown on touch screens', 'quillforms' ),
					'default'  => 'Please select an option',
					'category' => 'buttons-hints-placeholders',
				),
				'block.dropdown.noSuggestions'       => array(
					'title'    => __( 'No suggestions hint for dropdown', 'quillforms' ),
					'default'  => 'No Suggestions',
					'category' => 'buttons-hints-placeholders',
				),
				'block.shortText.placeholder'        => array(
					'title'    => __( 'Placeholder for short text input', 'quillforms' ),
					'default'  => 'Please format your answer here',
					'category' => 'buttons-hints-placeholders',
				),
				'block.longText.placeholder'         => array(
					'title'    => __( 'Placeholder for long text input', 'quillforms' ),
					'default'  => 'Please format your answer here',
					'category' => 'buttons-hints-placeholders',
				),
				'block.longText.hint'                => array(
					'title'    => __( 'Hint for line break in Long Text fields', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p><strong>Shift ⇧ + Enter ↵</strong> to make a line break</p>',
					'category' => 'buttons-hints-placeholders',
				),
				'block.number.placeholder'           => array(
					'title'    => __( 'Placeholder for number input', 'quillforms' ),
					'default'  => 'Please format your answer here',
					'category' => 'buttons-hints-placeholders',
				),
				'label.hintText.key'                 => array(
					'title'    => __( 'Keyboard hint after hovering over options', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Key</p>',
					'category' => 'buttons-hints-placeholders',
				),
				'label.yes.default'                  => array(
					'title'    => __( 'Button to say "Yes"', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Yes</p>',
					'category' => 'buttons-hints-placeholders',
				),
				'label.no.default'                   => array(
					'title'    => __( 'Button to say "No"', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>No</p>',
					'category' => 'buttons-hints-placeholders',
				),
				'label.progress.percent'             => array(
					'title'     => __( 'Percentage of form completed', 'quillforms' ),
					'format'    => 'html',
					'variables' => array(
						array(
							'title'   => 'percent',
							'varType' => 'progress',
							'ref'     => 'percent',
						),
					),
					'default'   => '<p>{{progress:percent}}% completed</p>',
					'category'  => 'buttons-hints-placeholders',
				),
				'label.button.yes'                   => array(
					'title'    => __( 'Button to say "Yes"', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Yes</p>',
					'category' => 'buttons-hints-placeholders',
				),

				// Alert Messages.
				'label.errorAlert.required'          => array(
					'title'    => __( 'If field is required', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>This field is required!</p>',
					'category' => 'alerts',
				),
				'label.errorAlert.date'              => array(
					'title'    => __( 'If date is invalid', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Invalid date!</p>',
					'category' => 'alerts',
				),
				'label.errorAlert.selectionRequired' => array(
					'title'    => __( 'If answer needs at least one selection', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Please make at least one selection!</p>',
					'category' => 'alerts',
				),
				'label.errorAlert.email'             => array(
					'title'    => __( 'If email address is wrong', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Invalid email!</p>',
					'category' => 'alerts',
				),
				'label.errorAlert.url'               => array(
					'title'    => __( 'If url is wrong', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Invalid url!</p>',
					'category' => 'alerts',
				),
				'label.errorAlert.range'             => array(
					'title'     => __( 'If number is out of range', 'quillforms' ),
					'format'    => 'html',
					'variables' => array(
						array(
							'title'   => 'min',
							'varType' => 'attribute',
							'ref'     => 'min',
						),
						array(
							'title'   => 'max',
							'varType' => 'attribute',
							'ref'     => 'max',
						),
					),
					'default'   => '<p>Please enter a number between {{attribute:min}} and {{attribute:max}} </p>',
					'category'  => 'alerts',
				),
				'label.errorAlert.minNum'            => array(
					'title'     => __( 'If number is lower than minimum value', 'quillforms' ),
					'format'    => 'html',
					'variables' => array(
						array(
							'title'   => 'min',
							'varType' => 'attribute',
							'ref'     => 'min',
						),
					),
					'default'   => '<p>Please enter a number greater than {{attribute:min}}</p>',
					'category'  => 'alerts',
				),
				'label.errorAlert.maxNum'            => array(
					'title'     => __( 'If number is higher than maximum value', 'quillforms' ),
					'format'    => 'html',
					'variables' => array(
						array(
							'title'   => 'max',
							'varType' => 'attribute',
							'ref'     => 'max',
						),
					),
					'default'   => '<p>Please enter a number lower than {{attribute:max}} </p>',
					'category'  => 'alerts',
				),
				'label.errorAlert.maxCharacters'     => array(
					'title'     => __( 'If characters number is higher than maximum value', 'quillforms' ),
					'format'    => 'html',
					'variables' => array(
						array(
							'title'   => 'maxCharacters',
							'varType' => 'attribute',
							'ref'     => 'maxCharacters',
						),
					),
					'default'   => '<p>Maximum characters reached!</p>',
					'category'  => 'alerts',
				),
				'label.errorAlert.url'               => array(
					'title'    => __( 'If the website url is invalid', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Invalid url!</p>',
					'category' => 'alerts',
				),
				'label.successAlert.submission'      => array(
					'title'    => __( 'Form submission success message', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Form has been submitted successfully!</p>',
					'category' => 'alerts',
				),
				'label.errorAlert.noConnection'      => array(
					'title'    => __( 'Error for no connection with server', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Can\'t connect to the server right now!</p>',
					'category' => 'alerts',
				),
				'label.errorAlert.serverError'       => array(
					'title'    => __( 'Error for a problem with server', 'quillforms' ),
					'format'   => 'html',
					'default'  => '<p>Server error!</p>',
					'category' => 'alerts',
				),
			)
		);

	}

	/**
	 * Prepare messages for render.
	 *
	 * @since 1.0.0
	 *
	 * @param array $messages Optional. original messages data.
	 *
	 * @return array The messages to render.
	 */
	public function prepare_messages_for_render( $messages = array() ) {

		if ( ! isset( $this->messages ) ) {
			return $messages;
		}

		foreach ( $messages as $key => $value ) {
			// If the message is not defined, it cannot be validated.
			if ( ! isset( $this->messages[ $key ] ) ) {
				continue;
			}

			// Validate value by JSON schema. An invalid value should revert to
			// its default, if one exists. This occurs by virtue of the missing
			// attributes loop immediately following. If there is not a default
			// assigned, the attribute value should remain unset.
			$is_valid = rest_validate_value_from_schema( $value, array( 'format' => 'string' ) );
			if ( is_wp_error( $is_valid ) ) {
				unset( $messages[ $key ] );
			}

			// If message format is rich text, then autop it.
			if ( $this->messages[ $key ]['format'] && 'html' === $this->messages[ $key ] ) {
				$messages[ $key ] = wpautop( $value );
			} else {
				// if format not set or its format is plain text.
				$messages[ $key ] = esc_html( $value );
			}
		}

		// Populate values of any missing data for which the message defines a default.
		$missing_data = array_diff_key( $this->messages, $messages );
		foreach ( $missing_data as  $key => $message ) {
			if ( isset( $message['default'] ) ) {
				$messages[ $key ] = $message['default'];
			}
		}

		return $messages;
	}

	/**
	 * Utility method to retrieve the main instance of the class.
	 *
	 * The instance will be created if it does not exist yet.
	 *
	 * @since 1.0.0
	 *
	 * @return QF_Form_Messages the main instance
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}
