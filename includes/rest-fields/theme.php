<?php
/**
 * Metafields: class QF_Theme_ID_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

register_rest_field(
	'quill_forms',
	'theme',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			return  get_post_meta( $form_id, 'theme', true );

		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = get_post_meta( $form_id, 'theme', true );
			if ( $prev_value === $meta ) {
				return true;
			}
			$ret = update_post_meta( $form_id, 'theme', $meta );
			if ( false === $ret ) {
				return new WP_Error(
					'qf_theme_update_failed',
					__( 'Failed to update theme.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}
			return true;
		},
		'schema'          => array(
			'type' => 'string',
		),
	)
);
