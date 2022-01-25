<?php
/**
 * Renderer Template.
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms\Render;


defined( 'ABSPATH' ) || exit;
the_post();
$form_id     = get_the_ID();
$form_object = Form_Renderer::instance()->prepare_form_object();
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

		<?php wp_head(); ?>
	</head>
	<body>
		<div id="quillforms-renderer">
		</div>
			<?php wp_footer(); ?>
		<script>
		var formObject = <?php echo wp_json_encode( $form_object ); ?>;
		ReactDOM.render(React.createElement(
		qf.rendererCore.Form,
		{
			formObj: formObject,
			formId: <?php echo $form_id; ?>,
			applyLogic: true,
			onSubmit: function() {
				var ajaxurl = '<?php echo admin_url( 'admin-ajax.php' ); ?>';
				var data = new FormData();
				data.append( 'action', 'quillforms_form_submit' );
				data.append( 'formData', JSON.stringify({
					answers: wp.data.select('quillForms/renderer-core').getAnswers(),
					formId: '<?php echo esc_js( $form_id ); ?>'
				} ));
				fetch(ajaxurl, {
					method: 'POST',
					credentials:'same-origin',
					body: data
				})
				.then( function(response) {
					if (!response.ok) {
						return Promise.reject(response);
					}
					return response.json();
				})
				.then(function(res) {
					if(res && res.success) {
						// In case of successful submission, complete the form.
						wp.data.dispatch('quillForms/renderer-core').completeForm();
					}
					else {
						if( res && res.data ) {
							if(res.data.fields) {
								// In case of fields error from server side, set their valid flag with false and set their validation error.
								Object.keys(res.data.fields).forEach(function(fieldId, index) {
									wp.data.dispatch('quillForms/renderer-core').setIsFieldValid(fieldId, false)
									wp.data.dispatch('quillForms/renderer-core').setFieldValidationErr(fieldId, res.data.fields[fieldId]);

								});
								var walkPath = wp.data.select('quillForms/renderer-core').getWalkPath();
								var firstFieldIndex = walkPath.findIndex( function( o )  {
									return Object.keys(res.data.fields).includes( o.id )
								});
								// Get the first invalid field and go back to it.
								if ( firstFieldIndex !== -1 ) {
									wp.data.dispatch('quillForms/renderer-core').setIsReviewing(true);
									wp.data.dispatch('quillForms/renderer-core').setIsSubmitting(false);
									wp.data.dispatch('quillForms/renderer-core').goToBlock( walkPath[ firstFieldIndex ].id );
								}
							}
						}
					}
				}).catch(function(err) {
					if(err && err.status === 500) {
						// Server error = 500
						wp.data.dispatch('quillForms/renderer-core').setSubmissionErr(formObject['messages']['label.errorAlert.serverError']);
					}
					else {
						// Any other error.
						// @todo may be worth checking if there are some other types of errors.
						// There should be some other of types like invalid nonce field, or spam detected.
						// but this is enough for the moment.
						wp.data.dispatch('quillForms/renderer-core').setSubmissionErr(formObject['messages']['label.errorAlert.noConnection']);

					}
				});

			}
		}
		), document.getElementById('quillforms-renderer')) </script>

	</body>
</html>
<?php
