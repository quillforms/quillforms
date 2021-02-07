<?php
/**
 * REST Fields: blocks
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage RESTFields
 */

defined( 'ABSPATH' ) || exit;

$blocks_schema = array(
	'type'        => 'array',
	'items'       => array(
		'type'       => 'object',
		'properties' => array(
			'id'          => array(
				'type'     => 'string',
				'required' => true,
			),
			'label'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'description' => array(
				'type'    => 'string',
				'default' => '',
			),
			'attachment'  => array(
				'type'       => 'object',
				'properties' => array(
					'url' => array(
						'type' => 'string',
					),
				),
			),
			'attributes'  => array(
				'type' => 'object',
			),
			'type'        => array(
				'type'     => 'string',
				'enum'     => array_keys( QF_Blocks_Factory::get_instance()->get_all_registered() ),
				'required' => true,
			),
			'required'    => array(
				'type' => 'boolean',
			),
		),

	),
	'uniqueItems' => array( 'id' ),
);

register_rest_field(
	'quill_forms',
	'blocks',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			$value = maybe_unserialize( get_post_meta( $form_id, 'blocks', true ) );
			$value = $value ? $value : array();

			// Just to add missing attributes.
			if ( ! empty( $value ) ) {
				foreach ( $value as $index => $block ) {
					$block_type       = $block['type'];
					$registered_block = QF_Blocks_Factory::get_instance()->get_registered( $block_type );
					if ( ! empty( $registered_block ) ) {
						$block_attributes              = $block['attributes'] ? $block['attributes'] : array();
						$value[ $index ]['attributes'] = $registered_block->prepare_attributes_for_render( $block_attributes );
					}
				}
			}
			return  $value;
		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = maybe_unserialize( get_post_meta( $form_id, 'blocks', true ) );
			if ( $prev_value === $meta ) {
				return true;
			}
			$ret = update_post_meta( $form_id, 'blocks', maybe_serialize( $meta ) );

			if ( false === $ret ) {
				return new WP_Error(
					'qf_blocks_update_failed',
					__( 'Failed to update blocks.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}
			return true;
		},
		'schema'          => array(
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
							$value[ $index ]['attributes'] = rest_sanitize_value_from_schema(
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
