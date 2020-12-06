import '@quillforms/renderer-answers';
export * from './components';

import { render } from '@wordpress/element';

import { FormContentWrapper } from './components';
if ( 'undefined' !== typeof rendererMode && true === rendererMode ) {
	const editableFields = formObj.fields.filter(
		( field ) => field.editable === true
	);
	render(
		<FormContentWrapper
			formObj={ formObj }
			editableFields={ editableFields }
		/>,
		document.getElementById( 'quillForms-layout-wrapper' )
	);
}
