/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, Fragment } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { isSolid, isGradient } from './utils';
import GradientPicker from '../gradient-picker/index.js';
import AlphaColorPicker from '../alpha-color-picker';

const CompoColorPicker = ({ color, setColor, defaultVal = '#000' }) => {
	const [activeSwitcher, setActiveSwitcher] = useState(null);
	const [selectedColor, setSelectedColor] = useState('');

	const DEFAULT_GRADIENT =
		'linear-gradient(135deg, rgba(6, 147, 227, 1) 0%, rgb(155, 81, 224) 100%)';

	useEffect(() => {
		if (!color) return;
		setSelectedColor(color);
	}, [color]);

	useEffect(() => {
		if (!color) return;
		if (isGradient(color)) {
			setActiveSwitcher('gradient');
			setColor(color);
		} else if (isSolid(color)) {
			setActiveSwitcher('solid');
			setColor(color);
		} else if (isGradient(defaultVal)) {
			setActiveSwitcher('gradient');
			setColor(defaultVal);
		} else if (isSolid(defaultVal)) {
			setActiveSwitcher('solid');
			setColor(defaultVal);
		} else {
			setActiveSwitcher('solid');
			setColor('#fff');
		}
	}, []);

	return (
		<div className="admin-components-combo-color-picker">
			<div className="admin-components-combo-color-picker__switcher-wrapper">
				<Button
					onClick={() => {
						if (
							!activeSwitcher ||
							activeSwitcher === 'gradient'
						) {
							setActiveSwitcher('solid');
							setColor('#fff');
						}
					}}
					isPrimary={activeSwitcher === 'solid'}
					isSmall
					isFlat
				>
					{__('Solid', 'quillforms')}
				</Button>
				<Button
					onClick={() => {
						if (!activeSwitcher || activeSwitcher === 'solid') {
							setActiveSwitcher('gradient');
							setColor(DEFAULT_GRADIENT);
						}
					}}
					isPrimary={activeSwitcher === 'gradient'}
					isSmall
					isFlat
				>
					{__('Gradient', 'quillforms')}
				</Button>
			</div>
			{activeSwitcher === 'gradient' ? (
				<GradientPicker
					value={selectedColor ? selectedColor : DEFAULT_GRADIENT}
					onChange={(val) => setColor(val)}
				/>
			) : (
				<Fragment>
					{activeSwitcher === 'solid' && (
						<AlphaColorPicker
							value={selectedColor}
							onChange={(val) => setColor(val)}
						/>
					)}
				</Fragment>
			)}
		</div>
	);
};

export default CompoColorPicker;
