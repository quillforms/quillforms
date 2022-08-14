<?php
/**
 * RESTFields: notifications
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage RESTFields
 */

use QuillForms\Logic_Conditions;

defined( 'ABSPATH' ) || exit;

register_rest_field(
	'quill_forms',
	'notifications',
	array(
		'get_callback'    => function( $object ) {
			$form_id = $object['id'];

			$value = get_post_meta( $form_id, 'notifications', true );
			$value = $value ? $value : array();

			return $value;
		},
		'update_callback' => function( $meta, $object ) {
			$form_id = $object->ID;
			// Calculation the previous value because update_post_meta returns false if the same value passed.
			$prev_value = get_post_meta( $form_id, 'notifications', true );
			if ( $prev_value === $meta ) {
				return true;
			}
			$ret = update_post_meta(
				$form_id,
				'notifications',
				$meta
			);
			if ( false === $ret ) {
				return new WP_Error(
					'quillforms_notifications_update_failed',
					__( 'Failed to update notifications.', 'quillforms' ),
					array( 'status' => 500 )
				);
			}
			return true;
		},
		'schema'          => array(
			'arg_options' => array(
				'sanitize_callback' => function( $value ) {
					if ( ! empty( $value ) ) {
						foreach ( $value as $notification_index => $notification ) {
							$notification_properties  = $notification ['properties'];

							if ( ! empty( $notification_properties ) ) {
								foreach ( $notification_properties as $prop => $val ) {
									if ( 'message' === $prop ) {
										$value[ $notification_index ]['properties'][ $prop ] = wp_kses(
											$val,
											array(
												'a'      => array(
													'href' => array(),
													'title' => array(),
												),
												'br'     => array(),
												'strong' => array(),
												'em'     => array(),
											)
										);
									} elseif ( 'subject' === $prop || 'title' === $prop || 'replyTo' === $prop ) {
										$value[ $notification_index ]['properties'][ $prop ] = sanitize_text_field( $val );
									} elseif ( 'recipients' === $prop ) {
										$value[ $notification_index ]['properties'][ $prop ] = array_map(
											function( $item ) {
												return sanitize_text_field( $item );
											},
											$val
										);
									}
								}
							}
						}
					}

					return $value;
				},
				'validate_callback' => function ( $notifications ) {
					// validate notifications.
					// We simply didn't use schema because we support WP 5.4 at which "uniqueItems" weren't implemented.
					$validation = rest_validate_value_from_schema(
						$notifications,
						array(
							'type'        => 'array',
							'items'       => array(
								'type'       => 'object',
								'properties' => array(
									'id'         => array(
										'type'     => 'string',
										'required' => true,
									),
									'properties' => array(
										'type'       => 'object',
										'properties' => array(
											'title'      => array(
												'type' => 'string',
											),
											'active'     => array(
												'type' => 'boolean',
											),
											'toType'     => array(
												'type' => 'string',
												'enum' => array( 'email', 'field' ),
											),
											'recipients' => array(
												'type'  => 'array',
												'items' => array(
													'type' => 'string',
												),
											),
											'replyTo'    => array(
												'type' => 'string',
											),
											'subject'    => array(
												'type' => 'string',
											),
											'message'    => array(
												'type' => 'string',
											),
											'conditions' => Logic_Conditions::get_conditions_schema(),
										),
									),

								),

							),
							'uniqueItems' => array( 'id' ),
						)
					);
					return $validation;
				},
			),

		),
	)
);
