<?php
/**
 * Metafields: class QF_Blocks_Meta_Field
 *
 * @since 1.0.0
 * @package QuillForms
 * @subpackage MetaFields
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Blocks_Meta_Field
 *
 * @since 1.0.0
 */
class QF_Blocks_Meta_Field extends QF_Meta_Field {

	/**
	 * Get slug
	 *
	 * @since 1.0.0
	 *
	 * @return string Meta field slug
	 */
	public function get_slug() {
		return 'blocks';
	}

	/**
	 * Get field value
	 *
	 * @since 1.0.0
	 * @param array $object Form object.
	 *
	 * @return mixed The value
	 */
	public function get_value( $object ) {
		$form_id = $object['id'];

		$value = qf_decode( get_post_meta( $form_id, $this->get_slug(), true ) );
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
	}

	/**
	 * Get schema
	 * The schema term is pretty much like the schema in WordPress REST api.
	 *
	 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/schema
	 * @since 1.0.0
	 *
	 * @return array The schema
	 */
	public function get_schema() {

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

		return array(
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
		);
	}
}

QF_Meta_Fields::get_instance()->register( new QF_Blocks_Meta_Field() );
