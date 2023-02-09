( function () {
	const formObject = wp.hooks.applyFilters(
		'QuillForms.Renderer.FormObject',
		qfRender.formObject
	);

	ReactDOM.render(
		React.createElement( qf.rendererCore.Form, {
			formObj: formObject,
			formId: qfRender.formId,
			applyLogic: true,
			onSubmit() {
				const ajaxurl = qfRender.ajaxurl;
				let formData = {
					answers: wp.data
						.select( 'quillForms/renderer-core' )
						.getAnswers(),
					formId: qfRender.formId,
				};
				const promises = wp.hooks.applyFilters(
					'QuillForms.Renderer.PreSubmissionPromises',
					[],
					{ formObject }
				);
				Promise.all( promises )
					.then( function () {
						formData = wp.hooks.applyFilters(
							'QuillForms.Renderer.SubmissionFormData',
							formData,
							{ formObject }
						);
						const data = new FormData();
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
								console.log( res );
								if ( res && res.success ) {
									// In case of successful submission, complete the form.
									if ( res.data.status === 'completed' ) {
										wp.data
											.dispatch(
												'quillForms/renderer-core'
											)
											.completeForm();
										wp.hooks.doAction(
											'QuillForms.Render.FormSubmitted',
											{ formId: qfRender.formId }
										);
									} else if (
										res.data.status === 'pending_payment'
									) {
										wp.data
											.dispatch(
												'quillForms/renderer-core'
											)
											.setPaymentData( res.data );
									} else {
										throw 'Server error; unkown status!';
									}
								} else if ( res && res.data ) {
									if ( res.data.fields ) {
										// In case of fields error from server side, set their valid flag with false and set their validation error.

										const walkPath = wp.data
											.select(
												'quillForms/renderer-core'
											)
											.getWalkPath();
										const firstField = qf.rendererCore
											.getBlocksRecursively( walkPath )
											.find( function ( o ) {
												return Object.keys(
													res.data.fields
												).includes( o.id );
											} );

										console.log( firstField );
										wp.data
											.dispatch(
												'quillForms/renderer-core'
											)
											.goToBlock( firstField.id );

										// Get the first invalid field and go back to it.
										if ( firstField ) {
											setTimeout( function () {
												wp.data
													.dispatch(
														'quillForms/renderer-core'
													)
													.setIsSubmitting( false );
												wp.data
													.dispatch(
														'quillForms/renderer-core'
													)
													.setIsReviewing( true );
												Object.keys(
													res.data.fields
												).forEach( function (
													fieldId,
													index
												) {
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
															res.data.fields[
																fieldId
															]
														);
												} );
											}, 500 );
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
											qfRender.formObj.messages[
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
											formObject.messages[
												'label.errorAlert.noConnection'
											]
										);
								}
							} );
					} )
					.catch( function ( err ) {
						wp.data
							.dispatch( 'quillForms/renderer-core' )
							.setSubmissionErr( err );
					} );
			},
		} ),
		document.getElementById( 'quillforms-renderer' )
	);
} )();
