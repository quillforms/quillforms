<?php
/**
 * Rest Fields: Form Blocks
 *
 * @since 1.0.0
 *
 * @package QuillForms
 * @subpackage REST_API
 */

add_action( 'rest_api_init', 'qf_register_blocks_rest_field' );

/**
 * Register rest field for form fields
 *
 * @since 1.0.0
 */
function qf_register_blocks_rest_field() {

	$blocks_schema = array(
		'type'        => 'array',
		'items'       => array(
			'type'       => 'object',
			'properties' => array(
				'id'              => array(
					'type'     => 'string',
					'required' => true,
				),
				'label'           => array(
					'type'    => 'string',
					'default' => '',
				),
				'description'     => array(
					'type'    => 'string',
					'default' => '',
				),
				'imageAttachment' => array(
					'type'    => 'array',
					'items'   => array(
						'type'       => 'object',
						'properties' => array(
							'url' => array(
								'type' => 'string',
							),
						),
					),
					'default' => array(),
				),
				'attributes'      => array(
					'type' => 'object',
				),
				'type'            => array(
					'type'     => 'string',
					'enum'     => array_keys( QF_Blocks_Factory::get_instance()->get_all_registered() ),
					'required' => true,
				),
			),

		),
		'uniqueItems' => array( 'id' ),
	);

	register_rest_field(
		'quill_forms',
		'blocks',
		array(
			'get_callback' => function( $object ) {
				$structure = QF_Form_Model::get_form_structure( $object['id'] );
				return $structure;
			},
			'update_value' => function( $meta, $object ) {
				$ret = update_post_meta( $object->ID, 'blocks', $meta['blocks'] );

				if ( false === $ret ) {
					return new WP_Error(
						'qf_rest_blocks_update_failed',
						__( 'Failed to update blocks.', 'quillforms' ),
						array( 'status' => 500 )
					);
				}
				return true;
			},
			'schema'       => array(
				'description' => __( 'Blocks', 'quillforms' ),
				'arg_options' => array(
					'sanitize_callback' => function( $value ) use ( $blocks_schema ) {
						$value = rest_sanitize_value_from_schema(
							$value,
							$blocks_schema
						);
							// Sanitize attributes.
						if ( ! empty( $value ) ) {
							foreach ( $value as $index => $item ) {
								$block           = QF_Blocks_Factory::get_instance()->get_registered( $item['type'] );
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
					'validate_callback' => function ( $value ) use ( $blocks_schema ) {
						// Block validation except for attributes.
						$validation = rest_validate_value_from_schema(
							$value,
							$blocks_schema
						);
						// Let's validate the attributes.
						if ( ! $validation instanceof WP_Error ) {
							if ( ! empty( $value ) ) {
								foreach ( $value as $index => $item ) {
									$block      = QF_Blocks_Factory::get_instance()->get_registered( $item['type'] );
									$validation = rest_validate_value_from_schema(
										$item['attributes'],
										array(
											'type'       => 'object',
											'properties' => $block->get_attributes(),
										)
									);

									// If there is an error, get the error message and code then return new WP_Error with the index.
									if ( $validation instanceof WP_Error ) {
										$code    = $validation->get_error_code();
										$message = $validation->get_error_message();
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
