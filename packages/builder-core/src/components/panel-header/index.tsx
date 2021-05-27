/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { Icon } from '@wordpress/components';
import { close } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { sortBy } from 'lodash';
import classnames from 'classnames';

const PanelHeader = () => {
	const { currentPanel, currentSubPanelName } = useSelect( ( select ) => {
		return {
			panels: select( 'quillForms/builder-panels' ).getPanels(),
			currentPanel: select(
				'quillForms/builder-panels'
			).getCurrentPanel(),
			currentPanelName: select(
				'quillForms/builder-panels'
			).getCurrentPanelName(),
			currentSubPanelName: select(
				'quillForms/builder-panels'
			).getCurrentSubPanelName(),
		};
	} );

	const { setCurrentPanel, setCurrentSubPanel } = useDispatch(
		'quillForms/builder-panels'
	);

	return (
		<div className={ 'builder-core-panel__header-wrapper' }>
			<div className="builder-core-panel__header">
				<div className="builder-core-panel__header-title">
					<h4>{ currentPanel?.title }</h4>
				</div>
				<div className="builder-core-panel__header-close-icon">
					<Icon
						icon={ close }
						onClick={ () => {
							setCurrentPanel( '' );
							setCurrentSubPanel( '' );
						} }
					/>
				</div>
			</div>
			{ currentPanel?.mode === 'parent' &&
				currentPanel?.subPanels &&
				currentPanel.subPanels?.length > 0 && (
					<div className="builder-core-panel__header-tabs-wrapper">
						<div className="builder-core-panel__header-tabs">
							{ sortBy( currentPanel.subPanels, [
								'position',
							] ).map( ( subPanel ) => {
								return (
									<div
										role="presentation"
										key={ subPanel.name }
										className={ classnames(
											'builder-core-panel__header-tab',
											{
												active:
													currentSubPanelName ===
													subPanel.name,
											}
										) }
										onClick={ () =>
											setCurrentSubPanel( subPanel.name )
										}
									>
										{ subPanel.title }
									</div>
								);
							} ) }
						</div>
					</div>
				) }
		</div>
	);
};
export default PanelHeader;
