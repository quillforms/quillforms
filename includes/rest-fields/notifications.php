<?php
/**
 * Metafields: class QF_Notifications_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

register_rest_field(
	'quill_forms',
	'notifications',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			$value = maybe_unserialize( get_post_meta( $form_id, 'notifications', true ) );
			$value = $value ? $value : array();

			return  QF_Form_Notifications::prepare_notifications_for_render( $value );
		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = maybe_unserialize( get_post_meta( $form_id, 'notifications', true ) );
			if ( $prev_value === $meta ) {
				return true;
			}
			$ret = update_post_meta(
				$form_id,
				'notifications',
				maybe_serialize( $meta )
			);
			if ( false === $ret ) {
				return new WP_Error(
					'qf_notifications_update_failed',
					__( 'Failed to update notifications.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}
			return true;
		},
		'schema'          => array(),
	)
);
