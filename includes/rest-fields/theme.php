<?php
/**
 * RESTFields: theme
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage RESTFields
 */

use QuillForms\Models\Form_Theme_Model;

defined( 'ABSPATH' ) || exit;

register_rest_field(
	'quill_forms',
	'theme',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];
			$theme_id = (int) get_post_meta( $form_id, 'theme', true );
			return  array(
				'id'         => $theme_id,
				'theme_data' => Form_Theme_Model::get_theme( $theme_id ),
			);

		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = intval( get_post_meta( $form_id, 'theme', true ) );
			if ( intval( $meta ) === $prev_value ) {
				return true;
			}
			$ret = update_post_meta( $form_id, 'theme', intval( $meta ) );
			if ( false === $ret ) {
				return new WP_Error(
					'quillforms_theme_update_failed',
					__( 'Failed to update theme.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}
			return true;
		},
		'schema'          => array(
			'type' => 'number',
		),
	)
);
