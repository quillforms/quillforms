<?php
/**
 * Client Messages: class Client_Messages
 *
 * @since 1.5.0
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Client_Messages Class
 *
 * @since 1.5.0
 */
class Client_Messages {

	/**
	 * Get messages
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	public static function get_messages() {
		return array_merge( self::get_default_messages(), self::get_custom_messages() );
	}

	/**
	 * Get custom messages
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	public static function get_custom_messages() {
		return apply_filters( 'quillforms_client_custom_messages', array() );
	}

	/**
	 * Get default messages
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	public static function get_default_messages() {
		$messages = array(
			'label.button.ok'                    => array(
				'title'          => __( 'Button to confirm answer', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'OK', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'label.hintText.enter'               => array(
				'title'          => __( 'Keyboard hint text for navigating to next question', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'press <strong>Enter ↵</strong>', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'label.hintText.multipleSelection'   => array(
				'title'          => __( 'Hint for multiple selection', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Choose as many as you like', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'block.dropdown.placeholder'         => array(
				'title'    => __( 'Placeholder for dropdown', 'quillforms' ),
				'default'  => __( 'Type or select an option', 'quillforms' ),
				'category' => 'buttons-hints-placeholders',
			),
			'block.dropdown.noSuggestions'       => array(
				'title'          => __( 'No suggestions hint for dropdown', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'No Suggestions!', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'block.shortText.placeholder'        => array(
				'title'    => __( 'Placeholder for short text input', 'quillforms' ),
				'default'  => __( 'Type your answer here', 'quillforms' ),
				'category' => 'buttons-hints-placeholders',
			),
			'block.longText.placeholder'         => array(
				'title'    => __( 'Placeholder for long text input', 'quillforms' ),
				'default'  => __( 'Type your answer here', 'quillforms' ),
				'category' => 'buttons-hints-placeholders',
			),
			'block.longText.hint'                => array(
				'title'          => __( 'Hint for line break in Long Text fields', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( '<strong>Shift ⇧ + Enter ↵</strong> to make a line break', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'block.number.placeholder'           => array(
				'title'    => __( 'Placeholder for number input', 'quillforms' ),
				'default'  => __( 'Type your answer here', 'quillforms' ),
				'category' => 'buttons-hints-placeholders',
			),
			'block.email.placeholder'            => array(
				'title'    => __( 'Placeholder for email input', 'quillforms' ),
				'default'  => __( 'Type your email here', 'quillforms' ),
				'category' => 'buttons-hints-placeholders',
			),
			'block.defaultThankYouScreen.label'  => array(
				'title'          => __( 'Default Thank you screen label', 'quillforms' ),
				'default'        => __( "Thanks for filling this in.\n\n We will contact you soon", 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'label.hintText.key'                 => array(
				'title'          => __( 'Keyboard hint after hovering over options', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Key', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'label.yes.default'                  => array(
				'title'          => __( "Button to say 'Yes'", 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Yes', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'label.no.default'                   => array(
				'title'          => __( "Button to say 'No'", 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'No', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'label.progress.percent'             => array(
				'title'          => __( 'Percentage of form completed', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'mergeTags'      => array(
					array(
						'label'    => __( 'percent', 'quillforms' ),
						'type'     => 'progress',
						'modifier' => 'percent',
					),
				),
				'default'        => __( '{{progress:percent}}% completed', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'label.errorAlert.required'          => array(
				'title'          => __( 'If field is required', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'This field is required!', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.date'              => array(
				'title'          => __( 'If date is invalid', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Invalid date!', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.number'            => array(
				'title'          => __( 'If non numeric value is passed', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Numbers only!', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.selectionRequired' => array(
				'title'          => __( 'If answer needs at least one selection', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Please make at least one selection!', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.email'             => array(
				'title'          => __( 'If email address is wrong', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Invalid email!', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.url'               => array(
				'title'          => __( 'If url is wrong', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Invalid url!', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.range'             => array(
				'title'          => __( 'If number is out of range', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'mergeTags'      => array(
					array(
						'label'    => __( 'min', 'quillforms' ),
						'type'     => 'attribute',
						'modifier' => 'min',
					),
					array(
						'label'    => __( 'max', 'quillforms' ),
						'type'     => 'attribute',
						'modifier' => 'max',
					),
				),
				'default'        => __( 'Please enter a number between {{attribute:min}} and {{attribute:max}}', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.minNum'            => array(
				'title'          => __( 'If number is lower than minimum value', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'mergeTags'      => array(
					array(
						'label'    => __( 'min', 'quillforms' ),
						'type'     => 'attribute',
						'modifier' => 'min',
					),
				),
				'default'        => __( 'Please enter a number greater than {{attribute:min}}', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.maxNum'            => array(
				'title'          => __( 'If number is higher than maximum value', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'mergeTags'      => array(
					array(
						'label'    => __( 'max', 'quillforms' ),
						'type'     => 'attribute',
						'modifier' => 'max',
					),
				),
				'default'        => __( 'Please enter a number lower than {{attribute:max}}', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.maxCharacters'     => array(
				'title'          => __( 'If characters number is higher than maximum value', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'mergeTags'      => array(
					array(
						'label'    => __( 'maxCharacters', 'quillforms' ),
						'type'     => 'attribute',
						'modifier' => 'maxCharacters',
					),
				),
				'default'        => __( 'Maximum characters reached!', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.submitBtn'                    => array(
				'title'          => __( 'Submit button label', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Submit', 'quillforms' ),
				'category'       => 'buttons-hints-placeholders',
			),
			'label.errorAlert.noConnection'      => array(
				'title'          => __( 'Error for no connection with server', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Can"t connect to the server right now!', 'quillforms' ),
				'category'       => 'alerts',
			),
			'label.errorAlert.serverError'       => array(
				'title'          => __( 'Error for a problem with server', 'quillforms' ),
				'allowedFormats' => array( 'bold', 'link', 'italic' ),
				'default'        => __( 'Server error!', 'quillforms' ),
				'category'       => 'alerts',
			),
		);
		return $messages;
	}

}
