/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import CloseIcon from '@material-ui/icons/Close';
import { motion } from 'framer-motion';

const PanelHeader = () => {
	const [ animating, setAnimating ] = useState( false );

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
	const formStructure = useSelect( ( select ) =>
		select( 'quillForms/block-editor' ).getFormStructure()
	);
	// // console.log(formStructure);
	const currentBlockId = formStructure.currentBlockId;
	const { setCurrentPanel, setCurrentSubPanel } = useDispatch(
		'quillForms/builder-panels'
	);
	useEffect( () => {
		if ( currentPanel === 'blockControls' ) setAnimating( true );
	}, [ currentBlockId ] );
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
		<motion.div
			className={ 'builder-core-panel__header-wrapper' }
			initial={ { backgroundColor: '#f5f5f5' } }
			animate={ {
				backgroundColor: animating
					? [ '#dadada', '#f5f5f5' ]
					: '#f5f5f5',
			} }
			transition={ {
				ease: 'easeInOut',
				duration: 0.5,
			} }
			onAnimationComplete={ () => setAnimating( false ) }
		>
			<div className="builder-core-panel__header">
				<div className="builder-core-panel__header-title">
					{ panelTitle }
				</div>
				<div className="builder-core-panel__header-close-icon">
					<CloseIcon
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
		</motion.div>
	);
};
export default PanelHeader;
