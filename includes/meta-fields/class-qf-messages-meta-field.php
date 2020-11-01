<?php
/**
 * Metafields: class QF_Messages_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Messages_Meta_Field
 *
 * @since 1.0.0
 */
class QF_Messages_Meta_Field extends QF_Meta_Field {

	/**
	 * Get slug
	 *
	 * @since 1.0.0
	 */
	public function get_slug() {
		return 'messages';
	}

	/**
	 * Get field value
	 *
	 * @since 1.0.0
	 * @param array $object Form object.
	 *
	 * @return mixed The value
	 */
	public function get_value( $object ) {
		$form_id = $object['id'];

		$value = qf_decode( get_post_meta( $form_id, $this->get_slug(), true ) );
		$value = $value ? $value : array();

		return  $this->prepare_messages_for_render( $value );
	}

	/**
	 * Get messages categories
	 *
	 * @since 1.0.0
	 *
	 * @return array Messages categories
	 */
	public function get_messages_categories() {
		return array(
			'buttons-hints-placeholders' => __( 'Buttons, hints and placeholders', 'quillforms' ),
			'alertes'                    => __( 'Alerts', 'quillforms' ),
			'other'                      => __( 'Others', 'quillforms' ),
		);
	}

	/**
	 * Get messages data
	 *
	 * @since 1.0.0
	 *
	 * @return array Message array
	 */
	public function get_messages_data() {
		return apply_filters(
			'quillforms_messages_data',
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
	 * Get schema
	 * The schema term is pretty much like the schema in WordPress REST api.
	 *
	 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/schema
	 * @since 1.0.0
	 *
	 * @return array The schema
	 */
	public function get_schema() {
		$messages_data = $this->get_messages_data();
		return array(
			'type'        => 'object',
			'properties'  => array_walk(
				$messages_data,
				function( &$a ) {
					$a['type'] = 'string';
				}
			),
			'arg_options' => array(
				'sanitize_callback' => function( $messages ) use ( $messages_data ) {
					if ( ! empty( $messages ) ) {
						foreach ( $messages_data as $key => $message ) {
							if ( ! empty( $message ) &&
							! empty( $message['format'] ) &&
							'html' === $message['format'] ) {
								$messages[ $key ] = wp_kses(
									$messages[ $key ],
									array(
										'em'     => array(),
										'strong' => array(),
									)
								);
							} else {
								$messages[ $key ] = sanitize_textarea_field( $messages[ $key ] );
							}
						}
					}
					return $messages;
				},
			),
		);
	}

	/**
	 * Prepare messages for render.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @param array $messages Optional. original messages data.
	 *
	 * @return array The messages to render.
	 */
	private function prepare_messages_for_render( $messages = array() ) {
		$messages_data_schema = $this->get_messages_data();

		if ( ! isset( $messages_data_schema ) ) {
			return $messages;
		}

		foreach ( $messages as $key => $value ) {
			// If the message is not defined, it cannot be validated.
			if ( ! isset( $messages_data_schema[ $key ] ) ) {
				continue;
			}

			// Validate value by JSON schema. An invalid value should revert to
			// its default, if one exists. This occurs by virtue of the missing
			// attributes loop immediately following. If there is not a default
			// assigned, the attribute value should remain unset.
			$is_valid = rest_validate_value_from_schema( $value, array( 'type' => 'string' ) );
			if ( is_wp_error( $is_valid ) ) {
				unset( $messages[ $key ] );
			}

			if ( $messages_data_schema[ $key ]['format'] && 'html' === $messages_data_schema[ $key ]['format'] ) {
				$messages[ $key ] = wp_kses(
					$value,
					array(
						'strong' => array(),
						'em'     => array(),
					)
				);
			} else {
				// if format not set or its format is plain text.
				$messages[ $key ] = esc_html( $value );
			}
		}

		// Populate values of any missing data for which the message defines a default.
		$missing_data = array_diff_key( $messages_data_schema, $messages );
		foreach ( $missing_data as  $key => $message ) {
			if ( isset( $message['default'] ) ) {
				$messages[ $key ] = $message['default'];
			}
		}

		return $messages;
	}
}

QF_Meta_Fields::get_instance()->register( new QF_Messages_Meta_Field() );
