/**
 * QuillForms Dependencies
 */
/**
 * Internal Dependencies
 */
import { registerBuilderPanel } from '@quillforms/builder-panels';
import JumpLogicIcon from './logic-icon';
import CalculatorIcon from './calculator-icon';
import HiddenFieldsIcon from './hidden-fields-icon';
import FormLockerIcon from './form-locker-icon';
import JumpLogicRender from './jump-logic-render';
import CalculatorRender from './calculator-render';
import HiddenFieldsRender from './hidden-fields-render';
import FormLockerRender from './form-locker-render';
import SaveAndContinueIcon from './save-and-continue-icon';
import SaveAndContinueRender from './save-and-continue-render';

registerBuilderPanel('jump-logic', {
	title: 'Jump Logic',
	mode: 'single',
	areaToShow: 'preview-area',
	icon: JumpLogicIcon,
	render: JumpLogicRender,
	position: 20,
});

registerBuilderPanel('calculator', {
	title: 'Calculator',
	mode: 'single',
	areaToShow: 'preview-area',
	icon: CalculatorIcon,
	render: CalculatorRender,
	position: 21,
});

registerBuilderPanel('hidden-fields', {
	title: 'Hidden Fields',
	mode: 'single',
	areaToShow: 'preview-area',
	icon: HiddenFieldsIcon,
	render: HiddenFieldsRender,
	position: 21,
});

registerBuilderPanel('save-and-continue', {
	title: 'Save and Continue',
	mode: 'single',
	areaToShow: 'preview-area',
	icon: SaveAndContinueIcon,
	render: SaveAndContinueRender,
	position: 22,
});

registerBuilderPanel('form-locker', {
	title: 'Form Locker',
	mode: 'single',
	areaToShow: 'preview-area',
	icon: FormLockerIcon,
	render: FormLockerRender,
	position: 23,
});
