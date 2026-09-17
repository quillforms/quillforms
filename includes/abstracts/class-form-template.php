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
     * Map of lazily resolved properties to the method that provides each one.
     *
     * @since 5.7.3
     *
     * @var array<string, string>
     */
    private static $lazy_properties = array(
        'name'              => 'get_name',
        'title'             => 'get_title',
        'link'              => 'get_template_link',
        'screenshot'        => 'get_template_screenshot',
        'data'              => 'get_template_data',
        'required_addons'   => 'get_required_addons',
        'notes'             => 'get_notes',
        'short_description' => 'get_short_description',
        'long_description'  => 'get_long_description',
    );

    /**
     * Constructor.
     *
     * Deliberately does not resolve the properties below. Templates are
     * instantiated at include time during plugins_loaded, and these getters
     * return translated strings; calling them here loaded the textdomain before
     * init, which WordPress 6.7+ reports via _load_textdomain_just_in_time on
     * every request. They are resolved on first access instead, by which point
     * init has run.
     */
    public function __construct() {
    }

    /**
     * Resolve a template property on first access.
     *
     * @since 5.7.3
     *
     * @param string $name Property name.
     * @return mixed
     */
    public function __get( $name ) {
        if ( isset( self::$lazy_properties[ $name ] ) ) {
            // Assigning here means this runs once per property; later reads hit
            // the real property and never reach __get().
            $this->$name = $this->{ self::$lazy_properties[ $name ] }();
            return $this->$name;
        }

        return null;
    }

    /**
     * Whether a template property is available.
     *
     * Keeps isset()/empty() working for the lazily resolved properties.
     *
     * @since 5.7.3
     *
     * @param string $name Property name.
     * @return bool
     */
    public function __isset( $name ) {
        return isset( self::$lazy_properties[ $name ] );
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
