<?php
/**
 * Renderer Template.
 *
 * @since   1.0.0
 * @package QuillForms
 */
use QuillForms\Render\Form_Renderer;
use TinyColor\TinyColor;
use QuillForms\Site\License;
use QuillForms\Settings;

defined( 'ABSPATH' ) || exit;
$form_object = Form_Renderer::instance()->prepare_form_object( get_the_ID() );
$license = License::instance()->get_license_info();
$disable_indexing = Settings::get( 'disable_indexing' );

?>
<!DOCTYPE html>
<html style="margin-top: 0 !important;" dir="<?php echo is_rtl() ? 'rtl' : 'ltr'; ?>" 
	lang="<?php echo get_locale(); ?>" >
	<head>
		<link rel="shortcut icon" href="<?php echo apply_filters('quillforms_favicon', esc_url( get_site_icon_url() ) ); ?>" />
		<style>
			html, body {
				position: relative !important;
				margin-top: 0 !important;
				margin-bottom: 0 !important;
				margin-right: 0 !important;
				margin-left: 0 !important;
				padding-top: 0 !important;
				padding-bottom: 0 !important;
				padding-right: 0 !important;
				padding-left: 0 !important;
				box-sizing: border-box;
				width: 100%;
				min-width: 100%;
				max-width: 100%;
				height: 100%;
				max-height: 100%;
				min-height: 100%;
				overflow: hidden !important;

			}
			#quillforms-renderer {
				position: absolute;
				top: 0;
				bottom: 0;
				right: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			#quillforms-renderer ~ *:not(#qf-recaptcha):not(.razorpay-container):not(.weglot-dropdown) {
				display: none !important;
			}
			* {
				box-sizing: border-box;
			}

			.qf-loader-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				background-color: <?php echo $form_object['theme']['backgroundColor']; ?>;
				justify-content: center;
				width: 100%;
				height: 100%
			}

			.qf-loader-container .qf-logo-container {
				margin-bottom: 30px;
			}
			.qf-loader-container .qf-logo-container .qf-logo {
				max-width: 150px;
				max-height: 150px;
			}

			.qf-loader-container .quillforms-branding-powered-by {
				margin-top: 20px;
				font-family: "<?php echo $form_object['theme']['font']; ?>";
				display: 'none';
			}

			.qf-loader-container .quillforms-branding-powered-by a {
				text-decoration: none !important;
				color: <?php echo $form_object['theme']['questionsColor']; ?> !important;
			}

			
			.qf-loader-container #loading-circle {
				width: 40px;
				height: 40px;
				border: 4px rgba(0,0,0,0) solid;
				border-top: 4px <?php echo $form_object['theme']['questionsColor']; ?> solid;
				border-radius: 50%;
				animation: spin-circle .8s infinite linear;
			}

			@-webkit-keyframes spin-circle {
				from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
			}

			@keyframes spin-circle {
				from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
			}
		</style>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1, viewport-fit=cover" name="viewport">
		<meta name="robots" content="<?php echo $disable_indexing ? 'noindex' : 'index'; ?>">
		<title><?php echo get_the_title(); ?></title> 
		<?php echo do_action( 'quillforms_head' ); ?>
		<?php do_action( 'wp_enqueue_scripts' ); ?>
		<?php if( defined ( 'WEGLOT_VERSION' ) ) {
			 $api_key = weglot_get_option( 'api_key' );
			 ?>
			 <script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
			 <script>
				 Weglot.on("initialized", () => Weglot.switchTo( "<?php echo esc_js(weglot_get_current_language()); ?>"))
	 
				 Weglot.initialize({
					 api_key: '<?php echo esc_js($api_key); ?>',
				 });
			 </script>
			 <?php
		} ?>
	</head>
	<body>
		<div id="quillforms-renderer">
			<div class="qf-loader-container">
				<?php if ( isset( $form_object['theme']['logo'] ) && isset( $form_object['theme']['logo']['src'] ) ) { ?>
					<div class="qf-logo-container">
						<img class="qf-logo" src="<?php echo $form_object['theme']['logo']['src']; ?>" />
					</div>

				<?php } ?>
				<div id="loading-circle"></div>
				<!-- <div class="quillforms-branding-powered-by">
					<a href="https://quillforms.com" target="_blank">
						Powered by Quill Forms
					</a>
				</div> -->
			</div>
		</div>
		<?php wp_footer(); ?>
	</body>
</html>
<?php
