<?php
/**
 * Rest Fields: Form structure
 *
 * @since 1.0.0
 *
 * @package QuillForms
 * @subpackage REST_API
 */

add_action( 'rest_api_init', 'qf_register_fields_rest_field' );

/**
 * Register rest field for form fields
 *
 * @since 1.0.0
 */
function qf_register_fields_rest_field() {

	register_rest_field(
		'quill_forms',
		'fields',
		array(
			'get_callback' => function( $object ) {
				$structure = QF_Form_Model::get_form_structure( $object['id'] );
				return $structure;
			},
			'update_value' => function( $meta, $object ) {
				$ret = update_post_meta( $object->ID, 'fields', $meta['fields'] );

				if ( false === $ret ) {
					return new WP_Error(
						'qf_rest_fields_update_failed',
						__( 'Failed to update fields.', 'quillforms' ),
						array( 'status' => 500 )
					);
				}
				return true;
			},
			'schema'       => array(
				'description' => __( 'Fields', 'quillforms' ),
				'arg_options' => array(
					'sanitize_callback' => function( $value ) {
						$value = rest_sanitize_value_from_schema(
							$value,
							array(
								array(
									'type'        => 'array',
									'items'       => array(
										'type'       => 'object',
										'properties' => array_merge(
											QF_Schema_Manager::get_blocks_shared_properties_for_schema(),
											array(
												'attributes' => array(
													'type' => 'object',
												),
												'type' => array(
													'type' => 'string',
													'enum' => array_diff( array_keys( QF_Blocks_Factory::get_instance()->get_all_registered() ), array( 'welcome-screen', 'thankyou-screen' ) ),
													'required' => true,
												),
											)
										),
									),
									'uniqueItems' => array( 'id', 'key' ),
								),
							)
						);

						// Sanitize attributes.
						if ( ! empty( $value ) ) {
							foreach ( $value as $index => $item ) {
								$block = QF_Blocks_Factory::get_instance()->get_registered( $item['type'] );
								$value[ $index ] = rest_sanitize_value_from_schema(
									$item['attributes'],
									array(
										'type'       => 'object',
										'properties' => $block->get_attributes(),
									)
								);
							}
						}
						return $value;
					},
					'validate_callback' => function ( $value ) {
						// Block validation except for attributes.
						$validation = rest_validate_value_from_schema(
							$value,
							array(
								'type'        => 'array',
								'items'       => array(
									'type'       => 'object',
									'properties' => array_merge(
										QF_Schema_Manager::get_blocks_shared_properties_for_schema(),
										array(
											'attributes' => array(
												'type' => 'object',
											),
											'type'       => array(
												'type'     => 'string',
												'enum'     => array_diff( array_keys( QF_Blocks_Factory::get_instance()->get_all_registered() ), array( 'welcome-screen', 'thankyou-screen' ) ),
												'required' => true,
											),
										)
									),
								),
								'uniqueItems' => array( 'id', 'key' ),
							)
						);
						// Let's validate the attributes.
						if ( ! $validation instanceof WP_Error ) {
							if ( ! empty( $value ) ) {
								foreach ( $value as $index => $item ) {
									$block = QF_Blocks_Factory::get_instance()->get_registered( $item['type'] );
									$validation = rest_validate_value_from_schema(
										$item['attributes'],
										array(
											'type'       => 'object',
											'properties' => $block->get_attributes(),
										)
									);

									// If there is an error, get the error message and code then return new WP_Error with the index.
									if ( $validation instanceof WP_Error ) {
										$code = $validation->get_error_code();
										$message = $validation->get_error_message();
										$validation->add_data( 'index is' );
										return new WP_Error( $code, '[' . $index . '] ' . $message );
									}
								}
							}
						}
						return $validation;
					},
				),

			),
		)
	);
}
