<?php
/**
 * Rest Fields: Form Messages
 *
 * @since 1.0.0
 *
 * @package QuillForms
 * @subpackage REST_API
 */

add_action( 'rest_api_init', 'qf_register_messages_rest_field' );

/**
 * Register rest field for form fields
 *
 * @since 1.0.0
 */
function qf_register_messages_rest_field() {
	register_rest_field(
		'quill_forms',
		'messages',
		array(
			'get_callback' => function( $object ) {
				$messages = QF_Form_Model::get_form_messages( $object['id'] );
				return $messages;
			},
			'update_value' => function( $meta, $object ) {
				$ret = update_post_meta( $object->ID, 'messages', $meta['messages'] );

				if ( false === $ret ) {
					return new WP_Error(
						'qf_rest_messages_update_failed',
						__( 'Failed to update messages.', 'quillforms' ),
						array( 'status' => 500 )
					);
				}
				return true;
			},
			'schema'       => array(
				'description' => __( 'Messages', 'quillforms' ),
				'type'        => 'object',
				'properties'  => array_walk(
					QF_Form_Messages::get_default_messages(),
					function( &$a, $b ) {
						$a['type'] = 'string'; }
				),
				'arg_options' => array(
					'sanitize_callback' => function( $messages ) {

						$messages_schema = QF_Form_Messages::get_default_messages();
						if ( ! empty( $messages ) ) {
							foreach ( $messages as $key => $message ) {
								if ( ! empty( $messages_schema[ $key ] ) &&
									! empty( $messages_schema[ $key ]['format'] ) &&
									$messages_schema[ 'html' === $key ]['format'] ) {

									$messages[ $key ] = wp_kses( $messages[ $key ], array( 'p', 'strong', 'i' ) );
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
}
