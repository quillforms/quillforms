import { Fragment } from '@wordpress/element';

const MessagePreview = ( { value, format } ) => {
	const formatValue = ( val ) => {
		return val.replace( /{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/g, '_' );
	};

	return (
		<Fragment>
			{ format && format === 'html' ? (
				<div
					dangerouslySetInnerHTML={ { __html: formatValue( value ) } }
					className="messages-editor-message-preview"
				/>
			) : (
				<div className="messages-editor-message-preview">{ value }</div>
			) }
		</Fragment>
	);
};
export default MessagePreview;
