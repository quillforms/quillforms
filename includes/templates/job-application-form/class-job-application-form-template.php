<?php 
namespace QuillForms;
use QuillForms\Abstracts\Form_Template;
use QuillForms\Managers\Templates_Manager;

class Job_Application_Form_Template extends Form_Template {

    /**
     * Get template name
     *
     * @since @next
     *
     * @return string
     */
    public function get_name() {
        return 'job-application-form';
    }   

    /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    public function get_title() {
        return __( 'Job Application Form', 'quillforms' );
    }

    public function get_short_description() {
        return __( 'A form to apply for a job. This template includes a file upload block, a multiple choice block, and a phone block.', 'quillforms' );
    }

    public function get_long_description() {
        return __( 'This template is designed to gather information from candidates who want to apply for a job. It includes a file upload block, a multiple choice block, and a phone block to help you collect valuable insights from your candidates.', 'quillforms' );
    }

    /**
     * Get Template Link
     * 
     * @since @next
     */
    public function get_template_link() {
        return 'https://quillforms.com/forms/job-application-form/';
    }

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    public function get_template_screenshot() {
        // screenshot.png is at the same folder of this file
        return QUILLFORMS_PLUGIN_URL . 'includes/templates/job-application-form/screenshot.png';
    }


    /**
     * Get template data
     * 
     * @since @next
     */

    public function get_template_data() {
        return json_decode(
            file_get_contents(
                QUILLFORMS_PLUGIN_DIR . 'includes/templates/job-application-form/template.json'
            ),
            true
        );
    }

    public function get_required_addons() {
        return array (
            'fileblock',
            'opinionscaleblock'
        );
    }
}

Templates_Manager::instance()->register_template( new Job_Application_Form_Template() );