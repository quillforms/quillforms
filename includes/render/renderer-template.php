<?php
/**
 * Renderer Template.
 *
 * @since   1.0.0
 * @package QuillForms
 */
use QuillForms\Render\Form_Renderer;
use TinyColor\TinyColor;

defined( 'ABSPATH' ) || exit;
$form_object = Form_Renderer::instance()->prepare_form_object( get_the_ID() );

?>
<html style="margin-top: 0 !important;" dir="<?php echo is_rtl() ? 'rtl' : 'ltr'; ?>">
	<head>
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
			#quillforms-renderer ~ *:not(#qf-recaptcha):not(.razorpay-container) {
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
		<title><?php echo get_the_title(); ?></title>
		<?php do_action( 'wp_enqueue_scripts' ); ?>
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
			</div>
		</div>
		<?php wp_footer(); ?>
	</body>
</html>
<?php
