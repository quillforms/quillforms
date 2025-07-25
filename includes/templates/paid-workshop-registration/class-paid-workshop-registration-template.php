<?php 
namespace QuillForms;
use QuillForms\Abstracts\Form_Template;
use QuillForms\Managers\Templates_Manager;

class Paid_Workshop_Registration_Template extends Form_Template {

    /**
     * Get template name
     *
     * @since @next
     *
     * @return string
     */
    public function get_name() {
        return 'paid-workshop-registration';
    }   

    /**
     * Get notes
     * 
     * @since @next
     */
    public function get_notes() {
        return "You have to enable payments in \"payments\" tab and select your favorite payment gateway to let the payment work.";
    }

    public function get_short_description() {
        return __( 'A form to register for a paid workshop. This template includes a multiple choice block, a phone block, and a file upload block.', 'quillforms' );
    }

    public function get_long_description() {
        return __( 'This template is designed to gather information from participants who want to register for a paid workshop. It includes a multiple choice block, a phone block, and a file upload block to help you collect valuable insights from your participants.', 'quillforms' );
    }

    /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    public function get_title() {
        return __( 'Paid Workshop Registration', 'quillforms' );
    }


    /**
     * Get Template Link
     * 
     * @since @next
     */
    public function get_template_link() {
        return 'https://quillforms.com/forms/paid-workshop-registration/';
    }

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    public function get_template_screenshot() {
        // screenshot.png is at the same folder of this file
        return QUILLFORMS_PLUGIN_URL . 'includes/templates/paid-workshop-registration/screenshot.png';
    }


    /**
     * Get template data
     * 
     * @since @next
     */

    public function get_template_data() {
        return json_decode(
            file_get_contents(
                QUILLFORMS_PLUGIN_DIR . 'includes/templates/paid-workshop-registration/template.json'
            ),
            true
        );
    }

    public function get_required_addons() {
        return array (
            'phoneblock'
        );
    }
}

Templates_Manager::instance()->register_template( new Paid_Workshop_Registration_Template() );