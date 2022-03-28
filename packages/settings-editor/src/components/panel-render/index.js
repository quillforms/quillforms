/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	SelectControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const PanelRender = () => {
	const {
		disableProgressBar,
		disableWheelSwiping,
		disableNavigationArrows,
		changeAnimationDirection,
	} = useDispatch( 'quillForms/settings-editor' );

	const {
		isProgressBarDisabled,
		isWheelSwipingDisabled,
		isNavigationArrowsDisabled,
		animationDirection,
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
			animationDirection: select(
				'quillForms/settings-editor'
			).getAnimationDirection(),
		};
	} );
	const animationOptions = [
		{
			key: 'horizontal',
			name: 'Horizontal',
		},
		{
			key: 'vertical',
			name: 'Vertical',
		},
	];
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
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={ 'Animation Direction' } />
					<SelectControl
						className={ css`
							margin-top: 5px;
						` }
						onChange={ ( { selectedItem } ) => {
							changeAnimationDirection( selectedItem.key );
						} }
						options={ animationOptions }
						value={ animationOptions.find(
							( option ) => option.key === animationDirection
						) }
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};
export default PanelRender;
