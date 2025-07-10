<?php 
namespace QuillForms;
use QuillForms\Abstracts\Form_Template;
use QuillForms\Managers\Templates_Manager;

class Event_Registration_Template extends Form_Template {

    /**
     * Get template name
     *
     * @since @next
     *
     * @return string
     */
    public function get_name() {
        return 'event-registration';
    }   

    /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    public function get_title() {
        return __( 'Event Registration', 'quillforms' );
    }

    public function get_short_description() {
        return __( 'A form to register for an event. This template includes a calendar picker block, a multiple choice block, and a phone block.', 'quillforms' );
    }

    public function get_long_description() {
        return __( 'This template is designed to gather information from participants who want to register for an event. It includes a calendar picker block, a multiple choice block, and a phone block to help you collect valuable insights from your participants.', 'quillfozsrms' );
    }


    /**
     * Get Template Link
     * 
     * @since @next
     */
    public function get_template_link() {
        return 'https://quillforms.com/forms/event-registration/';
    }

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    public function get_template_screenshot() {
        // screenshot.png is at the same folder of this file
        return QUILLFORMS_PLUGIN_URL . 'includes/templates/event-registration/screenshot.png';
    }


    /**
     * Get template data
     * 
     * @since @next
     */

    public function get_template_data() {
        return json_decode(
            file_get_contents(
                QUILLFORMS_PLUGIN_DIR . 'includes/templates/event-registration/template.json'
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

Templates_Manager::instance()->register_template( new Event_Registration_Template() );