<?php
/**
 * Renderer Template.
 *
 * @since 1.0.0
 * @package QuillForms
 */
use QuillForms\Render\Form_Renderer;

defined( 'ABSPATH' ) || exit;
$form_object = Form_Renderer::instance()->prepare_form_object(get_the_ID());
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
			#quillforms-renderer ~ *:not(#qf-recaptcha) {
				display: none !important;
			}
			* {
				box-sizing: border-box;
			}
			#loading-spinner {
				display: block;
				margin: 0 auto;
				-webkit-animation: loading-spinner-spin 2s linear infinite;
						animation: loading-spinner-spin 2s linear infinite;
				will-change: transform;
			}

			@-webkit-keyframes loading-spinner-spin {
				from {
					transform: rotate(0deg);
				}
				to {
					transform: rotate(360deg);
				}
				}

				@keyframes loading-spinner-spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
				#loading-circle {
					stroke-dasharray: 105;
					stroke-dashoffset: 105;
					stroke-linecap: round;
					-webkit-animation: loading-spinner-small 1.7s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
							animation: loading-spinner-small 1.7s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
					transform: translateZ(0);
					transform-origin: center;
					will-change: stroke-dashoffset;
				}

				@-webkit-keyframes loading-spinner-small {
					0% {
						stroke-dashoffset: 95;
						transform: scaleY(1);
					}
					49.99% {
						stroke-dashoffset: 0;
						transform: scaleY(1);
					}
					50% {
						stroke-dashoffset: 0;
						transform: scaleY(-1) rotate(25deg);
					}
					100% {
						stroke-dashoffset: 95;
						transform: scaleY(-1) rotate(-32deg);
					}
				}

				@keyframes loading-spinner-small {
					0% {
						stroke-dashoffset: 95;
						transform: scaleY(1);
					}
					49.99% {
						stroke-dashoffset: 0;
						transform: scaleY(1);
					}
					50% {
						stroke-dashoffset: 0;
						transform: scaleY(-1) rotate(25deg);
					}
					100% {
						stroke-dashoffset: 95;
						transform: scaleY(-1) rotate(-32deg);
					}
				}
				#loading-circle-meduim {
					stroke-dasharray: 160;
					stroke-dashoffset: 160;
					stroke-linecap: round;
					-webkit-animation: loading-spinner-meduim 1.7s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
							animation: loading-spinner-meduim 1.7s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
					transform: translateZ(0);
					transform-origin: center;
					will-change: stroke-dashoffset;
				}

		</style>
		<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
		<title><?php echo get_the_title(); ?></title>
		<?php do_action( 'wp_enqueue_scripts' ); ?>
	</head>
	<body>
		<div id="quillforms-renderer">
			<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%">
				<svg id="loading-spinner" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle id="loading-circle" cx="20" cy="20" r="18" stroke="<?php echo $form_object['theme']['questionsColor']; ?>" stroke-width="4" />
				</svg>
			</div>
		</div>
		<?php wp_footer(); ?>
	</body>
</html>
<?php
