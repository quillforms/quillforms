/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';

const SubPanel = () => {
	const currentSubPanel = useSelect( ( select ) =>
		select( 'quillForms/builder-panels' ).getCurrentSubPanel()
	);

	return (
		<Fragment>
			{ currentSubPanel && (
				<div className="activeChild__panelContent">
					{ /* @ts-expect-error */ }
					<currentSubPanel.render />
				</div>
			) }
		</Fragment>
	);
};
export default SubPanel;
