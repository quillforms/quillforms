<?php
class QF_Form_Renderer {


	public static function init() {
		add_filter( 'template_include', array( __CLASS__, 'template_loader' ) );

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
		// add_action('wp_footer', 'wp_auth_check_html', 30);
		// add_action('wp_footer', [$this, 'wp_footer']);

		// Handle `wp_enqueue_scripts`.
		remove_all_actions( 'wp_enqueue_scripts' );

		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ), 9999999 );

	}

	public static function template_loader( $template ) {

		return QF_PLUGIN_DIR . '/includes/renderer-template.php';

		return $template;

	}

	public static function prepare_form_object( $form_id ) {
		return  apply_filters(
			'quillforms_renderer_form_object',
			array(
				'blocks'   => self::get_blocks( $form_id ),
				'messages' => self::get_messages( $form_id ),
				'theme'    => self::get_theme( $form_id ),
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
							return array_merge(
								array(
									'id'         => QF_Utils::generate_uuidv4(),
									'name'       => $block->block_name,
									'attributes' => $block->prepare_attributes_for_render( $block->attributes ),
								),
								array(
									'supports'         => $block->supported_features,
									'logicalOperators' => $block->get_logical_operators(),
								)
							);
						},
						QF_Blocks_Factory::get_instance()->get_all_registered()
					)
				) . ')',
				'after'
			);

			$form_id           = $post->ID;
			$wp_scripts->queue = array( 'quillforms-renderer' );
			$wp_styles->queue  = array( 'quillforms-renderer' );

			$blocks = self::get_blocks( $form_id );
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

	public static function get_blocks( $form_id ) {
		$blocks = get_post_meta( $form_id, 'blocks', true );
		$blocks = $blocks ? $blocks : array();
		return $blocks;
	}

	public static function get_messages( $form_id ) {
		return get_post_meta( $form_id, 'messages', true );
	}

	public static function get_theme( $form_id ) {
		$theme_id  = get_post_meta( $form_id, 'theme_id', true );
		$theme_obj = QF_Form_Theme_Model::get_theme( $theme_id );
		if ( ! $theme_obj ) {
			$theme = QF_Form_Theme::get_instance()->prepare_theme_properties_for_render();
		} else {
			$theme = $theme_obj['properties'];
		}
		return $theme;
	}

}
QF_Form_Renderer::init();
