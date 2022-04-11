( function () {
	var formObject = wp.hooks.applyFilters(
		'QuillForms.Renderer.FormObject',
		qfRender.formObject
	);

	ReactDOM.render(
		React.createElement( qf.rendererCore.Form, {
			formObj: formObject,
			formId: qfRender.formId,
			applyLogic: true,
			onSubmit: function () {
				var ajaxurl = qfRender.ajaxurl;
				var formData = {
					answers: wp.data
						.select( 'quillForms/renderer-core' )
						.getAnswers(),
					formId: qfRender.formId,
				};
				formData = wp.hooks.applyFilters(
					'QuillForms.Renderer.SubmissionFormData',
					formData,
					{ formObject }
				);
				var data = new FormData();
				data.append( 'action', 'quillforms_form_submit' );
				data.append( 'formData', JSON.stringify( formData ) );
				fetch( ajaxurl, {
					method: 'POST',
					credentials: 'same-origin',
					body: data,
				} )
					.then( function ( response ) {
						if ( ! response.ok ) {
							return Promise.reject( response );
						}
						return response.json();
					} )
					.then( function ( res ) {
						if ( res && res.success ) {
							// In case of successful submission, complete the form.
							wp.data
								.dispatch( 'quillForms/renderer-core' )
								.completeForm();
							wp.hooks.doAction(
								'QuillForms.Render.FormSubmitted',
								{ formId: qfRender.formId }
							);
						} else {
							if ( res && res.data ) {
								if ( res.data.fields ) {
									// In case of fields error from server side, set their valid flag with false and set their validation error.
									Object.keys( res.data.fields ).forEach(
										function ( fieldId, index ) {
											wp.data
												.dispatch(
													'quillForms/renderer-core'
												)
												.setIsFieldValid(
													fieldId,
													false
												);
											wp.data
												.dispatch(
													'quillForms/renderer-core'
												)
												.setFieldValidationErr(
													fieldId,
													res.data.fields[ fieldId ]
												);
										}
									);
									var walkPath = wp.data
										.select( 'quillForms/renderer-core' )
										.getWalkPath();
									var firstFieldIndex = walkPath.findIndex(
										function ( o ) {
											return Object.keys(
												res.data.fields
											).includes( o.id );
										}
									);
									// Get the first invalid field and go back to it.
									if ( firstFieldIndex !== -1 ) {
										wp.data
											.dispatch(
												'quillForms/renderer-core'
											)
											.setIsReviewing( true );
										wp.data
											.dispatch(
												'quillForms/renderer-core'
											)
											.setIsSubmitting( false );
										wp.data
											.dispatch(
												'quillForms/renderer-core'
											)
											.goToBlock(
												walkPath[ firstFieldIndex ].id
											);
									}
								}
							}
						}
					} )
					.catch( function ( err ) {
						if ( err && err.status === 500 ) {
							// Server error = 500
							wp.data
								.dispatch( 'quillForms/renderer-core' )
								.setSubmissionErr(
									qfRender.formObj[ 'messages' ][
										'label.errorAlert.serverError'
									]
								);
						} else {
							// Any other error.
							// @todo may be worth checking if there are some other types of errors.
							// There should be some other of types like invalid nonce field, or spam detected.
							// but this is enough for the moment.
							wp.data
								.dispatch( 'quillForms/renderer-core' )
								.setSubmissionErr(
									formObject[ 'messages' ][
										'label.errorAlert.noConnection'
									]
								);
						}
					} );
			},
		} ),
		document.getElementById( 'quillforms-renderer' )
	);
} )();
