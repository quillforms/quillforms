<?php 
namespace QuillForms;
use QuillForms\Abstracts\Form_Template;
use QuillForms\Managers\Templates_Manager;

class Web_Design_Cost_Calculator_Template extends Form_Template {

    /**
     * Get template name
     *
     * @since @next
     *
     * @return string
     */
    public function get_name() {
        return 'web-design-cost-calculator';
    }   

    /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    public function get_title() {
        return __( 'Web Design Cost Calculator', 'quillforms' );
    }

    public function get_short_description() {
        return __( 'A form to calculate the cost of a web design. This template includes a multiple choice block, a phone block, and a file upload block.', 'quillforms' );
    }

    public function get_long_description() {
        return __( 'This template is designed to gather information from visitors who want to calculate the cost of a web design. It includes a multiple choice block, a phone block, and a file upload block to help you collect valuable insights from your visitors.', 'quillforms' );
    }

    /**
     * Get Template Link
     * 
     * @since @next
     */
    public function get_template_link() {
        return 'https://quillforms.com/forms/web-design-cost-calculator/';
    }

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    public function get_template_screenshot() {
        // screenshot.png is at the same folder of this file
        return QUILLFORMS_PLUGIN_URL . 'includes/templates/web-design-cost-calculator/screenshot.png';
    }


    /**
     * Get template data
     * 
     * @since @next
     */

    public function get_template_data() {
        return json_decode(
            file_get_contents(
                QUILLFORMS_PLUGIN_DIR . 'includes/templates/web-design-cost-calculator/template.json'
            ),
            true
        );
    }

    public function get_required_addons() {
        return array (
            'logic',
            'phoneblock',
            'customthankyouscreenblock'
        );
    }
}

Templates_Manager::instance()->register_template( new Web_Design_Cost_Calculator_Template() );