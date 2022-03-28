<?php
/**
 * Renderer Template.
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms\Render;

use QuillForms\Form_Submission;

defined( 'ABSPATH' ) || exit;
the_post();
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
			#quillforms-renderer ~ * {
				display: none !important;
			}
			* {
				box-sizing: border-box;
			}
		</style>
		<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">
		<title><?php echo get_the_title(); ?></title>
		<?php do_action( 'wp_enqueue_scripts' ); ?>
	</head>
	<body>
		<div id="quillforms-renderer">
		</div>
		<script>
		<?php
		// TODO: check this. maybe it needs to be moved from here.
		$submission_id = $_GET['submission_id'] ?? null;
		$step          = $_GET['step'] ?? null;
		if ( $submission_id && 'payment' === $step ) {
			$form_submission = Form_Submission::instance();
			$restore         = $form_submission->restore_pending_submission( $submission_id );
			if ( $restore ) {
				?>
				window.pending_submission = <?php echo json_encode( $form_submission->get_pending_submission_renderer_data() ); ?>;
				<?php
			}
		}
		?>
		</script>

		<?php wp_footer(); ?>
	</body>
</html>
<?php
