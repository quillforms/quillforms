<?php
/**
 * RESTFields: Settings
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage RESTFields
 */

defined( 'ABSPATH' ) || exit;

register_rest_field(
	'quill_forms',
	'settings',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			$value = get_post_meta( $form_id, 'settings', true );
			$value = $value ? $value : array();

			return $value;
		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = get_post_meta( $form_id, 'settings', true );
			if ( $prev_value === $meta ) {
				return true;
			}
			$ret = update_post_meta(
				$form_id,
				'settings',
				$meta
			);
			if ( false === $ret ) {
				return new WP_Error(
					'quillforms_settings_update_failed',
					__( 'Failed to update settings.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}
			return true;
		},
	)
);
