(function () {
	const formObject = wp.hooks.applyFilters(
		'QuillForms.Renderer.FormObject',
		qfRender.formObject
	);

	ReactDOM.render(
		React.createElement(qf.rendererCore.Form, {
			formObj: formObject,
			formId: qfRender.formId,
			applyLogic: true,
			editor: {
				mode: 'off'
			},
			customFonts: qfRender.customFonts,
			onPartialSubmit: function () {
				var qfRender = window.qfRender;
				var ajaxurl = qfRender.ajaxurl || '';

				try {
					var formData = {
						answers: wp.data
							.select('quillForms/renderer-core')
							.getAnswers(),
						formId: qfRender.formId,
						currentBlockId: wp.data.select('quillForms/renderer-core').getCurrentBlockId(),
					};
					var globalHash = wp.data.select('quillForms/renderer-core').getGlobalHash();

					formData = wp.hooks.applyFilters(
						'QuillForms.Renderer.SaveSubmissionFormData',
						formData,
						{ formObject: formObject }
					)
					var data = new FormData();
					data.append('action', 'quillforms_form_partial_submission');
					data.append('formData', JSON.stringify(formData));
					data.append('quillforms_nonce', qfRender._nonce);
					if (globalHash) {
						data.append('hash', globalHash);
					}
					fetch(ajaxurl, {
						method: 'POST',
						credentials: 'same-origin',
						body: data,
					})
						.then(function (response) {
							if (!response.ok) {
								return Promise.reject(response);
							}
							return response.json();
						})
						.then(function (res) {
							if (res && res.success) {
								wp.data.dispatch('quillForms/renderer-core').setGlobalHash(res.data.hash);

							}
						}
						)

				} catch (error) {
					console.error(error);
				}
			},
			onSubmit: function () {
				var ajaxurl = qfRender.ajaxurl;
				var formData = {
					answers: wp.data
						.select('quillForms/renderer-core')
						.getAnswers(),
					formId: qfRender.formId,
					hash: wp.data.select('quillForms/renderer-core').getGlobalHash(),
				};
				var promises = wp.hooks.applyFilters(
					'QuillForms.Renderer.PreSubmissionPromises',
					[],
					{ formObject }
				);
				Promise.all(promises)
					.then(function () {
						formData = wp.hooks.applyFilters(
							'QuillForms.Renderer.SubmissionFormData',
							formData,
							{ formObject }
						);
						var data = new FormData();
						data.append('action', 'quillforms_form_submit');
						data.append('formData', JSON.stringify(formData));
						data.append('quillforms_nonce', window.qfRender._nonce);
						fetch(ajaxurl, {
							method: 'POST',
							credentials: 'same-origin',
							body: data,
						})
							.then(function (response) {
								if (!response.ok) {
									return Promise.reject(response);
								}
								return response.json();
							})
							.then(function (res) {
								if (res && res.success) {
									// In case of successful submission, complete the form.
									if (res.data.status === 'completed') {
										setTimeout(() => {
											document.cookie = 'quillforms-answers-' +
												qfRender.formId + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
											document.cookie = 'quillforms-current-block-' +
												qfRender.formId + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
											localStorage.removeItem('quillforms-answers-' + qfRender.formId);
											localStorage.removeItem('quillforms-current-block-' + qfRender.formId);

										}, 1000);
										wp.data.dispatch(
											'quillForms/renderer-core'
										).setThankyouScreens(res.data.thankyouscreens)
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
										if (res.data.thankyouScreens) {
											wp.data.dispatch(
												'quillForms/renderer-core'
											).setThankyouScreens(res.data.thankyouscreens)
										}

										wp.data
											.dispatch(
												'quillForms/renderer-core'
											)
											.setPaymentData(res.data);
									} else {
										throw 'Server error; unkown status!';
									}
								} else if (res && res.data) {
									if (res.data.fields) {
										// In case of fields error from server side, set their valid flag with false and set their validation error.

										const walkPath = wp.data
											.select(
												'quillForms/renderer-core'
											)
											.getWalkPath();
										const firstField = qf.rendererCore
											.getBlocksRecursively(walkPath)
											.find(function (o) {
												return Object.keys(
													res.data.fields
												).includes(o.id);
											});

										wp.data
											.dispatch(
												'quillForms/renderer-core'
											)
											.goToBlock(firstField.id);

										// Get the first invalid field and go back to it.
										if (firstField) {
											setTimeout(function () {
												wp.data
													.dispatch(
														'quillForms/renderer-core'
													)
													.setIsSubmitting(false);
												wp.data
													.dispatch(
														'quillForms/renderer-core'
													)
													.setIsReviewing(true);
												Object.keys(
													res.data.fields
												).forEach(function (
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
												});
											}, 500);
										}
									}
								}
							})
							.catch(function (err) {
								console.log(err);
								if (err && err.status === 500) {
									// Server error = 500
									wp.data
										.dispatch('quillForms/renderer-core')
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
										.dispatch('quillForms/renderer-core')
										.setSubmissionErr(
											formObject.messages[
											'label.errorAlert.noConnection'
											]
										);
								}
							});
					})
					.catch(function (err) {
						wp.data
							.dispatch('quillForms/renderer-core')
							.setSubmissionErr(err);
					});
			},
		}),
		document.getElementById('quillforms-renderer')
	);
})();
