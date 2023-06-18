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
        add_shortcode('quillforms-popup', array( $this, 'popup_handler' ));
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

    /**
     * Handle popup shortcode render
     *
     * @since 2.12.0
     *
     * @param  array $atts Shortcode attributes.
     * @return string
     */
    public function popup_handler( $atts ) {
        $atts = shortcode_atts(
            array(
                'id' => null,
                'buttontitle' => 'Open Form',
                'buttonbackgroundcolor' => '#000000',
                'buttontextColor' => '#ffffff',
                'buttonborderradius' => '24',
                'buttonborderwidth' => '0',
                'buttonbordercolor' => '#000000',
                'buttonfontsize' => '16',
                'buttonpadding' => '10px 20px',
            ),
            $atts,
            'quillforms-popup'
        );

        $id     = (int) $atts['id'];
        $buttonTitle = isset($atts['buttontitle']) ? $atts['buttontitle'] : 'Open Form';
        $buttonBackgroundColor = isset($atts['buttonbackgroundcolor']) ? $atts['buttonbackgroundcolor'] : '#000000';
        $buttonTextColor = isset($atts['buttontextcolor']) ? $atts['buttontextcolor'] : '#ffffff';
        $buttonBorderRadius = isset($atts['buttonborderradius']) ? $atts['buttonborderradius'] : '24';
        $buttonBorderWidth = isset($atts['buttonborderwidth']) ? $atts['buttonborderwidth'] : '0';
        $buttonBorderColor = isset($atts['buttonbordercolor']) ? $atts['buttonbordercolor'] : '#000000';
        $buttonFontSize = isset($atts['buttonfontsize']) ? $atts['buttonfontsize'] : '16';
        $buttonPadding = isset($atts['buttonpadding']) ? $atts['buttonpadding'] : '10px 20px';
        $permalink = get_permalink($id);
        if ('quill_forms' !== get_post_type($id) ) {
            return 'Invalid form id';
        }

        $src = add_query_arg(
            array(
                'quillforms-shortcode'   => true,
                'quillforms-redirection' => 'top', // @deprecated 1.11.1
            ),
            $permalink
        );

        wp_enqueue_script('quillforms-popup');
        wp_enqueue_style('quillforms-popup-style');
        return '<div class="quillforms-popup-button-wrapper">
            <a class="quillforms-popup-button" style="
                background-color: ' . $buttonBackgroundColor . ';
                color: ' . $buttonTextColor . ';
                border-radius: ' . $buttonBorderRadius . 'px;
                border-width: ' . $buttonBorderWidth . 'px;
                border-color: ' . $buttonBorderColor . ';
                font-size: ' . $buttonFontSize . 'px;
                padding: ' . $buttonPadding . ';
                text-deocration: none;
                cursor:pointer;
            "
                data-url="' . $src . '"
                data-formId="' . $id . '"
            >
                ' . $buttonTitle . '
            </a>
            <div class="quillforms-popup-overlay" data-formId="' . $id . '">
                <div class="quillforms-popup-container">
                    <div class="quillforms-popup-close">
                        <svg fill="currentColor" height="32" width="32" viewBox="0 0 24 24" style="display: inline-block; vertical-align: middle;"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                    </div>
                    <div class="quillforms-popup-iframe-wrapper">
                        <iframe src="' . $src . '" width="100%" height="100%" style="border:0;max-height: auto !important; max-width: auto !important;"></iframe>
                        <div class="quillforms-popup-loader"><div class="quillforms-loading-circle"></div></div>
                    </div>
                </div>
            </div>
            </div>';
    }

}
