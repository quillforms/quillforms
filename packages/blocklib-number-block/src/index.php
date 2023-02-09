<?php
/**
 * Block Library: class Number_Block_Type
 *
 * @package    QuillForms
 * @subpackage BlockLibrary
 * @since      1.0.0
 */

namespace QuillForms\Blocks;

use QuillForms\Abstracts\Block_Type;
use QuillForms\Managers\Blocks_Manager;

defined('ABSPATH') || exit;

/**
 * Number block type
 *
 * @class Number_Block_Type
 *
 * @since 1.0.0
 */
class Number_Block_Type extends Block_Type
{

    /**
     * Metadata json file.
     *
     * @var string
     *
     * @access private
     */
    private $metadata;

    /**
     * Get Block Type
     * It must be unique name.
     *
     * @since 1.0.0
     *
     * @return string The block type
     */
    public function get_name() : string
    {
        return $this->get_metadata()['name'];
    }

    /**
     * Get block supported features.
     *
     * @since 1.0.0
     *
     * @return array The block supported features
     */
    public function get_block_supported_features() : iterable
    {
        return $this->get_metadata()['supports'];
    }

    /**
     * Get block admin assets.
     *
     * @since 1.0.0
     *
     * @return array The block admin assets
     */
    public function get_block_admin_assets() : iterable
    {
        return array(
        'style'  => 'quillforms-blocklib-number-block-admin-style',
        'script' => 'quillforms-blocklib-number-block-admin-script',
        );
    }

    /**
     * Get block renderer assets.
     *
     * @since 1.0.0
     *
     * @return array The block renderer assets
     */
    public function get_block_renderer_assets() : iterable
    {
        return array(
        'style'  => 'quillforms-blocklib-number-block-renderer-style',
        'script' => 'quillforms-blocklib-number-block-renderer-script',
        );
    }

    /**
     * Get block custom attributes.
     *
     * @since 1.0.0
     *
     * @return array The block custom attributes
     */
    public function get_custom_attributes() : iterable
    {
        return $this->get_metadata()['attributes'];
    }

    /**
     * Get logical operators
     *
     * @since 1.0.0
     *
     * @return array The logical operators
     */
    public function get_logical_operators() : iterable
    {
        return $this->get_metadata()['logicalOperators'];
    }

    /**
     * Get meta data
     * This file is just for having some shared properties between front end and back end.
     * Just as the block type.
     *
     * @access private
     *
     * @return array|null metadata from block . json file
     */
    private function get_metadata()
    {
        if (! $this->metadata ) {
            $this->metadata = json_decode(
                file_get_contents(
                    $this->get_dir() . 'block.json'
                ),
                true
            );
        }
        return $this->metadata;
    }

    /**
     * Get block directory
     *
     * @since 1.0.0
     *
     * @access private
     *
     * @return string The directory path
     */
    private function get_dir() : string
    {
        return trailingslashit(dirname(__FILE__));
    }


    /**
     * Validate Field.
     *
     * @since 1.0.0
     *
     * @param mixed $value     The field value.
     * @param array $form_data The form data.
     */
    public function validate_field( $value, $form_data )
    {
        $messages = $form_data['messages'];
        if ($value !== 0 && empty($value) ) {
            if ($this->attributes['required'] ) {
                $this->is_valid       = false;
                $this->validation_err = $messages['label.errorAlert.required'];
            }
        } else {
            if (! is_numeric($value) ) {
                $this->is_valid       = false;
                $this->validation_err = $messages['label.errorAlert.number'];
            } else {
                $set_min = $this->attributes['setMin'];
                $min     = $this->attributes['min'];
                $set_max = $this->attributes['setMax'];
                $max     = $this->attributes['max'];
                if ($set_min && $min && $value < $min ) {
                    $this->is_valid       = false;
                    $this->validation_err = $messages['label.errorAlert.minNum'];
                    return;
                }
                if ($set_max && $max && $value > $max ) {
                    $this->is_valid       = false;
                    $this->validation_err = $messages['label.errorAlert.maxNum'];
                    return;
                }
            }
        }
    }

    /**
     * Sanitize entry value.
     *
     * @since 1.0.0
     *
     * @param mixed   $value     The entry value that needs to be formatted and may be sanitized.
     * @param integer $form_data The form data.
     *
     * @return mixed $value The formatted entry value.
     */
    public function sanitize_field( $value, $form_data )
    {
        return absint($value);
    }
}

Blocks_Manager::instance()->register(new Number_Block_Type());
