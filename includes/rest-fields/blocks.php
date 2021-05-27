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
			'id'         => array(
				'type'     => 'string',
				'required' => true,
			),
			'attributes' => array(
				'type' => 'object',
			),
			'name'       => array(
				'type'     => 'string',
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

			$value = get_post_meta( $form_id, 'blocks', true );
			$value = $value ? $value : array();

			// Just to add missing attributes.
			if ( ! empty( $value ) ) {
				foreach ( $value as $index => $block ) {
					$block_type = QF_Blocks_Factory::get_instance()->create( $block );
					if ( ! empty( $block_type ) ) {
						$block_attributes              = $block['attributes'] ? $block['attributes'] : array();
						$value[ $index ]['attributes'] = $block_type->prepare_attributes_for_render( $block_attributes );
					}
				}
			}
			return $value;
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
					// if ( ! empty( $value ) ) {
					// foreach ( $value as $index => $item ) {
					// $block_type           = QF_Blocks_Factory::get_instance()->get_registered( $item['name'] );
					// $value[ $index ]['attributes'] = rest_sanitize_value_from_schema(
					// $item['attributes'] ? $item['attributes'] : array(),
					// array(
					// 'type'       => 'object',
					// 'properties' => $block_type->get_attributes(),
					// )
					// );
					// }
					// }
					return $value;
				},
				'validate_callback' => function ( $value ) use ( $blocks_schema ) {
					// Block validation except for attributes.
					$validation = rest_validate_value_from_schema(
						$value,
						$blocks_schema
					);
					// if ( ! $validation instanceof WP_Error ) {
					// if ( ! empty( $value ) ) {
					// foreach ( $value as $index => $item ) {
					// $block      = QF_Blocks_Factory::get_instance()->get_registered( $item['name'] );
					// if($item['attributes']) {
					// $validation = rest_validate_value_from_schema(
					// $item['attributes'],
					// array(
					// 'type'       => 'object',
					// 'properties' => $block->get_attributes(),
					// )
					// );

					// If there is an error, get the error message and code then return new WP_Error with the index.
					// if ( $validation instanceof WP_Error ) {
					// $code    = $validation->get_error_code();
					// $message = $validation->get_error_message();
					// return new WP_Error( $code, '[' . $index . '] ' . $message );
					// }
					// }
					// }
					// }
					// }
					return $validation;
				},
			),
		),

	)
);
