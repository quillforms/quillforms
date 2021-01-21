<?php
class QF_Form_Renderer {


	public static function init() {

		add_action( 'init', array( __CLASS__, 'template_include' ) );

		add_filter( 'show_admin_bar', '__return_false' );

		// Remove all WordPress actions.
		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_print_styles' );
		remove_all_actions( 'wp_print_head_scripts' );
		remove_all_actions( 'wp_footer' );

		// Handle `wp_head`.
		add_action( 'wp_head', 'wp_enqueue_scripts', 1 );
		add_action( 'wp_head', 'wp_print_styles', 8 );
		add_action( 'wp_head', 'wp_print_head_scripts', 9 );
		add_action( 'wp_head', 'wp_site_icon' );

		// Handle `wp_footer`.
		add_action( 'wp_footer', 'wp_print_footer_scripts', 20 );

		// Handle `wp_enqueue_scripts`.
		remove_all_actions( 'wp_enqueue_scripts' );

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
			wp_add_inline_script(
				'quillforms-blocks',
				'qf.blocks.registerBlockType(' . wp_json_encode(
					array_map(
						function ( $block ) {
							return
								array(
									'name'             => $block->block_name,
									'attributes'       => $block->attributes_schema,
									'supports'         => $block->supported_features,
									'logicalOperators' => $block->get_logical_operators(),
								);
						},
						QF_Blocks_Factory::get_instance()->get_all_registered()
					)
				) . ')',
				'after'
			);

			$form_id           = $post->ID;
			$wp_scripts->queue = array( 'quillforms-renderer-core' );
			$wp_styles->queue  = array( 'quillforms-renderer-core' );

			$blocks = QF_Core::get_blocks( $form_id );
			// Render styles for used blocks only.
			foreach ( $blocks as $block ) {
				$block_type         = QF_Blocks_Factory::get_instance()->get_registered( $block['type'] );
				$wp_styles->queue[] = $block_type->block_styles['renderer'];
			}

			// Render scripts for used blocks only.
			foreach ( $blocks as $block ) {
				$block_type          = QF_Blocks_Factory::get_instance()->get_registered( $block['type'] );
				$wp_scripts->queue[] = $block_type->block_scripts['renderer'];
			}
		endif;
	}

}

QF_Form_Renderer::init();
