<?php
the_post();
$form_id     = get_the_ID();
$form_object = QF_Form_Renderer::prepare_form_object( $form_id );
$theme       = $form_object['theme'];
$font        = $theme['font'];
$font_type   = QF_Fonts::get_font_type( $font );
$font_url    = null;
switch ( $font_type ) {
	case 'googlefonts':
		$font_url =
			'https://fonts.googleapis.com/css?family=' .
			$font .
			':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';

		break;

	case 'earlyaccess':
		$font_lower_case = strtolower( $font );
		$font_url        =
			'https://fonts.googleapis.com/earlyaccess/' + $font_lower_case + '.css';
		break;
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
		<?php if ( $font_url ) { ?>
			<link href="<?php echo $font_url; ?>" rel="stylesheet" />
		<?php } ?>

		<title><?php echo get_the_title(); ?></title>

		<?php wp_head(); ?>
	</head>
	<body>
		<div id="quillforms-renderer">
		</div>
			<?php wp_footer(); ?>
		<script>ReactDOM.render(React.createElement(
		qf.rendererCore.Form,
		{
			formObj: JSON.parse(JSON.stringify(<?php echo json_encode( $form_object ); ?>)),
			onSubmit: function() {
				var ajaxurl = '<?php echo admin_url( 'admin-ajax.php' ); ?>';
				const data = new FormData();
				data.append( 'action', 'quillforms_form_submit' );
				data.append( '_nonce', '<?php echo wp_create_nonce( 'quillforms_forms_display_nonce' ); ?>' )
				data.append( 'formData', JSON.stringify({
					answers: wp.data.select('quillForms/renderer-submission').getAnswersValues(),
					formId: '<?php echo $form_id; ?>'
				} ));
				fetch(ajaxurl, {
					method: 'POST',
					credentials:'same-origin',
					body: data
				})
				.then((resp) => resp.json())
				.then(function(res) {
					if(res && res.success) {
						wp.data.dispatch('quillForms/renderer-core').completeForm();
					}
					else {
						if( res && res.data ) {
							if(res.data.fields) {
								Object.keys(res.data.fields).forEach(function(fieldId, index) {
									wp.data.dispatch('quillForms/renderer-submission').setIsFieldValid(fieldId, false)
									wp.data.dispatch('quillForms/renderer-submission').setFieldValidationErrr(fieldId, res.data.fields[fieldId]);

								});
								var walkPath = wp.data.select('quillForms/renderer-core').getWalkPath();
								var firstFieldIndex = walkPath.findIndex( function( o )  {
									return Object.keys(res.data.fields).includes( o.id )
								});
								if ( firstFieldIndex !== -1 ) {
									wp.data.dispatch('quillForms/renderer-core').goToField( walkPath[ firstFieldIndex ].id );
								}
							}
						}
					}
				}).catch(function(err) {
					console.log(err);
				});

			}
		}
		), document.getElementById('quillforms-renderer')) </script>

	</body>
<html>
<?php
wp_reset_postdata();
