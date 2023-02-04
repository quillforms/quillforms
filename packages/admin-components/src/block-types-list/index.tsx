/* eslint-disable no-shadow */
/**
 * Internal Dependencies
 */
import BlockTypesListItem from '../block-types-list-item';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { keys, map } from 'lodash';
import {
	CaledlyIcon,
	FileIcon,
	OpinionScaleIcon,
	PhoneIcon,
	PictureChoiceIcon,
	RatingIcon,
	SignatureIcon,
	ThankYouIcon,
} from './pro-blocks-icons';
import ProLabel from '../pro-label';

interface Props {
	destinationIndex: number;
	parent?: string;
}
const BlockTypesList: React.FC< Props > = ( { destinationIndex, parent } ) => {
	const { blockTypes, welcomeScreensLength } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
			welcomeScreensLength: select(
				'quillForms/block-editor'
			).getWelcomeScreensLength(),
		};
	} );
	return (
		<div className="admin-components-block-types-list">
			{ map( keys( blockTypes ), ( blockName, index ) => {
				let isDragDisabled = false;
				if (
					blockName === 'welcome-screen' &&
					welcomeScreensLength >= 1
				) {
					isDragDisabled = true;
				}

				return (
					<div
						key={ blockName }
						style={ {
							overflow: 'auto',
						} }
					>
						<div
							className={ classnames(
								'admin-components-blocks-list__item-wrapper'
							) }
						>
							<BlockTypesListItem
								destinationIndex={ destinationIndex }
								parent={ parent }
								index={ index }
								blockName={ blockName }
								disabled={ isDragDisabled }
							/>
						</div>
					</div>
				);
			} ) }

			{ ! blockTypes.file && (
				<div className={ 'admin-components-blocks-list__item-wrapper' }>
					<div className="admin-components-blocks-list-item disabled">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={ {
								backgroundColor: '#ff9381',
							} }
						>
							<span className="admin-components-blocks-list-item__icon">
								<FileIcon />
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							File Upload
						</span>
						<ProLabel />
					</div>
				</div>
			) }
			{ ! blockTypes.phone && (
				<div className={ 'admin-components-blocks-list__item-wrapper' }>
					<div className="admin-components-blocks-list-item disabled">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={ {
								backgroundColor: '#2cc31a',
							} }
						>
							<span className="admin-components-blocks-list-item__icon">
								<PhoneIcon />
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							Phone
						</span>
						<ProLabel />
					</div>
				</div>
			) }
			{ ! blockTypes.rating && (
				<div className={ 'admin-components-blocks-list__item-wrapper' }>
					<div className="admin-components-blocks-list-item disabled">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={ {
								backgroundColor: '#ffd010',
							} }
						>
							<span className="admin-components-blocks-list-item__icon">
								<RatingIcon />
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							Rating
						</span>
						<ProLabel />
					</div>
				</div>
			) }
			{ ! blockTypes.calendly && (
				<div className={ 'admin-components-blocks-list__item-wrapper' }>
					<div className="admin-components-blocks-list-item disabled">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={ {
								backgroundColor: '#fff',
							} }
						>
							<span className="admin-components-blocks-list-item__icon">
								<CaledlyIcon />
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							Calendly
						</span>
						<ProLabel />
					</div>
				</div>
			) }
			{ ! blockTypes[ 'opinion-scale' ] && (
				<div className={ 'admin-components-blocks-list__item-wrapper' }>
					<div className="admin-components-blocks-list-item disabled">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={ {
								backgroundColor: '#5d4096',
							} }
						>
							<span className="admin-components-blocks-list-item__icon">
								<OpinionScaleIcon />
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							Opinion Scale
						</span>
						<ProLabel />
					</div>
				</div>
			) }
			{ ! blockTypes[ 'picture-choice' ] && (
				<div className={ 'admin-components-blocks-list__item-wrapper' }>
					<div className="admin-components-blocks-list-item disabled">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={ {
								backgroundColor: '#0d775f',
							} }
						>
							<span className="admin-components-blocks-list-item__icon">
								<PictureChoiceIcon />
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							Picture Choice
						</span>
						<ProLabel />
					</div>
				</div>
			) }

			{ ! blockTypes.signature && (
				<div className={ 'admin-components-blocks-list__item-wrapper' }>
					<div className="admin-components-blocks-list-item disabled">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={ {
								backgroundColor: '#2eaf8b',
							} }
						>
							<span className="admin-components-blocks-list-item__icon">
								<SignatureIcon />
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							Signature
						</span>
						<ProLabel />
					</div>
				</div>
			) }

			{ ! blockTypes[ 'thankyou-screen' ] && (
				<div className={ 'admin-components-blocks-list__item-wrapper' }>
					<div className="admin-components-blocks-list-item disabled">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={ {
								backgroundColor: '#bf5c73',
							} }
						>
							<span className="admin-components-blocks-list-item__icon">
								<ThankYouIcon />
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							Thank You Screen
						</span>
						<ProLabel />
					</div>
				</div>
			) }
		</div>
	);
};

export default BlockTypesList;
