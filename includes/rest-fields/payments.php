<?php
/**
 * REST Fields: payments
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage RESTFields
 */

defined( 'ABSPATH' ) || exit;

$payments_schema = array(
	'type'       => 'object',
	'properties' => array(
		'enabled'   => array(
			'type'     => 'boolean',
			'required' => true,
		),
		'recurring' => array(
			'type'     => 'boolean',
			'required' => true,
		),
		'required'  => array(
			'type'     => 'boolean',
			'required' => true,
		),
		'methods'   => array(
			'type'                 => 'object',
			'additionalProperties' => array(
				'type' => 'object',
			),
		),
		'products'  => array(
			'type'  => 'array',
			'items' => array(
				'type'       => 'object',
				'properties' => array(
					'type'       => array(
						'type'     => 'string',
						'enum'     => array( 'single', 'mapping' ),
						'required' => true,
					),
					// single.
					'name'       => array(
						'type' => 'string',
					),
					'value_type' => array(
						'type' => 'string',
					),
					'value'      => array(
						'type' => 'string',
					),
					// mapping.
					'values'     => array(
						'type'                 => 'object',
						'additionalProperties' => array(
							'type' => 'string',
						),
					),
				),
			),
		),
	),
);

register_rest_field(
	'quill_forms',
	'payments',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];
			$payments = get_post_meta( $form_id, 'payments', true ) ?: array(); //phpcs:ignore
			return $payments;
		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = get_post_meta( $form_id, 'payments', true );
			if ( $prev_value === $meta ) {
				return true;
			}

			$updated = update_post_meta( $form_id, 'payments', $meta );
			if ( false === $updated ) {
				return new WP_Error(
					'quillforms_payments_update_failed',
					__( 'Failed to update payments.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}

			do_action( 'quillforms_form_payments_updated', $form_id, $meta );
			return true;
		},
		'schema'          => array(
			'description' => __( 'Payments', 'quillforms' ),
			'arg_options' => array(
				'sanitize_callback' => function( $payments ) use ( $payments_schema ) {
					$result = rest_sanitize_value_from_schema(
						$payments,
						$payments_schema
					);
					if ( is_wp_error( $result ) ) {
						quillforms_get_logger()->error(
							esc_html__( 'Error on sanitizing payments settings', 'quillforms' ),
							array(
								'code'     => 'quillforms_payments_settings_sanitizing_error',
								'error'    => array(
									'code'    => $result->get_error_code(),
									'message' => $result->get_error_message(),
									'data'    => $result->get_error_data(),
								),
								'payments' => $payments,
							)
						);
					}
					return $result;
				},
				'validate_callback' => function ( $payments ) use ( $payments_schema ) {
					$result = rest_validate_value_from_schema(
						$payments,
						$payments_schema
					);
					if ( is_wp_error( $result ) ) {
						quillforms_get_logger()->error(
							esc_html__( 'Error on validating payments settings', 'quillforms' ),
							array(
								'code'     => 'quillforms_payments_settings_validating_error',
								'error'    => array(
									'code'    => $result->get_error_code(),
									'message' => $result->get_error_message(),
									'data'    => $result->get_error_data(),
								),
								'payments' => $payments,
							)
						);
					}
					return $result;
				},
			),
		),
	)
);
