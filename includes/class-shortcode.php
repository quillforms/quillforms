<?php
/**
 * Class Shortcode
 *
 * @since 1.11.0
 * @package QuillForms
 */

namespace QuillForms;

/**
 * Shortcode Class
 *
 * @since 1.11.0
 */
class Shortcode {

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
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.11.0
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register' ) );
	}

	/**
	 * Register [quillforms] shortcode
	 *
	 * @since 1.11.0
	 *
	 * @return void
	 */
	public function register() {
		add_shortcode( 'quillforms', array( $this, 'handler' ) );
	}

	/**
	 * Handle shortcode render
	 *
	 * @since 1.11.0
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string
	 */
	public function handler( $atts ) {
		$atts = shortcode_atts(
			array(
				'id'     => null,
				'width'  => '100%',
				'height' => '500px',
			),
			$atts,
			'quillforms'
		);

		$id     = (int) $atts['id'];
		$width  = $atts['width'];
		$height = $atts['height'];

		if ( 'quill_forms' !== get_post_type( $id ) ) {
			return 'Invalid form id';
		}

		$src = get_permalink( $id );
		$src = add_query_arg(
			array(
				'quillforms-shortcode'   => true,
				'quillforms-redirection' => 'top', // @deprecated 1.11.1
			),
			$src
		);
		return "<iframe src='$src' width='$width' height='$height' style='border:0;'></iframe>";
	}

}
