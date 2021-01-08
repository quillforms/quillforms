<?php
the_post();
/**
 * The Template for displaying form page
 *
 * QuillForms uses WordPress custom post type for the form and this is the template for
 * this single post type
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<html>
	<head>
		<style>
			html, body {
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
			* {
				box-sizing: border-box;
			}
		</style>
		<title><?php echo get_the_title(); ?></title>

		<?php wp_head(); ?>
	</head>
	<body>
		<?php
			$form_id     = get_the_ID();
			$form_object = QF_Form_Renderer::prepare_form_object( $form_id );
		?>

				<div id="quillforms-renderer">s
				</div>
					<?php wp_footer(); ?>
				<script>ReactDOM.render(React.createElement(
				qf.renderer.Form,
				{
					formObj: JSON.parse(JSON.stringify(<?php echo json_encode( $form_object ); ?>))
				}
				), document.getElementById('quillforms-renderer')) </script>

	</body>
		<html>
<?php
die;
