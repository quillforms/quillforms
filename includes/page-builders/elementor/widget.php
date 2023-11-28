<?php
namespace QuillForms\PageBuilders\Elementor;
use Elementor\Widget_Base;
use WP_Query;

class QuillForms_Widget extends Widget_Base {

    /**
     * Widget Name
     */
    public function get_name() {
        return 'quillforms-widget';
    }

    /**
     * Widget Title
     */
    public function get_title() {
        return 'Quill Forms Widget';
    }

    /**
     * Widget Categories
     */
    public function get_categories() {
        return ['general'];
    }

    /**
     * Register Widget Controls
     */
    protected function _register_controls() {
        $this->start_controls_section(
            'section_content',
            [
                'label' => 'Content',
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

        // $this->add_control(
        //     'width',
        //     [
        //         'label' => 'Width',
        //         'type' => \Elementor\Controls_Manager::TEXT,
        //         'default' => '100%',
        //     ]
        // );

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

    /**
     * Render Widget Output on the frontend
     */
    protected function render() {
        $settings = $this->get_settings_for_display();

        $form_id = $settings['form_id'];

        if ($form_id) {
            echo do_shortcode("[quillforms id={$form_id} width='100%']");
        }
    }
}