<?php
/**
 * Rest Fields: Form Messages
 *
 * @since 1.0.0
 *
 * @package QuillForms
 * @subpackage REST_API
 */

add_action( 'rest_api_init', 'qf_register_theme_rest_field' );

/**
 * Register rest field for form fields
 *
 * @since 1.0.0
 */
function qf_register_theme_rest_field() {

	register_rest_field(
		'quill_forms',
		'theme',
		array(
			'get_callback' => function( $object ) {
				return array(
					'id'         => QF_Form_Model::get_form_theme_id( $object['id'] ),
					'theme_data' => QF_Form_Model::get_form_theme_data( $object['id'] ),
				);
			},
			'update_value' => function( $meta, $object ) {
				$ret = update_post_meta( $object->ID, 'theme_id', $meta['theme'] );

				if ( false === $ret ) {
					return new WP_Error(
						'qf_rest_theme_update_failed',
						__( 'Failed to update theme.', 'quillforms' ),
						array( 'status' => 500 )
					);
				}
				return true;
			},
			'schema'       => array(
				'description' => __( 'Messages', 'quillforms' ),
				'type'        => 'object',
				'properties'  => QF_Form_Theme::get_theme_data(),
			),
		)
	);
}
