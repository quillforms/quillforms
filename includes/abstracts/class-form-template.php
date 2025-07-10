<?php
/**
 * Templates API: Form_Template class.
 *
 * @since 1.0.0
 * @package QuillForms/Abstracts
 */

namespace QuillForms\Abstracts;

use stdClass;

/**
 * Abstract block class which defines some abstract methods that should be overriden
 * to create a block and defaut functions.
 *
 * @since 1.0.0
 */
abstract class Form_Template extends stdClass {


    /**
     * Constructor
     */
    public function __construct() {
        $this->name  = $this->get_name();
        $this->title = $this->get_title();
        $this->link  = $this->get_template_link();
        $this->screenshot = $this->get_template_screenshot();
        $this->data  = $this->get_template_data();
        $this->required_addons = $this->get_required_addons();
        $this->notes = $this->get_notes();
        $this->short_description = $this->get_short_description();
        $this->long_description = $this->get_long_description();
    }

	/**
	 * Get Template Name
	 * It must be unique name.
	 *
	 * @since 1.0.0
	 *
	 * @return string The template name
	 */
	abstract public function get_name();

	 /**
     * Get template title
     *
     * @since @next
     *
     * @return string
     */
    abstract public function get_title(); 


    /**
     * Get Template Short Description
     * 
     * @since @next
     */
    abstract public function get_short_description();

    /**
     * Get Template Long Description
     * 
     * @since @next
     */
    abstract public function get_long_description();

    
    /**
     * Get Template Link
     * 
     * @since @next
     */
    abstract public function get_template_link();

    /**
     * Get Template Screenshot
     * 
     * @since @next
     */
    abstract public function get_template_screenshot();


    /**
     * Get template data
     * 
     * @since @next
     */
    abstract public function get_template_data();

    /**
     * Get Notes
     * 
     * @next
     */
    public function get_notes() {
        return array();
    }
    
    /**
     * Get required addons
     * 
     * @since @next
     */
    public function get_required_addons() {
        return array();
    }
}
