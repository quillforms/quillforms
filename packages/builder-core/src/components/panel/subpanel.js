/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';

const SubPanel = () => {
	const currentSubPanelObj = useSelect( ( select ) =>
		select( 'quillForms/builder-panels' ).getCurrentSubPanelObj()
	);

	return (
		<Fragment>
			{ currentSubPanelObj && (
				<div className="activeChild__panelContent">
					<currentSubPanelObj.render />
				</div>
			) }
		</Fragment>
	);
};
export default SubPanel;
