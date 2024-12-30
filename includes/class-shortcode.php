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
        if (!self::$instance) {
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
        add_action('init', array($this, 'register'));
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
        add_shortcode('quillforms', array($this, 'handler'));
        add_shortcode('quillforms-popup', array($this, 'popup_handler'));
    }

    /**
     * Handle shortcode render
     *
     * @since 1.11.0
     *
     * @param  array $atts Shortcode attributes.
     * @return string
     */
    public function handler($atts)
    {
        $atts = shortcode_atts(
            array(
                'id'         => null,
                'width'      => '100%',
                'min_height' => null,
                'max_height' => null,
                'height'     => null,
            ),
            $atts,
            'quillforms'
        );

        $id = (int) $atts['id'];
        $width = esc_attr($atts['width']);
        $height = esc_attr($atts['height']);
        $min_height = esc_attr($atts['min_height']);
        $max_height = esc_attr($atts['max_height']);

        if (!$min_height && $height) {
            $min_height = $height;
        }
        if (!$min_height) {
            $min_height = "500px";
        }
        if (!$max_height && $height) {
            $max_height = $height;
        }
        if (!$max_height) {
            $max_height = 'auto';
        }
        if ('quill_forms' !== get_post_type($id)) {
            return esc_html__('Invalid form ID', 'quillforms');
        }

        $src = get_permalink($id);
        $src = esc_url(
            add_query_arg(
                array(
                    'quillforms-shortcode'   => true,
                    'quillforms-redirection' => 'top', // @deprecated 1.11.1
                ),
                $src
            )
        );

        // wp_enqueue_script('quillforms-iframe-resizer');
        wp_enqueue_script('quillforms-iframe-resizer-implementer');

        return sprintf(
            "<iframe data-max-height='%s' class='quillforms-iframe' scrolling='no' src='%s' width='%s' style='border:0;min-height:%s;max-height:%s'></iframe>",
            esc_attr($max_height),
            $src,
            esc_attr($width),
            esc_attr($min_height),
            esc_attr($max_height)
        );
    }

    /**
     * Handle popup shortcode render
     *
     * @since 2.12.0
     *
     * @param  array $atts Shortcode attributes.
     * @return string
     */

    public function popup_handler($atts)
    {
        // Enqueue jQuery first
        wp_enqueue_script('jquery');
        wp_enqueue_script('quillforms-popup', quillforms_url('includes/render/popup.js'), array('jquery'), QUILLFORMS_VERSION, true);
        wp_enqueue_style('quillforms-popup-style');

        $atts = shortcode_atts(
            array(
                'id'                   => null,
                'buttontitle'          => 'Open Form',
                'buttonbackgroundcolor' => '#000000',
                'buttontextcolor'      => '#ffffff',
                'buttonborderradius'   => '24',
                'buttonborderwidth'    => '0',
                'buttonbordercolor'    => '#000000',
                'buttonfontsize'       => '16',
                'buttonpadding'        => '10px 20px',
                'popupmaxwidth'        => '90',
                'popupmaxwidthunit'    => '%',
                'popupmaxheight'       => '90',
                'popupmaxheightunit'   => '%',
            ),
            $atts,
            'quillforms-popup'
        );

        $id = (int) $atts['id'];
        if ('quill_forms' !== get_post_type($id)) {
            return esc_html__('Invalid form ID', 'quillforms');
        }

        // Properly escape the button title
        $buttonTitle = wp_kses_post($atts['buttontitle']);
        
        // Rest of your attributes escaping...
        $buttonBackgroundColor = esc_attr($atts['buttonbackgroundcolor']);
        $buttonTextColor = esc_attr($atts['buttontextcolor']);
        $buttonBorderRadius = (int) $atts['buttonborderradius'];
        $buttonBorderWidth = (int) $atts['buttonborderwidth'];
        $buttonBorderColor = esc_attr($atts['buttonbordercolor']);
        $buttonFontSize = (int) $atts['buttonfontsize'];
        $buttonPadding = esc_attr($atts['buttonpadding']);
        $popupMaxWidth = esc_attr($atts['popupmaxwidth']);
        $popupMaxWidthUnit = esc_attr($atts['popupmaxwidthunit']);
        $popupMaxHeight = esc_attr($atts['popupmaxheight']);
        $popupMaxHeightUnit = esc_attr($atts['popupmaxheightunit']);

        $src = esc_url(
            add_query_arg(
                array(
                    'quillforms-shortcode'   => true,
                    'quillforms-redirection' => 'top',
                ),
                get_permalink($id)
            )
        );

        // Use wp_kses to allow only specific HTML tags if needed
        $buttonHtml = wp_kses($buttonTitle, array(
            'strong' => array(),
            'em' => array(),
            'span' => array('class' => array()),
            'br' => array()
        ));

        return '<div class="quillforms-popup-button-wrapper">
            <a class="quillforms-popup-button" style="
                background-color: ' . $buttonBackgroundColor . ';
                color: ' . $buttonTextColor . ';
                border-radius: ' . $buttonBorderRadius . 'px;
                border-width: ' . $buttonBorderWidth . 'px;
                border-color: ' . $buttonBorderColor . ';
                font-size: ' . $buttonFontSize . 'px;
                padding: ' . $buttonPadding . ';
                text-decoration: none;
                cursor: pointer;
                display: inline-block;
            "
            data-url="' . $src . '"
            data-formId="' . $id . '"
            >
                ' . $buttonHtml . '
                </a>
                <div class="quillforms-popup-overlay" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    pointer-events: none;
                    visibility: hidden;
                " data-formId="' . $id . '">
                    <div class="quillforms-popup-container" style="
                        max-width: ' . $popupMaxWidth . $popupMaxWidthUnit . ';
                        max-height: ' . $popupMaxHeight . $popupMaxHeightUnit . ';
                        width: 100%;
                        height: 100%;
                    ">
                        <div class="quillforms-popup-close">
                            <svg fill="currentColor" height="32" width="32" viewBox="0 0 24 24" style="display: inline-block; vertical-align: middle;">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                            </svg>
                        </div>
                        <div class="quillforms-popup-iframe-wrapper">
                            <iframe data-no-lazy="true" src="' . $src . '" width="100%" height="100%" style="border:0;max-height:auto !important; max-width:auto !important;"></iframe>
                            <div class="quillforms-popup-loader"><div class="quillforms-loading-circle"></div></div>
                        </div>
                    </div>
                </div>
            </div>';
        }
    }