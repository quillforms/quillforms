<?php
/**
 * REST Fields: blocks
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage RESTFields
 */

use QuillForms\Managers\Blocks_Manager;

defined( 'ABSPATH' ) || exit;

$blocks_schema = array(
	'type'        => 'array',
	'items'       => array(
		'type'       => 'object',
		'properties' => array(
			'id'         => array(
				'type'     => 'string',
				'required' => true,
			),
			'attributes' => array(
				'type' => 'object',
			),
			'name'       => array(
				'type'     => 'string',
				'enum'     => array_keys( Blocks_Manager::instance()->get_all_registered() ),
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
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			$blocks = get_post_meta( $form_id, 'blocks', true );
			$blocks = $blocks ? $blocks : array();

			// Just to add missing attributes.
			if ( ! empty( $blocks ) ) {
				foreach ( $blocks as $index => $block ) {
					$block_type = Blocks_Manager::instance()->create( $block );
					if ( ! empty( $block_type ) ) {
						$block_attributes              = $block['attributes'] ? $block['attributes'] : array();
						$blocks[ $index ]['attributes'] = $block_type->prepare_attributes_for_render( $block_attributes );
					}
				}
			}
			return $blocks;
		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = get_post_meta( $form_id, 'blocks', true );
			if ( $prev_value === $meta ) {
				return true;
			}

			$ret = update_post_meta( $form_id, 'blocks', $meta );
			if ( false === $ret ) {
				return new WP_Error(
					'quillforms_blocks_update_failed',
					__( 'Failed to update blocks.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}

			do_action( 'quillforms_form_blocks_updated', $form_id, $meta );
			return true;
		},
		'schema'          => array(
			'description' => __( 'Blocks', 'quillforms' ),
			'arg_options' => array(
				'sanitize_callback' => function( $blocks ) use ( $blocks_schema ) {
					$blocks = rest_sanitize_value_from_schema(
						$blocks,
						$blocks_schema
					);
					// @todo
					// Add sanitization for block attributes.
					return $blocks;
				},
				'validate_callback' => function ( $blocks ) use ( $blocks_schema ) {
					// Block validation except for attributes.
					$validation = rest_validate_value_from_schema(
						$blocks,
						$blocks_schema
					);
					if ( ! is_wp_error( $validation ) ) {
						if ( ! empty( $blocks ) ) {
							foreach ( $blocks as $index => $block ) {
								$block_type     = Blocks_Manager::instance()->get_registered( $block['name'] );
								if ( $block_type ) {
									if ( $block['attributes'] ) {
										$validation = rest_validate_value_from_schema(
											$block['attributes'],
											array(
												'type' => 'object',
												'properties' => $block_type->get_attributes_schema(),
											)
										);
									}
									// If there is an error, get the error message and code then return new WP_Error with the index.
									if ( is_wp_error( $validation ) ) {
										$code    = $validation->get_error_code();
										$message = $validation->get_error_message();
										return new WP_Error( $code, '[' . $index . '] ' . $message );
									}
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
