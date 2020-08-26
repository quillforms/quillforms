/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * External Dependencies
 */
import ReactHtmlParser from 'react-html-parser';

/**
 * Internal Dependencies
 */
import FieldVariable from './field-variable';

const HtmlParser = ( { value } ) => {
	let counter = 0;
	value = value.replace( /({{field:([^}]*)}})/g, ( match, p1, p2 ) => {
		counter++;
		return (
			'<fieldmention field_counter=' +
			counter +
			" field_id='" +
			p2 +
			"'></fieldmention>"
		);
	} );

	// console.log(value);
	const transform = ( node ) => {
		if ( node.type === 'tag' && node.name === 'mention' ) {
			return (
				<FieldVariable
					key={ 'field_variable_' + node.attribs.field_counter }
					fieldId={ node.attribs.field_id }
				/>
			);
		}
	};

	return <Fragment>{ ReactHtmlParser( value, { transform } ) }</Fragment>;
};
export default HtmlParser;
