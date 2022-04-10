/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '../../..';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import getPlainExcerpt from '../../get-plain-excerpt';

const MergeTagListItem = ( {
	mergeTag,
	onClick,
	onMouseEnter,
	isSelected,
} ) => {
	return (
		<div
			role="presentation"
			className={ classnames( 'rich-text-merge-tag-list-item', {
				isSelected,
			} ) }
			onClick={ onClick }
			onMouseEnter={ onMouseEnter }
		>
			<div
				className={ classnames(
					'rich-text-merge-tag-list-item__hidden-bg',
					css`
						background: ${ mergeTag?.color
							? mergeTag.color
							: '#bb426f' };
					`
				) }
			/>
			<BlockIconBox
				color={ mergeTag?.color }
				icon={ mergeTag?.icon ? mergeTag.icon : null }
				order={ mergeTag?.order ? mergeTag.order : null }
			/>
			<div
				className="rich-text-merge-tag-list-item__title"
				dangerouslySetInnerHTML={ {
					__html: mergeTag?.label
						? getPlainExcerpt( mergeTag.label )
						: '',
				} }
			/>
		</div>
	);
};

export default MergeTagListItem;
