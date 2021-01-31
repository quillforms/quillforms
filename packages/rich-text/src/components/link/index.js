/**
 * External Dependencies
 */
import { Transforms, Editor, Range } from 'slate';
import LinkIcon from '@material-ui/icons/Link';

/**
 * Inernal Dependencies
 */
import Button from '../button';

const Link = ( { editor } ) => {
	const insertLink = ( url ) => {
		if ( editor.selection ) {
			wrapLink( url );
		}
	};
	const isLinkActive = () => {
		const [ link ] = Editor.nodes( editor, {
			match: ( n ) => n.type === 'link',
		} );
		return !! link;
	};

	const unwrapLink = () => {
		Transforms.unwrapNodes( editor, { match: ( n ) => n.type === 'link' } );
	};

	const wrapLink = ( url ) => {
		if ( isLinkActive( editor ) ) {
			unwrapLink();
		}

		const { selection } = editor;
		const isCollapsed = selection && Range.isCollapsed( selection );
		const link = {
			type: 'link',
			url,
			children: isCollapsed ? [ { text: url } ] : [],
		};

		if ( isCollapsed ) {
			Transforms.insertNodes( editor, link );
		} else {
			Transforms.wrapNodes( editor, link, { split: true } );
			Transforms.collapse( editor, { edge: 'end' } );
		}
	};

	return (
		<Button
			active={ isLinkActive( editor ) }
			onMouseDown={ ( event ) => {
				event.preventDefault();
				if ( isLinkActive( editor ) ) {
					unwrapLink( editor );
				}
				// eslint-disable-next-line no-alert
				const url = window.prompt( 'Enter the URL of the link:' );
				if ( ! url ) return;
				insertLink( url );
			} }
		>
			<LinkIcon />
		</Button>
	);
};
export default Link;
