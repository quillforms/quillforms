<?php 
namespace QuillForms;
use QuillForms\Abstracts\Form_Template;
use QuillForms\Managers\Templates_Manager;

class Customer_Satisfaction_Survey_Template extends Form_Template {

    /**
     * Get template name
     *
     * @since @next
     *
     * @return string
     */
    public function get_name() {
        return 'customer-satisfaction-survey';
    }   

    /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    public function get_title() {
        return __( 'Customer Satisfaction Survey', 'quillforms' );
    }

    public function get_short_description() {
        return __( 'A survey to evaluate customer satisfaction. This template includes a rating block and an opinion scale block.', 'quillforms' );
    }

    public function get_long_description() {
        return __( 'This template is designed to gather feedback from your customers about your products or services. It includes a rating block and an opinion scale block to help you collect valuable insights from your customers.', 'quillforms' );
    }

    /**
     * Get template description
     *
     * @since @next
     *
     * @return string
     */
    public function get_description() {
        return __( 'Get feedback from your customers about your products or services.', 'quillforms' );
    }

    /**
     * Get Template Link
     * 
     * @since @next
     */
    public function get_template_link() {
        return 'https://quillforms.com/forms/customer-satisfaction-survey/';
    }

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    public function get_template_screenshot() {
        // screenshot.png is at the same folder of this file
        return QUILLFORMS_PLUGIN_URL . 'includes/templates/customer-satisfaction-survey/screenshot.png';
    }


    /**
     * Get template data
     * 
     * @since @next
     */

    public function get_template_data() {
        return json_decode(
            file_get_contents(
                QUILLFORMS_PLUGIN_DIR . 'includes/templates/customer-satisfaction-survey/template.json'
            ),
            true
        );
    }

    public function get_required_addons() {
        return array (
            'ratingblock',
            'opinionscaleblock',
        );
    }
}

Templates_Manager::instance()->register_template( new Customer_Satisfaction_Survey_Template() );