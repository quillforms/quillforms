/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	BaseControl,
	ControlWrapper,
	ControlLabel,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

const PanelRender = () => {
	const {
		disableProgressBar,
		disableWheelSwiping,
		disableNavigationArrows,
	} = useDispatch( 'quillForms/settings-editor' );

	const {
		isProgressBarDisabled,
		isWheelSwipingDisabled,
		isNavigationArrowsDisabled,
	} = useSelect( ( select ) => {
		return {
			isProgressBarDisabled: select(
				'quillForms/settings-editor'
			).isProgressBarDisabled(),
			isWheelSwipingDisabled: select(
				'quillForms/settings-editor'
			).isWheelSwipingDisabled(),
			isNavigationArrowsDisabled: select(
				'quillForms/settings-editor'
			).isNavigationArrowsDisabled(),
		};
	} );
	return (
		<div className="settings-editor-panel-render">
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={ 'Hide progress bar' } />
					<ToggleControl
						checked={ isProgressBarDisabled }
						onChange={ () =>
							disableProgressBar( ! isProgressBarDisabled )
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={ 'Disable swiping by wheel' } />
					<ToggleControl
						checked={ isWheelSwipingDisabled }
						onChange={ () =>
							disableWheelSwiping( ! isWheelSwipingDisabled )
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={ 'Hide navigation arrows' } />
					<ToggleControl
						checked={ isNavigationArrowsDisabled }
						onChange={ () =>
							disableNavigationArrows(
								! isNavigationArrowsDisabled
							)
						}
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};
export default PanelRender;
