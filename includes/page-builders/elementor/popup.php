<?php
namespace QuillForms\PageBuilders\Elementor;
use Elementor\Widget_Base;
use WP_Query;

class QuillForms_Popup_Widget extends Widget_Base {

    // Widget name
    public function get_name() {
        return 'quillforms-popup-widget';
    }

    // Widget title
    public function get_title() {
        return 'QuillForms Popup';
    }


    // Widget categories
    public function get_categories() {
        return ['general'];
    }

    // Widget controls
    protected function _register_controls() {


        // Add controls for custom attributes
        $this->start_controls_section(
            'section_content',
            [
                'label' => 'Select Form',
            ]
        );
        $this->add_control(
            'form_id',
            [
                'label' => 'Form',
                'type' => \Elementor\Controls_Manager::SELECT2,
                'options' => $this->get_quill_forms(),
                'default' => '',
                'label_block' => true,
            ]
        );
        $this->end_controls_section();



        $this->start_controls_section(
            'popup_settings',
            [
                'label' => 'Popup Settings',
            ]
        );

        // Add control for Popup Title
        $this->add_control(
            'button_title',
            [
                'label' => 'Button Title',
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => 'Open Form',
            ]
        );

        // Add control for Button Background Color
        $this->add_control(
            'button_bg_color',
            [
                'label' => 'Button Background Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#000000',
            ]
        );

        // Add control for Button Text Color
        $this->add_control(
            'button_text_color',
            [
                'label' => 'Button Text Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#ffffff',
            ]
        );

        // Add control for Button Border Radius
        $this->add_control(
            'button_border_radius',
            [
                'label' => 'Button Border Radius',
                'type' => \Elementor\Controls_Manager::NUMBER,
                'min' => 0,
                'step' => 1,
                'default' => 24,
            ]
        );

        // Add control for Button Border Width
        $this->add_control(
            'button_border_width',
            [
                'label' => 'Button Border Width',
                'type' => \Elementor\Controls_Manager::NUMBER,
                'min' => 0,
                'step' => 1,
                'default' => 0,
            ]
        );

        // Add control for Button Border Color
        $this->add_control(
            'button_border_color',
            [
                'label' => 'Button Border Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#000000',
            ]
        );

        // Add control for Button Font Size
        $this->add_control(
            'button_font_size',
            [
                'label' => 'Button Font Size',
                'type' => \Elementor\Controls_Manager::NUMBER,
                'min' => 1,
                'step' => 1,
                'default' => 16,
            ]
        );

        //Add control for Button Padding
        $this->add_control(
            'button_padding',
            [
                'label' => 'Button Padding',
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%', 'em'],
                'selectors' => [
                    '{{WRAPPER}} .quillforms-popup-button' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
                'default' => [
                    'top' => '10',
                    'right' => '20',
                    'bottom' => '10',
                    'left' => '20',
                    'unit' => 'px',
                    'isLinked' => false
                ],

            ]
        );    
        $this->end_controls_section();
    }


    /**
     * Retrieve Quill Forms
     */
    private function get_quill_forms() {
        $forms = [];

        $query = new WP_Query([
            'post_type' => 'quill_forms',
            'posts_per_page' => -1,
            'post_status' => 'publish'
        ]);

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $forms[get_the_ID()] = get_the_title();
            }
        }

        wp_reset_postdata();

        return $forms;
    }

    // Widget render output
    protected function render() {
        // Get the widget settings
        $settings = $this->get_settings_for_display();

        $button_padding =  $settings['button_padding']['top'] . $settings['button_padding']['unit'] . ' '
                                            . $settings['button_padding']['right'] . $settings['button_padding']['unit'] . ' '
                                            . $settings['button_padding']['bottom'] . $settings['button_padding']['unit'] . ' '
                                            . $settings['button_padding']['left'] . $settings['button_padding']['unit'];
        // Generate the QuillForms popup shortcode with the custom attributes
        $shortcode = '[quillforms-popup id="' . $settings['form_id'] . '" buttontitle="' . $settings['button_title'] . '" buttonBackgroundColor="' . $settings['button_bg_color'] . '" buttonTextColor="' . $settings['button_text_color'] . '" buttonBorderRadius="' . $settings['button_border_radius'] . '" buttonBorderWidth="' . $settings['button_border_width'] . '" buttonBorderColor="' . $settings['button_border_color'] . '" buttonFontSize="' . $settings['button_font_size']
        . '" buttonPadding="' . $button_padding . '"]';

        // Output the generated shortcode
        echo do_shortcode($shortcode);
    }
}