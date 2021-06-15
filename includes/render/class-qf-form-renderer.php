<?php
/**
 * Form Renderer: QF_Form_Renderer class.
 *
 * @package QuillForms
 * @since 1.0.0
 */

 defined( 'ABSPATH' ) || exit;

/**
 * Class QF_Form_Renderer is responsible for overriding single post page with the renderer template and enqueuing assets.
 *
 * @since 1.0.0
 */
class QF_Form_Renderer {


	/**
	 * Init method to initialize some hooks.
	 *
	 * @since 1.0.0
	 */
	public static function init() {

		// Overriding single post page with custom template.
		add_action( 'init', array( __CLASS__, 'template_include' ) );

		// Enqueuing assets to make the form render properly.
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ), 9999999 );
	}

	/**
	 * Our custom template to override single post page.
	 *
	 * @since 1.0.0
	 */
	public static function template_include() {
		add_filter( 'template_include', array( __CLASS__, 'template_loader' ) );
	}

	/**
	 * Load the template.
	 *
	 * @since 1.0.0
	 *
	 * @param string $template The template path.
	 *
	 * @return string The modified template
	 */
	public static function template_loader( $template ) {
		if ( is_singular( 'quill_forms' ) ) {
			return QF_PLUGIN_DIR . '/includes/render/renderer-template.php';
		}
		return $template;
	}

	/**
	 * Prepare form object to send it as a prop to FormRender component.
	 *
	 * @since 1.0.0
	 *
	 * @param int $form_id The form id.
	 */
	public static function prepare_form_object( $form_id ) {
		return  apply_filters(
			'quillforms_renderer_form_object',
			array(
				'blocks'   => QF_Core::get_blocks( $form_id ),
				'messages' => QF_Core::get_messages( $form_id ),
				'theme'    => QF_Core::get_theme( $form_id ),
			),
			$form_id
		);
	}

	/**
	 * Enqueue necessary assets to make the form work properly with React.
	 *
	 * @since 1.0.0
	 */
	public static function enqueue_assets() {
		if ( is_singular( 'quill_forms' ) ) :
			global $wp_scripts;
			global $wp_styles;
			global $post;
			QF_Core::register_block_types_by_js();

			$form_id           = $post->ID;
			$wp_scripts->queue = array( 'quillforms-renderer-core' );
			$wp_styles->queue  = array( 'quillforms-renderer-core' );

			$blocks = QF_Core::get_blocks( $form_id );

			// Render styles for used blocks only.
			foreach ( $blocks as $block ) {
				$block_type = QF_Blocks_Factory::get_instance()->get_registered( $block['name'] );
				if ( ! empty( $block_type ) && ! empty( $block_type->block_renderer_assets['style'] ) ) {
					$wp_styles->queue[] = $block_type->block_renderer_assets['style'];
				}
			}

			// Render scripts for used blocks only.
			foreach ( $blocks as $block ) {
				$block_type = QF_Blocks_Factory::get_instance()->get_registered( $block['name'] );
				if ( ! empty( $block_type ) && ! empty( $block_type->block_renderer_assets['script'] ) ) {
					$wp_scripts->queue[] = $block_type->block_renderer_assets['script'];
				}
			}
		endif;
	}

}

QF_Form_Renderer::init();
