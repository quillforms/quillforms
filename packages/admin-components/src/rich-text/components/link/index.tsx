/**
 * External Dependencies
 */
import { Transforms, Editor, Range } from 'slate';
import { CustomNode } from '../../types';

/**
 * Inernal Dependencies
 */
import Button from '../button';
import LinkIcon from './link-icon';

interface Props {
	editor: Editor;
}
const Link: React.FC< Props > = ( { editor } ) => {
	const insertLink = ( url: string ) => {
		if ( editor.selection ) {
			wrapLink( url );
		}
	};
	const isLinkActive = () => {
		const [ link ] = Editor.nodes( editor, {
			match: ( n: CustomNode ) => n.type === 'link',
		} );
		return !! link;
	};

	const unwrapLink = () => {
		Transforms.unwrapNodes( editor, {
			match: ( n: CustomNode ) => n.type === 'link',
		} );
	};

	const wrapLink = ( url ) => {
		if ( isLinkActive() ) {
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
			active={ isLinkActive() }
			onMouseDown={ ( event ) => {
				event.preventDefault();
				if ( isLinkActive() ) {
					unwrapLink();
					return;
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
