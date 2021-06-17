import { __ } from '@wordpress/i18n';
import {
	__experimentalGradientPicker,
	GradientPicker as WPGradientPicker,
} from '@wordpress/components';
const GradientPicker = ( { value, onChange } ) => {
	const WPGradientPickerComponent =
		WPGradientPicker || __experimentalGradientPicker;
	const props = {
		colors: [
			{
				name: __( 'Pale pink' ),
				slug: 'pale-pink',
				color: '#f78da7',
			},
			{ name: __( 'Vivid red' ), slug: 'vivid-red', color: '#cf2e2e' },
			{
				name: __( 'Luminous vivid orange' ),
				slug: 'luminous-vivid-orange',
				color: '#ff6900',
			},
			{
				name: __( 'Luminous vivid amber' ),
				slug: 'luminous-vivid-amber',
				color: '#fcb900',
			},
			{
				name: __( 'Light green cyan' ),
				slug: 'light-green-cyan',
				color: '#7bdcb5',
			},
			{
				name: __( 'Vivid green cyan' ),
				slug: 'vivid-green-cyan',
				color: '#00d084',
			},
			{
				name: __( 'Pale cyan blue' ),
				slug: 'pale-cyan-blue',
				color: '#8ed1fc',
			},
			{
				name: __( 'Vivid cyan blue' ),
				slug: 'vivid-cyan-blue',
				color: '#0693e3',
			},
			{
				name: __( 'Vivid purple' ),
				slug: 'vivid-purple',
				color: '#9b51e0',
			},
			{
				name: __( 'Very light gray' ),
				slug: 'very-light-gray',
				color: '#eeeeee',
			},
			{
				name: __( 'Cyan bluish gray' ),
				slug: 'cyan-bluish-gray',
				color: '#abb8c3',
			},
			{
				name: __( 'Very dark gray' ),
				slug: 'very-dark-gray',
				color: '#313131',
			},
		],
		gradients: [
			{
				name: __( 'Vivid cyan blue to vivid purple' ),
				gradient:
					'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)',
				slug: 'vivid-cyan-blue-to-vivid-purple',
			},
			{
				name: __( 'Light green cyan to vivid green cyan' ),
				gradient:
					'linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%)',
				slug: 'light-green-cyan-to-vivid-green-cyan',
			},
			{
				name: __( 'Custom gradient' ),
				gradient: 'linear-gradient(to right, #29e0c0 0%, #1cc4ff 100%)',
				slug: 'custom-bg-gradient-3',
			},
			{
				name: __( 'custom gradient' ),
				gradient: 'linear-gradient(135deg,#F8C390 0%, #D279EE 100%)',
				slug: 'custom-bg-gradient-4',
			},
			{
				name: __( 'Very light gray to cyan bluish gray' ),
				gradient:
					'linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%)',
				slug: 'very-light-gray-to-cyan-bluish-gray',
			},
			{
				name: __( 'Cool to warm spectrum' ),
				gradient:
					'linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%)',
				slug: 'cool-to-warm-spectrum',
			},
			{
				name: __( 'Blush light purple' ),
				gradient:
					'linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%)',
				slug: 'blush-light-purple',
			},
			{
				name: __( 'pinky bordeaux' ),
				gradient: 'linear-gradient(135deg, #E13680 0%, #A43AB2 100%)',
				slug: 'pinky-bordeaux',
			},
			{
				name: __( 'Luminous dusk' ),
				gradient:
					'linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%)',
				slug: 'luminous-dusk',
			},
			{
				name: __( 'Pale ocean' ),
				gradient:
					'linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%)',
				slug: 'pale-ocean',
			},
			{
				name: __( 'Electric grass' ),
				gradient:
					'linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%)',
				slug: 'electric-grass',
			},
			{
				name: __( 'Before Sunset' ),
				gradient: 'linear-gradient(135deg, #FDEB82 0%, #F78FAD 100%)',
				slug: 'before-sunset',
			},
		],
		disableCustomGradients: false,
	};

	return (
		<div className="admin-components-gradient-picker">
			<WPGradientPickerComponent
				value={ value }
				onChange={ onChange }
				{ ...{ ...props } }
			/>
		</div>
	);
};
export default GradientPicker;
