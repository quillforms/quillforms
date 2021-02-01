import { Fragment } from '@wordpress/element';

const MessagePreview = ( { value } ) => {
	const formatValue = ( val ) => {
		return val.replace( /{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/g, '_' );
	};

	return (
		<Fragment>
			<div
				dangerouslySetInnerHTML={ { __html: formatValue( value ) } }
				className="messages-editor-message-preview"
			/>
		</Fragment>
	);
};
export default MessagePreview;
