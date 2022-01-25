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
	const { disableProgressBar, disableWheelSwiping } = useDispatch(
		'quillForms/settings-editor'
	);

	const { isProgressBarDisabled, isWheelSwipingDisabled } = useSelect(
		( select ) => {
			return {
				isProgressBarDisabled: select(
					'quillForms/settings-editor'
				).isProgressBarDisabled(),
				isWheelSwipingDisabled: select(
					'quillForms/settings-editor'
				).isWheelSwipingDisabled(),
			};
		}
	);
	return (
		<div className="settings-editor-panel-render">
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={ 'Disable progress bar' } />
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
		</div>
	);
};
export default PanelRender;
