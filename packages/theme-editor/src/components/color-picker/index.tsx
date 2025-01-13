import { ColorPalette as WPColorPalette } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ColorPicker = ({ value, onChange }) => {
	const colors = [
		{
			name: __('Pale pink', 'quillforms'),
			slug: 'pale-pink',
			color: '#f78da7',
		},
		{ name: __('Vivid red', 'quillforms'), slug: 'vivid-red', color: '#cf2e2e' },
		{
			name: __('Luminous vivid orange', 'quillforms'),
			slug: 'luminous-vivid-orange',
			color: '#ff6900',
		},
		{
			name: __('Luminous vivid amber', 'quillforms'),
			slug: 'luminous-vivid-amber',
			color: '#fcb900',
		},
		{
			name: __('Light green cyan', 'quillforms'),
			slug: 'light-green-cyan',
			color: '#7bdcb5',
		},
		{
			name: __('Vivid green cyan', 'quillforms'),
			slug: 'vivid-green-cyan',
			color: '#00d084',
		},
		{
			name: __('Pale cyan blue', 'quillforms'),
			slug: 'pale-cyan-blue',
			color: '#8ed1fc',
		},
		{
			name: __('Vivid cyan blue', 'quillforms'),
			slug: 'vivid-cyan-blue',
			color: '#0693e3',
		},
		{
			name: __('Vivid purple', 'quillforms'),
			slug: 'vivid-purple',
			color: '#9b51e0',
		},
		{
			name: __('Dark Magenta', 'quillforms'),
			slug: 'dark-magenta',
			color: '#8b008b',
		},
		{
			name: __('Cyan bluish gray', 'quillforms'),
			slug: 'cyan-bluish-gray',
			color: '#abb8c3',
		},
		{
			name: __('Very dark gray', 'quillforms'),
			slug: 'very-dark-gray',
			color: '#313131',
		},
	];
	return (
		<div className="admin-components-color-picker">
			<WPColorPalette
				colors={colors}
				value={value}
				onChange={(val) => onChange(val)}
			/>
		</div>
	);
};
export default ColorPicker;
