<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
global $wp_scripts;
global $wp_version;


$body_classes = array(
	'quillforms-editor-active',
	'wp-version-' . str_replace( '.', '-', $wp_version ),
);

if ( is_rtl() ) {
	$body_classes[] = 'rtl';
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title><?php echo __( 'Quill Forms', 'quillforms' ) . ' | ' . get_the_title( $_REQUEST['form_id'] ); ?></title>

	<?php
	wp_head();
	wp_enqueue_style( 'quillforms-builder-core' );

	?>
	</head>
	<body class="<?php echo implode( ' ', $body_classes ); ?>">
		<?php wp_enqueue_script( 'quillforms-builder-core' ); ?>

		<noscript>You need to enable JavaScript to run this app.</noscript>
		<div id="quillforms-layout-wrapper"></div>
			<?php
				wp_footer();
			?>
				<?php
				/* This action is documented in wp-admin/admin-footer.php */
				do_action( 'admin_print_footer_scripts' );

				?>
	</body>

</html>
