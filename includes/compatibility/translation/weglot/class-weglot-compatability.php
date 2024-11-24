<?php 
use WeglotWP\Actions\Front\Translate_Page_Weglot;
use WeglotWP\Third\CacheEnabler\Cache_Enabler_Cache;
use WeglotWP\Actions\Front\Front_Enqueue_Weglot;
class Weglot_Compatibility {
    /**
     * Constructor
     */
    public static function hooks() {
        add_action( 'quillforms_head', array( $this, 'load_all_Weglot_head_functions' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'load_all_Weglot_scripts' ), 99999999999999 );
    }

    /**
     * Load all Weglot functions
     */
    public static function load_all_Weglot_head_functions() {
        $translate_page = new Translate_Page_Weglot();
        $translate_page->weglot_href_lang();
        $translate_page->weglot_custom_settings();
        $cache_enabler = new Cache_Enabler_Cache();
        $cache_enabler->buffer_start();
    }

    /**
     * Load all Weglot scripts
     */
    public static function load_all_Weglot_scripts() {
        $front_enqueuer = new Front_Enqueue_Weglot();
        $front_enqueuer->weglot_wp_enqueue_scripts();
    }
}

Weglot_Compatibility::hooks();