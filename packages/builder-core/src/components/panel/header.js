/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { Icon } from '@wordpress/components';
import { close } from '@wordpress/icons';

const PanelHeader = () => {
	const { panels, currentPanel, currentSubPanel } = useSelect( ( select ) => {
		return {
			panels: select( 'quillForms/builder-panels' ).getPanels(),
			currentPanel: select(
				'quillForms/builder-panels'
			).getCurrentPanel(),
			currentSubPanel: select(
				'quillForms/builder-panels'
			).getCurrentSubPanel(),
		};
	} );

	const currentPanelObj = panels.find(
		( panel ) => panel.name === currentPanel
	);

	let panelTitle = null;

	const { setCurrentPanel, setCurrentSubPanel } = useDispatch(
		'quillForms/builder-panels'
	);
	switch ( currentPanel ) {
		case 'blockControls':
			{
				panelTitle = (
					<h4>
						Block <br /> Controls
					</h4>
				);
			}
			break;
		case 'blocks':
			{
				panelTitle = (
					<h4>
						Form <br /> Blocks
					</h4>
				);
			}
			break;
		default: {
			panelTitle = <h4>{ currentPanelObj.title }</h4>;
		}
	}

	return (
		<div className={ 'builder-core-panel__header-wrapper' }>
			<div className="builder-core-panel__header">
				<div className="builder-core-panel__header-title">
					{ panelTitle }
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
			{ currentPanelObj.mode === 'parent' &&
				currentPanelObj.subPanels.length > 0 && (
					<div className="builder-core-panel__header-tabs-wrapper">
						<div className="builder-core-panel__header-tabs">
							{ currentPanelObj.subPanels &&
								currentPanelObj.subPanels.length > 0 &&
								currentPanelObj.subPanels.map( ( subPanel ) => {
									return (
										<div
											role="presentation"
											key={ subPanel.name }
											className={
												'builder-core-panel__header-tab' +
												( currentSubPanel ===
												subPanel.name
													? ' active'
													: '' )
											}
											onClick={ () =>
												setCurrentSubPanel(
													subPanel.name
												)
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
