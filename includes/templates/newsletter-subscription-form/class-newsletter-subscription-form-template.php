<?php 
namespace QuillForms;
use QuillForms\Abstracts\Form_Template;
use QuillForms\Managers\Templates_Manager;

class Newsletter_Subscription_Form_Template extends Form_Template {

    /**
     * Get template name
     *
     * @since @next
     *
     * @return string
     */
    public function get_name() {
        return 'newsletter-subscription-form';
    }   

    /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    public function get_title() {
        return __( 'Newsletter Subscription Form', 'quillforms' );
    }

    public function get_short_description() {
        return __( 'A form to subscribe to a newsletter. This template includes a email block and a multiple choice block.', 'quillforms' );
    }

    public function get_long_description() {
        return __( 'This template is designed to gather information from subscribers who want to subscribe to a newsletter. It includes a email block and a multiple choice block to help you collect valuable insights from your subscribers.', 'quillforms' );
    }
    /**
     * Get Template Link
     * 
     * @since @next
     */
    public function get_template_link() {
        return 'https://quillforms.com/forms/newsletter-subscription-form/';
    }

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    public function get_template_screenshot() {
        // screenshot.png is at the same folder of this file
        return QUILLFORMS_PLUGIN_URL . 'includes/templates/newsletter-subscription-form/screenshot.png';
    }


    /**
     * Get template data
     * 
     * @since @next
     */

    public function get_template_data() {
        return json_decode(
            file_get_contents(
                QUILLFORMS_PLUGIN_DIR . 'includes/templates/newsletter-subscription-form/template.json'
            ),
            true
        );
    }

    public function get_required_addons() {
        return array (
           
        );
    }
}

Templates_Manager::instance()->register_template( new Newsletter_Subscription_Form_Template() );