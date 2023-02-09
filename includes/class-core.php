<?php
/**
 * Core: class Core.
 * Responsible for registering post type and registering block types in JS and some functions to get blocks, messages, ..etc.
 *
 * @since   1.0.0
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Managers\Blocks_Manager;
use QuillForms\Models\Form_Theme_Model;
use QuillForms\Site\License;
use QuillForms\Site\Store;

/**
 * Core class
 *
 * @since 1.0.0
 */
class Core
{

    /**
     * Register Block types via inline scripts.
     *
     * @since 1.0.0
     */
    public static function register_block_types_by_js()
    {
        foreach ( Blocks_Manager::instance()->get_all_registered() as $block ) {
            wp_add_inline_script(
                'quillforms-blocks',
                'qf.blocks.registerBlockType("' . $block->name . '",' . wp_json_encode(
                    array(
                    'attributes'       => $block->custom_attributes,
                    'supports'         => $block->supported_features,
                    'logicalOperators' => $block->logical_operators,
                    )
                ) . ');'
            );

        }
    }

    /**
     * Set admin config
     *
     * @since 1.8.0
     *
     * @return void
     */
    public static function set_admin_config()
    {
        wp_add_inline_script(
            'quillforms-config',
            'qf.config.default.setAdminUrl("' . admin_url() . '");' .
            'qf.config.default.setPluginDirUrl("' . QUILLFORMS_PLUGIN_URL . '");' .
            'qf.config.default.setLicense(' . json_encode(License::instance()->get_license_info()) . ');' .
            'qf.config.default.setStoreAddons(' . json_encode(Store::instance()->get_all_addons()) . ');' .
            'qf.config.default.setCurrencies(' . json_encode(Payments::instance()->get_currencies(array( 'name', 'symbol', 'symbol_pos' ))) . ');' .
            'qf.config.default.setPlans(' . json_encode(License::instance()->get_plans()) . ');' .
            'qf.config.default.setMessagesStructure(' . json_encode(Client_Messages::instance()->get_messages()) . ');' .
            'qf.config.default.setMaxUploadSize(' . wp_max_upload_size() / ( 1024 * 1024 ) . ');'
        );
    }


    /**
     * Add gallery themes
     *
     * @since 1.23.0
     *
     * @return void
     */
    public static function add_gallery_themes()
    {
        wp_add_inline_script(
            'quillforms-theme-editor',
            'wp.data.dispatch("quillForms/theme-editor").addGalleryThemes(' . json_encode(Gallery_Themes::get_themes()) . ');'
        );
    }
    /**
     * Set renderer config
     *
     * @since 1.8.0
     *
     * @return void
     */
    public static function set_renderer_config()
    {
        wp_add_inline_script(
            'quillforms-config',
            'qf.config.default.setAdminUrl("' . admin_url() . '");' .
            'qf.config.default.setFormId(' . get_the_ID() . ');' .
            'qf.config.default.setFormUrl("' . get_post_permalink() . '");'
        );
    }

    /**
     * Register Quill Forms Post Type.
     *
     * @since 1.0.0
     */
    public static function register_quillforms_post_type()
    {
        $labels   = array(
        'name'                  => __('Forms', 'quillforms'),
        'singular_name'         => __('Form', 'quillforms'),
        'add_new'               => __('Add Form', 'quillforms'),
        'add_new_item'          => __('Add Form', 'quillforms'),
        'edit_item'             => __('Edit Form', 'quillforms'),
        'new_item'              => __('Add Form', 'quillforms'),
        'view_item'             => __('View Form', 'quillforms'),
        'search_items'          => __('Search Forms', 'quillforms'),
        'not_found'             => __('No forms found', 'quillforms'),
        'not_found_in_trash'    => __('No forms found in trash', 'quillforms'),
        'featured_image'        => __('Form Featured Image', 'quillforms'),
        'set_featured_image'    => __('Set featured image', 'quillforms'),
        'remove_featured_image' => __('Remove featured image', 'quillforms'),
        'use_featured_image'    => __('Use as featured image', 'quillforms'),
        );
        $supports = array(
        'title',
        'editor',
        'thumbnail',
        );

        $args = array(
        'labels'             => $labels,
        'hierarchical'       => false,
        'supports'           => $supports,
        'public'             => true,
        'show_in_menu'       => false,
        'show_ui'            => true,
        'publicly_queryable' => true,
        'query_var'          => true,
        'capability_type'    => 'quillform',
        'rewrite'            => array(
        'slug' => 'quillforms',
        ),
        'has_archive'        => true,
        'menu_position'      => 30,
        'show_in_rest'       => true,
        );
        if(Settings::get('override_quillforms_slug') === true && ! empty(Settings::get('quillforms_slug')) ) {
            $args['rewrite']['slug'] = Settings::get('quillforms_slug');
        }
        register_post_type('quill_forms', $args);
        flush_rewrite_rules();
    }

