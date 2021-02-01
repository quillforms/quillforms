/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { Icon } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * External Dependencies
 */
import CloseIcon from '@material-ui/icons/Close';
import { Editor } from 'slate';
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import getPlainExcerpt from '../../get-plain-excerpt';

const EditorMergeTag = ( props ) => {
	const {
		attributes,
		editor,
		children,
		path,
		type,
		modifier,
		mergeTags,
	} = props;
	const [ node ] = Editor.node( editor, path );

	const mergeTag = mergeTags.find(
		( a ) => a.type === type && a.modifier === modifier
	);
	const mergeTagIcon = mergeTag?.icon ? mergeTag.icon : plus;
	const renderedIcon = (
		<Icon icon={ mergeTagIcon?.src ? mergeTagIcon.src : mergeTagIcon } />
	);

	useEffect( () => {
		if ( ! mergeTag ) {
			editor.apply( { type: 'remove_node', path, node } );
		}
	}, [ mergeTags, mergeTag ] );
	return (
		<>
			{ mergeTag && (
				<span
					{ ...attributes }
					contentEditable={ false }
					className={ classnames(
						'rich-text-merge-tag__node-wrapper',
						css`
							color: ${mergeTag?.color
								? mergeTag.color
								: '#bb426f'};
							bordercolor: ${mergeTag?.color
								? mergeTag.color
								: '#bb426f'};
							fill: ${mergeTag?.color
								? mergeTag.color
								: '#bb426f'};
						`
					) }
				>
					<span
						className={ classnames(
							'rich-text-merge-tag__background',
							css`
								background: ${mergeTag?.color
									? mergeTag.color
									: '#bb426f'};
							`
						) }
					/>
					<span className="rich-text-merge-tag__icon-box">
						{ renderedIcon }
					</span>
					<span className="rich-text-merge-tag__title">
						{ getPlainExcerpt( mergeTag.label ) }
					</span>
					<button
						className="rich-text-merge-tag__delete"
						onClick={ () => {
							setTimeout( () => {
								editor.apply( {
									type: 'remove_node',
									path,
									node,
								} );
							}, 0 );
						} }
					>
						<CloseIcon />
					</button>
					{ children }
				</span>
			) }
		</>
	);
};
export default EditorMergeTag;
