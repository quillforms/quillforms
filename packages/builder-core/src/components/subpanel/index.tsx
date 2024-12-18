/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Fragment } from 'react';

const SubPanel = () => {
	const currentSubPanel = useSelect((select) =>
		select('quillForms/builder-panels').getCurrentSubPanel()
	);

	// the name containes "/". we need to replace it with "-" to use it as a class name
	const currentSubPanelName = currentSubPanel?.name.replace('/', '-');

	return (
		<Fragment>
			{currentSubPanel && (
				<div className={`builder-core-subpanel builder-core-${currentSubPanelName}-subpanel`}>
					{ /* @ts-expect-error */}
					<currentSubPanel.render />
				</div>
			)}
		</Fragment>
	);
};
export default SubPanel;
