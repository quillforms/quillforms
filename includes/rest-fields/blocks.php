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

// Create merged attributes schema from all registered blocks
function get_merged_attributes_schema() {
    $all_blocks = Blocks_Manager::instance()->get_all_registered();
    $merged_properties = array();

    foreach ($all_blocks as $block) {
        if (method_exists($block, 'get_attributes_schema')) {
            $schema = $block->get_attributes_schema();
            if (is_array($schema)) {
                foreach ($schema as $key => $property) {
                    if (isset($merged_properties[$key])) {
                        // If the property already exists, merge the types
                        if (isset($merged_properties[$key]['type']) && isset($property['type'])) {
                            $existing_type = $merged_properties[$key]['type'];
                            $new_type = $property['type'];

                            // Convert to array if it's not already
                            if (!is_array($existing_type)) {
                                $existing_type = array($existing_type);
                            }
                            if (!is_array($new_type)) {
                                $new_type = array($new_type);
                            }

                            // Merge and ensure unique values
                            $merged_properties[$key]['type'] = array_unique(array_merge($existing_type, $new_type));
                        }
                    } else {
                        // Otherwise, add the property as is
                        $merged_properties[$key] = $property;
                    }
                }
            }
        }
    }

    return array(
        'type' => 'object',
        'properties' => $merged_properties,
        'additionalProperties' => true // Allow additional properties for flexibility
    );
}

$merged_attributes_schema = get_merged_attributes_schema();

$blocks_schema = array(
    'type'        => 'array',
    'items'       => array(
        'type'       => 'object',
        'properties' => array(
            'id'         => array(
                'type'     => 'string',
                'required' => true,
            ),
            'attributes' => $merged_attributes_schema,
            'name'       => array(
                'type'     => 'string',
                'enum'     => array_merge(array_keys( Blocks_Manager::instance()->get_all_registered() ), ['partial-submission-point']),
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

            if ( ! empty( $blocks ) ) {
                foreach ( $blocks as $index => $block ) {
                    $block_type = Blocks_Manager::instance()->create( $block );
                    if ( ! empty( $block_type ) ) {
                        $block_attributes = $block['attributes'] ? $block['attributes'] : array();
                        $blocks[ $index ]['attributes'] = $block_type->prepare_attributes_for_render( $block_attributes );
                    }
                }
            }
            return $blocks;
        },
        'update_callback' => function( $meta, $object ) {
            $form_id = $object->ID;
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
                    return rest_sanitize_value_from_schema(
                        $blocks,
                        $blocks_schema
                    );
                },
                'validate_callback' => function ( $blocks ) use ( $blocks_schema ) {
                    return rest_validate_value_from_schema(
                        $blocks,
                        $blocks_schema
                    );
                },
            ),
        ),
    )
);