    /**
     * Get form data
     * Includes id, title, blocks, messages, & notifications
     *
     * @since 1.6.0
     *
     * @param  integer $form_id Form id.
     * @return array
     */
    public static function get_form_data( $form_id )
    {
        $form_data = array(
        'id'            => $form_id,
        'title'         => get_the_title($form_id),
        'blocks'        => self::get_blocks($form_id),
        'messages'      => self::get_messages($form_id),
        'notifications' => self::get_notifications($form_id),
        'payments'      => self::get_payments($form_id),
        'products'      => self::get_products($form_id),
        );

        $form_data = apply_filters('quillforms_form_data', $form_data, $form_id);

        return $form_data;
    }


    /**
     * Get blocks for a specific form id.
     *
     * @param integer $form_id Form id.
     *
     * @return array|null The form blocks
     *
     * @since 1.0.0
     */
    public static function get_blocks( $form_id )
    {
        $blocks = get_post_meta($form_id, 'blocks', true);
        $blocks = $blocks ? $blocks : array();
        return $blocks;
    }

    /**
     * Get all blocks recursively (including innerBlocks).
     *
     * @param array $blocks
     *
     * @return array|null The form blocks recursively
     *
     * @since 2.0.0
     */
    public static function get_blocks_recursively( $blocks )
    {
        $all_blocks = [];
        if(!empty($blocks)) {
            foreach($blocks as $block) {
                $block_type = Blocks_Manager::instance()->create($block);
                $all_blocks[] = $block;
                if($block_type && isset($block_type->supported_features['innerBlocks']) ) {
                    if(!empty($block['innerBlocks'])) {
                        foreach($block['innerBlocks'] as $child_block) {
                            $all_blocks[] = $child_block;
                        }
                    }
                }


            }
        }

        return $all_blocks;
    }

    /**
     * Get messages for a specific form id.
     *
     * @param integer $form_id Form id.
     *
     * @return array|null The form messages
     *
     * @since 1.0.0
     */
    public static function get_messages( $form_id )
    {
        $messages = get_post_meta($form_id, 'messages', true);
        $messages  = $messages ?? array();
        $default_messages = Client_Messages::instance()->get_messages();
        foreach ($default_messages as $key => $message ) {
            if(!$message['default']) {
                continue;
            }
            $default_message = $message['default'];
            if(!isset($messages[$key])) {
                $messages[$key] = $default_message;
            }
        }
        return $messages;
    }

    /**
     * Get notifications for a specific form id.
     *
     * @param integer $form_id Form id.
     *
     * @return array|null The form notifications
     *
     * @since 1.0.0
     */
    public static function get_notifications( $form_id )
    {
        $notifications = get_post_meta($form_id, 'notifications', true);
        return $notifications;
    }

    /**
     * Get payments for a specific form id.
     *
     * @since next.version
     *
     * @param  integer $form_id Form id.
     * @return array|null The form payments
     */
    public static function get_payments( $form_id )
    {
        $payments = get_post_meta($form_id, 'payments', true);
        return $payments;
    }

    /**
     * Get products for a specific form id.
     *
     * @since next.version
     *
     * @param  integer $form_id Form id.
     * @return array|null The form products
     */
    public static function get_products( $form_id )
    {
        $products = get_post_meta($form_id, 'products', true);
        return $products;
    }

    /**
     * Get the theme for a specific form id.
     *
     * @param integer $form_id Form id.
     *
     * @return array|null The form theme
     *
     * @since 1.0.0
     */
    public static function get_theme( $form_id )
    {
        $theme_id  = get_post_meta($form_id, 'theme', true);
        $theme_obj = Form_Theme_Model::get_theme($theme_id);
        if (! $theme_obj ) {
            $theme = Form_Theme::instance()->prepare_theme_properties_for_render();
        } else {
            $theme_properties = $theme_obj['properties'];
            $theme_properties = $theme_properties ? $theme_properties : array();
            $theme            = Form_Theme::instance()->prepare_theme_properties_for_render($theme_properties);
        }
        return $theme;
    }

    /**
     * Get the theme id form a specific form id.
     *
     * @param integer $form_id Form id.
     *
     * @return integer|null The form theme id
     *
     * @since 1.8
     */
    public static function get_theme_id( $form_id )
    {
        $theme_id = get_post_meta($form_id, 'theme', true);
        return $theme_id;
    }

    /**
     * Get form settings
     *
     * @param integer $form_id Form id.
     *
     * @return array The form settings
     *
     * @since 1.8
     */
    public static function get_form_settings( $form_id )
    {
        $settings = get_post_meta($form_id, 'settings', true);
        return $settings;
    }
}
