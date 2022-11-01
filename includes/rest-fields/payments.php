<?php
/**
 * REST Fields: payments
 *
 * @since next.version
 * @package QuillForms
 * @subpackage RESTFields
 */

use QuillForms\Addon\Payment_Gateway\Payment_Gateway;
use QuillForms\Logic_Conditions;
use QuillForms\Managers\Addons_Manager;

defined( 'ABSPATH' ) || exit;

$payments_schema = array(
	'type'       => 'object',
	'properties' => array(
		'enabled'          => array(
			'type'     => 'boolean',
			'required' => true,
		),
		'currency'         => array(
			'type'       => 'object',
			'required'   => true,
			'properties' => array(
				'code'       => array(
					'type'     => 'string',
					'required' => true,
				),
				'symbol_pos' => array(
					'type'     => 'string',
					'required' => true,
				),
			),
		),
		'methods'          => array(
			'type'                 => 'object',
			'additionalProperties' => array(
				'type' => 'object',
			),
		),
		'gateways_options' => array(
			'type'                 => 'object',
			'additionalProperties' => array(
				'type' => 'object',
			),
		),
		'labels'           => array(
			'type'       => 'object',
			'required'   => true,
			'properties' => array(
				'select_payment_method' => array(
					'type'     => 'string',
					'required' => true,
				),
				'pay'                   => array(
					'type'     => 'string',
					'required' => true,
				),
				'order_details_heading' => array(
					'type'     => 'string',
					'required' => true,
				),
				'order_total'           => array(
					'type'     => 'string',
					'required' => true,
				),
			),
		),
		'models'           => array(
			'type'                 => 'object',
			'required'             => true,
			'additionalProperties' => array(
				'type'       => 'object',
				'properties' => array(
					'name'       => array(
						'type'     => 'string',
						'required' => true,
					),
					'recurring'  => array(
						'anyOf' => array(
							array(
								'type'     => 'boolean',
								'required' => true,
							),
							array(
								'type'       => 'object',
								'required'   => true,
								'properties' => array(
									'interval_count' => array(
										'type' => 'integer',
									),
									'interval_unit'  => array(
										'type' => 'string',
										'enum' => array( 'day', 'week', 'month', 'year' ),
									),
								),
							),
						),
					),
					'conditions' => array(
						'anyOf' => array(
							array(
								'type'     => 'boolean',
								'required' => true,
							),
							Logic_Conditions::get_conditions_schema(),
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
		'update_callback' => function( $new_value, $object ) {
			$form_id = $object->ID;
			$current_value = get_post_meta( $form_id, 'payments', true );

			// compare the new value with the current value because update_post_meta returns false if the same value passed.
			if ( $current_value === $new_value ) {
				return true;
			}

			$updated = update_post_meta( $form_id, 'payments', $new_value );
			if ( false === $updated ) {
				return new WP_Error(
					'quillforms_payments_update_failed',
					__( 'Failed to update payments.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}

			do_action( 'quillforms_form_payments_updated', $form_id, $new_value, $current_value );
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
						return $result;
					}

					// get enabled gateways & methods.
					$enabled_methods = array();
					foreach ( array_keys( $payments['methods'] )  as $key ) {
						list( $gateway, $method ) = explode( ':', $key );
						$enabled_methods[ $gateway ][] = $method;
					}

					// check support.
					foreach ( $enabled_methods as $gateway => $methods ) {
						/** @var Payment_Gateway */ // phpcs:ignore
						$gateway_addon = Addons_Manager::instance()->get_registered( $gateway );

						// ensure registered.
						if ( ! $gateway_addon ) {
							return new WP_Error(
								'quillforms_payments_validation_error',
								/* translators: %s for gateway:method */
								sprintf( esc_html__( 'Gateway %s is not active.', 'quillforms' ), $gateway )
							);
						}

						// check currency support.
						if ( ! $gateway_addon->is_currency_supported( $payments['currency']['code'] ) ) {
							return new WP_Error(
								'quillforms_payments_validation_error',
								/* translators: %s for gateway */
								sprintf( esc_html__( 'Currency is not supported by %s.', 'quillforms' ), $gateway )
							);
						}

						// check recurring interval support.
						foreach ( $payments['models'] as $model ) {
							if ( $model['recurring'] && ! $gateway_addon->is_recurring_interval_supported( $model['recurring']['interval_unit'], (int) $model['recurring']['interval_count'] ) ) {
								return new WP_Error(
									'quillforms_payments_validation_error',
									/* translators: %s for gateway */
									sprintf( esc_html__( 'Recurring interval is not supported by %s.', 'quillforms' ), $gateway )
								);
							}
						}
					}

					return true;
				},
			),
		),
	)
);
