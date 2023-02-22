<?php
/**
 * Class Shortcode
 *
 * @since   1.11.0
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Shortcode Class
 *
 * @since 1.11.0
 */
class Shortcode
{

    /**
     * Class instance
     *
     * @var self instance
     */
    private static $instance = null;

    /**
     * Get class instance
     *
     * @return self
     */
    public static function instance()
    {
        if (! self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     *
     * @since 1.11.0
     */
    private function __construct()
    {
        add_action('init', array( $this, 'register' ));
    }

    /**
     * Register [quillforms] shortcode
     *
     * @since 1.11.0
     *
     * @return void
     */
    public function register()
    {
        add_shortcode('quillforms', array( $this, 'handler' ));
    }

    /**
     * Handle shortcode render
     *
     * @since 1.11.0
     *
     * @param  array $atts Shortcode attributes.
     * @return string
     */
    public function handler( $atts )
    {
        $atts = shortcode_atts(
            array(
            'id'     => null,
            'width'  => '100%',
            ),
            $atts,
            'quillforms'
        );

        $id     = (int) $atts['id'];
        $width  = isset($atts['width']) ? $atts['width'] : '100%';
        $height = isset($atts['height']) ? $atts['height'] : null;
        $min_height = isset($atts['minHeight']) ? $atts['minHeight'] : null;
        $max_height = isset($atts['maxHeight']) ? $atts['maxHeight'] : null;
        if(!$min_height && $height) {
            $min_height = $height;
        }
        if (!$min_height) {
            $min_height = "500px";
        }
        if(!$max_height && $height) {
            $max_height = $height;
        }
        if(!$max_height) {
            $max_height = 'auto';
        }
        if ('quill_forms' !== get_post_type($id) ) {
            return 'Invalid form id';
        }

        $src = get_permalink($id);
        $src = add_query_arg(
            array(
            'quillforms-shortcode'   => true,
            'quillforms-redirection' => 'top', // @deprecated 1.11.1
            ),
            $src
        );
        // wp_enqueue_script('quillforms-iframe-resizer');
        wp_enqueue_script('quillforms-iframe-resizer-implementer');

        return "<iframe  data-max-height='$max_height' class='quillforms-iframe' scrolling='no' src='$src' width='$width' style='border:0;min-height:$min_height; max-height: $max_height'></iframe>";

    }

}
