<?php
/**
 * REST Fields: payments
 *
 * @since next.version
 * @package QuillForms
 * @subpackage RESTFields
 */

use QuillForms\Addon\Payment_Gateway\Payment_Gateway;
use QuillForms\Managers\Addons_Manager;

defined( 'ABSPATH' ) || exit;

$payments_schema = array(
	'type'       => 'object',
	'properties' => array(
		'enabled'   => array(
			'type'     => 'boolean',
			'required' => true,
		),
		'recurring' => array(
			'type'       => 'object',
			'required'   => true,
			'properties' => array(
				'enabled'        => array(
					'type'     => 'boolean',
					'required' => true,
				),
				'interval_count' => array(
					'type' => 'integer',
				),
				'interval_unit'  => array(
					'type' => 'string',
					'enum' => array( 'day', 'week', 'month', 'year' ),
				),
			),
		),
		'currency'  => array(
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
		'methods'   => array(
			'type'                 => 'object',
			'additionalProperties' => array(
				'type' => 'object',
			),
		),
		'customer'  => array(
			'type'       => 'object',
			'properties' => array(
				'name'  => array(
					'type'       => 'object',
					'properties' => array(
						'type'  => array(
							'type' => 'string',
						),
						'value' => array(
							'type' => 'string',
						),
					),
				),
				'email' => array(
					'type'       => 'object',
					'properties' => array(
						'type'  => array(
							'type' => 'string',
						),
						'value' => array(
							'type' => 'string',
						),
					),
				),
			),
		),
		'products'  => array(
			'type'                 => 'object',
			'additionalProperties' => array(
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
					'field'      => array(
						'type' => 'string',
					),
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
		'update_callback' => function( $new_value, $object ) {
			$form_id = $object->ID;
			$current_value = get_post_meta( $form_id, 'payments', true );

			// get enabled gateways & methods with removing not enabled.
			$enabled_methods = array();
			foreach ( $new_value['methods'] ?? array() as $key => $data ) {
				if ( empty( $data['enabled'] ) ) {
					unset( $new_value['methods'][ $key ] );
					continue;
				}
				list( $gateway, $method ) = explode( ':', $key );
				$enabled_methods[ $gateway ][] = $method;
			}

			// check support.
			foreach ( $enabled_methods as $gateway => $methods ) {
				/** @var Payment_Gateway */ // phpcs:ignore
				$gateway_addon = Addons_Manager::instance()->get_registered( $gateway );

				// check if registered.
				if ( ! $gateway_addon ) {
					/* translators: %s for gateway:method */
					return new WP_Error( 'quillforms_payments_update_failed', sprintf( esc_html__( 'Gateway %s is not active.', 'quillforms' ), $gateway ) );
				}

				// check settings support.
				if ( ! $gateway_addon->is_currency_supported( $new_value['currency']['code'] ) ) {
					/* translators: %s for gateway */
					return new WP_Error( 'quillforms_payments_update_failed', sprintf( esc_html__( 'Currency is not supported by %s.', 'quillforms' ), $gateway ) );
				}
				$recurring_enabled = $new_value['recurring']['enabled'] ?? false;
				if ( $recurring_enabled && ! $gateway_addon->is_recurring_interval_supported( $new_value['recurring']['interval_unit'], (int) $new_value['recurring']['interval_count'] ) ) {
					/* translators: %s for gateway */
					return new WP_Error( 'quillforms_payments_update_failed', sprintf( esc_html__( 'Recurring interval is not supported by %s.', 'quillforms' ), $gateway ) );
				}

				// check methods.
				foreach ( $methods as $method ) {
					if ( $recurring_enabled && ! $gateway_addon->is_recurring_supported( $method ) ) {
						/* translators: %s for gateway:method */
						return new WP_Error( 'quillforms_payments_update_failed', sprintf( esc_html__( 'Recurring is not supported by %s method.', 'quillforms' ), "$gateway:$method" ) );
					}
				}

				// check gateway errors.
				$gateway_check = $gateway_addon->check_form_settings_update( $form_id, $new_value, $current_value );
				if ( is_wp_error( $gateway_check ) ) {
					return $gateway_check;
				}
			}

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
