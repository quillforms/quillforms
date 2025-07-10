<?php 
namespace QuillForms;
use QuillForms\Abstracts\Form_Template;
use QuillForms\Managers\Templates_Manager;

class Simple_Contact_Form_Template extends Form_Template {

    /**
     * Get template name
     *
     * @since @next
     *
     * @return string
     */
    public function get_name() {
        return 'simple-contact-form';
    }   

    /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    public function get_title() {
        return __( 'Simple Contact Form', 'quillforms' );
    }

    public function get_short_description() {
        return __( 'A simple contact form. This template includes a short text block, a email block, a phone block, and a multiple choice block.', 'quillforms' );
    }

    public function get_long_description() {
        return __( 'This template is designed to gather information from visitors who want to contact you. It includes a short text block, a email block, a phone block, and a multiple choice block to help you collect valuable insights from your visitors.', 'quillforms' );
    }
    
    /**
     * Get Template Link
     * 
     * @since @next
     */
    public function get_template_link() {
        return 'https://quillforms.com/forms/simple-contact-form/';
    }

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    public function get_template_screenshot() {
        // screenshot.png is at the same folder of this file
        return QUILLFORMS_PLUGIN_URL . 'includes/templates/simple-contact-form/screenshot.png';
    }


    /**
     * Get template data
     * 
     * @since @next
     */

    public function get_template_data() {
        return json_decode(
            file_get_contents(
                QUILLFORMS_PLUGIN_DIR . 'includes/templates/simple-contact-form/template.json'
            ),
            true
        );
    }

    public function get_required_addons() {
        return array (
        
        );
    }
}

Templates_Manager::instance()->register_template( new Simple_Contact_Form_Template() );