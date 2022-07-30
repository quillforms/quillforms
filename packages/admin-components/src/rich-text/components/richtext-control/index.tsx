/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import RichTextControlRenderer from './renderer';
import { allowedFormats, MergeTags } from '../../types';

interface Props {
	value: string;
	id?: string;
	setValue: ( value: string ) => void;
	mergeTags?: MergeTags;
	className?: string;
	allowedFormats?: allowedFormats;
	focusOnMount?: boolean;
	placeholder?: string;
}
const RichTextControl: React.FC< Props > = ( props ) => {
	const { id } = props;
	const [ idChanging, setIdChanging ] = useState( true );
	useEffect( () => {
		setIdChanging( true );
	}, [ id ] );

	useEffect( () => {
		setTimeout( () => {
			setIdChanging( false );
		}, 200 );
	}, [ idChanging ] );

	if ( idChanging ) {
		return null;
	}
	return <RichTextControlRenderer { ...props } />;
};

export default RichTextControl;
