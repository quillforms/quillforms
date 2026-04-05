/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo } from 'react';
import { ColorPicker, Dropdown, Button } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import CircularOptionPicker from '../circular-option-picker';

const ColorSwatchSelectedIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
		className="theme-editor-color-palette__selected-icon"
	>
		<path
			d="M4.12353 12.2138C4.1837 14.5486 4.93892 16.4412 6.65094 17.8914C7.66491 18.7504 8.85791 19.2228 10.1562 19.453C11.5839 19.7057 12.9695 19.5613 14.2768 18.934C16.6056 17.8177 18.0123 15.9778 18.4636 13.4263C18.5869 12.7283 18.5779 12.0257 18.4711 11.3232C18.42 10.9847 18.6276 10.6883 18.951 10.6356C19.2474 10.5875 19.5332 10.8011 19.5859 11.1306C19.8446 12.7448 19.6295 14.3049 18.9315 15.7747C17.7445 18.2705 15.8113 19.8818 13.1034 20.5151C11.5237 20.8837 9.96215 20.7137 8.45322 20.1706C5.49856 19.107 3.73388 16.9873 3.16221 13.9198C2.69734 11.4194 3.2284 9.11318 4.7975 7.08824C5.90926 5.65303 7.39412 4.76693 9.13923 4.31109C9.99224 4.08844 10.8603 3.96508 11.7464 4.00871C13.4765 4.09295 15.0275 4.67065 16.404 5.71922C16.6673 5.91931 16.717 6.26833 16.5319 6.51656C16.3378 6.77682 15.9858 6.82196 15.703 6.60683C14.9342 6.02311 14.0857 5.60489 13.1545 5.35816C11.6787 4.96852 10.2194 5.08586 8.80225 5.60188C6.24625 6.53311 4.76591 8.39407 4.2514 11.0403C4.16866 11.4661 4.15662 11.9054 4.12503 12.2138H4.12353Z"
			fill="#334155"
		/>
		<path
			d="M11.3559 14.0928C11.8163 13.6354 12.2736 13.1871 12.725 12.7328C15.1441 10.3047 17.5631 7.87503 19.9822 5.4454C20.247 5.17912 20.593 5.15806 20.8277 5.38823C21.0714 5.62443 21.0549 5.97195 20.7811 6.24876C18.8148 8.22405 16.8486 10.1963 14.8823 12.1701C13.8713 13.1856 12.8604 14.2026 11.8479 15.2181C11.5049 15.5626 11.21 15.5611 10.8685 15.2181C9.83498 14.18 8.79844 13.145 7.77093 12.1009C7.66412 11.9926 7.57536 11.8377 7.53925 11.6902C7.48359 11.46 7.62951 11.2284 7.84314 11.1231C8.05075 11.0208 8.31101 11.0539 8.48402 11.2238C8.81349 11.5458 9.13694 11.8753 9.46339 12.2017C10.0531 12.793 10.6429 13.3857 11.2326 13.9769C11.2717 14.016 11.3138 14.0536 11.3544 14.0928H11.3559Z"
			fill="#334155"
		/>
	</svg>
);

export default function ColorPalette({
	clearable = true,
	className,
	colors,
	disableCustomColors = false,
	customColorAsPlus = true,
	onChange,
	value,
}) {
	const clearColor = useCallback(() => onChange(undefined), [onChange]);
	const colorOptions = useMemo(() => {
		const mapped = map(colors, ({ color, name }) => {
			return (
				<CircularOptionPicker.Option
					key={color}
					isSelected={value === color}
					selectedIcon={<ColorSwatchSelectedIcon />}
					tooltipText={
						name ||
						// translators: %s: color hex code e.g: "#f00".
						sprintf(__('Color code: %s'), color)
					}
					style={{ backgroundColor: color, color }}
					onClick={
						value === color ? clearColor : () => onChange(color)
					}
					aria-label={
						name
							? // translators: %s: The name of the color e.g: "vivid red".
							sprintf(__('Color: %s'), name)
							: // translators: %s: color hex code e.g: "#f00".
							sprintf(__('Color code: %s'), color)
					}
				/>
			);
		});

		if (disableCustomColors || !customColorAsPlus) {
			return mapped;
		}

		const customPlus = (
			<div
				key="theme-editor-custom-plus"
				className="components-circular-option-picker__option-wrapper theme-editor-color-palette__custom-wrapper"
			>
				<Dropdown
					className="theme-editor-color-palette__custom-dropdown"
					contentClassName="components-color-palette__picker"
					popoverProps={{ placement: 'bottom-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<Button
							aria-expanded={isOpen}
							aria-haspopup="true"
							onClick={onToggle}
							className="components-circular-option-picker__option theme-editor-color-palette__custom-swatch"
							aria-label={__('Custom color', 'quillforms')}
						>
							<Icon icon={plus} />
						</Button>
					)}
					renderContent={() => (
						<ColorPicker
							color={value}
							onChangeComplete={(color) => {
								onChange(color.rgb);
							}}
							disableAlpha={false}
						/>
					)}
				/>
			</div>
		);

		return [customPlus, ...mapped];
	}, [
		colors,
		value,
		onChange,
		clearColor,
		disableCustomColors,
		customColorAsPlus,
	]);

	const renderCustomColorPicker = () => (
		<ColorPicker
			color={value}
			onChangeComplete={(color) => {
				onChange(color.rgb);
			}}
			disableAlpha={false}
		/>
	);

	return (
		<CircularOptionPicker
			className={className}
			options={colorOptions}
			actions={
				<>
					{!disableCustomColors && !customColorAsPlus && (
						<CircularOptionPicker.DropdownLinkAction
							dropdownProps={{
								renderContent: renderCustomColorPicker,
								contentClassName:
									'components-color-palette__picker',
							}}
							buttonProps={{
								'aria-label': __('Custom color picker'),
							}}
							linkText={__('Custom color')}
						/>
					)}
					{!!clearable && (
						<CircularOptionPicker.ButtonAction
							onClick={clearColor}
						>
							{__('Clear')}
						</CircularOptionPicker.ButtonAction>
					)}
				</>
			}
		/>
	);
}
