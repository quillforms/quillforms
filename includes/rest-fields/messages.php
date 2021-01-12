<?php
/**
 * Metafields: class QF_Messages_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

$messages_data = QF_Form_Messages::get_messages_data();

register_rest_field(
	'quill_forms',
	'messages',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			$value = maybe_unserialize( get_post_meta( $form_id, 'messages', true ) );
			$value = $value ? $value : array();

			return  QF_Form_Messages::prepare_messages_for_render( $value );
		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = maybe_unserialize( get_post_meta( $form_id, 'messages', true ) );
			if ( $prev_value === $meta ) {
				return true;
			}
			$ret = update_post_meta(
				$form_id,
				'messages',
				maybe_serialize( $meta )
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
		),
	)
);
