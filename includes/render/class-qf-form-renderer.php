<?php
class QF_Form_Renderer {


	public static function init() {

		add_action( 'init', array( __CLASS__, 'template_include' ) );

		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ), 9999999 );

	}

	public static function template_include() {
		add_filter( 'template_include', array( __CLASS__, 'template_loader' ) );
	}

	public static function template_loader( $template ) {
		global $wp_query;
		if ( is_singular( 'quill_forms' ) ) {
			return QF_PLUGIN_DIR . '/includes/render/renderer-template.php';
		}

		return $template;

	}

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
				$block_type         = QF_Blocks_Factory::get_instance()->get_registered( $block['name'] );
				$wp_styles->queue[] = $block_type->block_renderer_assets['style'];
			}

			// Render scripts for used blocks only.
			foreach ( $blocks as $block ) {
				$block_type          = QF_Blocks_Factory::get_instance()->get_registered( $block['name'] );
				$wp_scripts->queue[] = $block_type->block_renderer_assets['script'];
			}
		endif;
	}

}

QF_Form_Renderer::init();
