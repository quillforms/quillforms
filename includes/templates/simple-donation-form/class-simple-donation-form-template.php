<?php 
namespace QuillForms;
use QuillForms\Abstracts\Form_Template;
use QuillForms\Managers\Templates_Manager;

class Simple_Donation_Form_Template extends Form_Template {

    /**
     * Get template name
     *
     * @since @next
     *
     * @return string
     */
    public function get_name() {
        return 'simple-donation-form';
    }   

    /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    public function get_title() {
        return __( 'Simple Donation Form', 'quillforms' );
    }

    public function get_short_description() {
        return __( 'A simple donation form. This template includes a short text block, a email block, a phone block, and a multiple choice block.', 'quillforms' );
    }

    public function get_long_description() {
        return __( 'This template is designed to gather information from donors who want to donate to you. It includes a short text block, a email block, a phone block, and a multiple choice block to help you collect valuable insights from your donors.', 'quillforms' );
    }


    /**
     * Get Template Link
     * 
     * @since @next
     */
    public function get_template_link() {
        return 'https://quillforms.com/forms/donation-form/';
    }

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    public function get_template_screenshot() {
        // screenshot.png is at the same folder of this file
        return QUILLFORMS_PLUGIN_URL . 'includes/templates/simple-donation-form/screenshot.png';
    }


    /**
     * Get notes
     * 
     * @since @next
     */
    public function get_notes() {
        return "You have to enable payments in \"payments\" tab and select your favorite payment gateway to let the payment work.";
    }
    
    /**
     * Get template data
     * 
     * @since @next
     */

    public function get_template_data() {
        return json_decode(
            file_get_contents(
                QUILLFORMS_PLUGIN_DIR . 'includes/templates/simple-donation-form/template.json'
            ),
            true
        );
    }

    public function get_required_addons() {
        return array ();
    }
}

Templates_Manager::instance()->register_template( new Simple_Donation_Form_Template() );