<?php
/**
 * Metafields: class QF_Messages_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

$messages_data = json_decode(
	file_get_contents(
		QF_PLUGIN_DIR . 'includes/json/messages.json'
	),
	true
);

register_rest_field(
	'quill_forms',
	'messages',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			$value = get_post_meta( $form_id, 'messages', true );
			$value = $value ? $value : array();

			return $value;
		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = get_post_meta( $form_id, 'messages', true );
			if ( $prev_value === $meta ) {
				return true;
			}
			$ret = update_post_meta(
				$form_id,
				'messages',
				$meta
			);
			if ( false === $ret ) {
				return new WP_Error(
					'qf_messages_update_failed',
					__( 'Failed to update blocks.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}
				return true;
		},
		'schema'          => array(
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
							if ( ! empty( $messages[ $key ] ) ) {
								if ( ! empty( $message['allowedFormats'] ) ) {
									$allowed_formats = array();
									if ( in_array( 'bold', $message['allowedFormats'], true ) ) {
										$allowed_formats['strong'] = array();
									}
									if ( in_array( 'italic', $message['allowedFormats'], true ) ) {
										$allowed_formats['em'] = array();
									}
									if ( in_array( 'link', $message['allowedFormats'], true ) ) {
										$allowed_formats['a'] = array(
											'href'  => array(),
											'title' => array(),
										);
									}

									$messages[ $key ] = wp_kses(
										$messages[ $key ],
										$allowed_formats
									);
								} else {
									$messages[ $key ] = sanitize_text_field( $messages[ $key ] );
								}
							} else {
								$messages[ $key ] = $message['default'] ? $message['default'] : '';
							}
						}
					}
					return $messages;
				},

			),
		),
	)
);
