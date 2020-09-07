<?php
/**
 * Rest Fields: Form structure
 *
 * @since 1.0.0
 *
 * @package QuillForms
 * @subpackage REST_API
 */

add_action( 'rest_api_init', 'qf_register_structure_rest_field' );

/**
 * Register rest field for form fields
 *
 * @since 1.0.0
 */
function qf_register_structure_rest_field() {
	register_rest_field(
		'quill_forms',
		'thankyouScreens',
		array(
			'get_callback' => function( $object ) {
				$structure = QF_Form_Model::get_form_structure( $object['id'] );
				return $structure;
			},
			'update_value' => function( $meta, $object ) {
				$ret = update_post_meta( $object->ID, 'thankyouScreens', $meta['thankyouScreens'] );

				if ( false === $ret ) {
					return new WP_Error(
						'qf_rest_thankyou_screens_update_failed',
						__( 'Failed to update thank you screens.', 'quillforms' ),
						array( 'status' => 500 )
					);
				}
				return true;
			},
			'schema'       => array(
				'description' => __( 'Thank you Screens', 'quillforms' ),
				'arg_options' => array(
					'sanitize_callback' => function ( $value ) {
						$blocks_factory = QF_Blocks_Factory::get_instance();
						$block = $blocks_factory->get_registered( 'thankyou-screen' );
						return rest_sanitize_value_from_schema(
							$value,
							array(
								'type'  => 'array',
								'items' => array(
									'type'       => 'object',
									'properties' => array_merge(
										QF_Schema_Manager::get_blocks_shared_properties_for_schema(),
										array(
											'attributes' => array(
												'type' => 'object',
												'properties' => $block->get_attributes(),

											),
										)
									),

								),
							)
						);
					},
					'validate_callback' => function ( $value ) {
						// Valid if it contains exactly 10 English letters.
						$blocks_factory = QF_Blocks_Factory::get_instance();
						if ( ! $blocks_factory->is_registered( 'thankyou-screen' ) ) {
							return new WP_Error( 'qf_rest_not_registered_block', __( 'Thank you screen block isn\'t registered', 'quillforms' ) );
						}
						$block = $blocks_factory->get_registered( 'thankyou-screen' );
						return rest_validate_value_from_schema(
							$value,
							array(
								'type'  => 'array',
								'items' => array(
									'type'       => 'object',
									'properties' => array_merge(
										QF_Schema_Manager::get_blocks_shared_properties_for_schema(),
										array(
											'attributes' => array(
												'type' => 'object',
												'properties' => $block->get_attributes(),
											),
										)
									),
								),
							)
						);
					},
				),

			),
		)
	);
}
