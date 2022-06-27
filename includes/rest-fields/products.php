<?php
/**
 * REST Fields: products
 *
 * @since next.version
 * @package QuillForms
 * @subpackage RESTFields
 */

defined( 'ABSPATH' ) || exit;

$products_schema = array(
	'type'                 => 'object',
	'additionalProperties' => array(
		'type'       => 'object',
		'properties' => array(
			'source'  => array(
				'type'       => 'object',
				'required'   => true,
				'properties' => array(
					'type'  => array(
						'type' => 'string',
						'enum' => array( 'field', 'variable', 'other' ),
					),
					'value' => array(
						'type' => 'string',
					),
				),
			),
			// for numeric field, variable and other:defined.
			'name'    => array(
				'type' => 'string',
			),
			// for other:defined.
			'price'   => array(
				'type' => 'number',
			),
			// for choices field.
			'choices' => array(
				'type'                 => 'object',
				'additionalProperties' => array(
					'type'       => 'object',
					'properties' => array(
						'price' => array(
							'type' => 'number',
						),
					),
				),
			),
		),
	),
);

register_rest_field(
	'quill_forms',
	'products',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];
			$products = get_post_meta( $form_id, 'products', true ) ?: array(); //phpcs:ignore
			return $products;
		},
		'update_callback' => function( $new_value, $object ) {
			$form_id = $object->ID;
			$current_value = get_post_meta( $form_id, 'products', true );

			// compare the new value with the current value because update_post_meta returns false if the same value passed.
			if ( $current_value === $new_value ) {
				return true;
			}

			$updated = update_post_meta( $form_id, 'products', $new_value );
			if ( false === $updated ) {
				return new WP_Error(
					'quillforms_products_update_failed',
					__( 'Failed to update products.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}

			do_action( 'quillforms_form_products_updated', $form_id, $new_value, $current_value );
			return true;
		},
		'schema'          => array(
			'description' => __( 'Products', 'quillforms' ),
			'arg_options' => array(
				'sanitize_callback' => function( $products ) use ( $products_schema ) {
					$result = rest_sanitize_value_from_schema(
						$products,
						$products_schema
					);
					if ( is_wp_error( $result ) ) {
						quillforms_get_logger()->error(
							esc_html__( 'Error on sanitizing products', 'quillforms' ),
							array(
								'code'     => 'quillforms_products_sanitizing_error',
								'error'    => array(
									'code'    => $result->get_error_code(),
									'message' => $result->get_error_message(),
									'data'    => $result->get_error_data(),
								),
								'products' => $products,
							)
						);
					}
					return $result;
				},
				'validate_callback' => function ( $products ) use ( $products_schema ) {
					$result = rest_validate_value_from_schema(
						$products,
						$products_schema
					);
					if ( is_wp_error( $result ) ) {
						quillforms_get_logger()->error(
							esc_html__( 'Error on validating products', 'quillforms' ),
							array(
								'code'     => 'quillforms_products_validating_error',
								'error'    => array(
									'code'    => $result->get_error_code(),
									'message' => $result->get_error_message(),
									'data'    => $result->get_error_data(),
								),
								'products' => $products,
							)
						);
					}
					return $result;
				},
			),
		),
	)
);
