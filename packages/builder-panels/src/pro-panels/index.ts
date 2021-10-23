/**
 * QuillForms Dependencies
 */
/**
 * Internal Dependencies
 */
import { registerBuilderPanel } from '../api/register-builder-panel';
import JumpLogicIcon from './logic-icon';
import CalculatorIcon from './calculator-icon';
import JumpLogicRender from './jump-logic-render';
import CalculatorRender from './calculator-render';
registerBuilderPanel( 'jump-logic', {
	title: 'Jump Logic',
	mode: 'single',
	areaToShow: 'preview-area',
	icon: JumpLogicIcon,
	render: JumpLogicRender,
	position: 20,
} );

registerBuilderPanel( 'calculator', {
	title: 'Calculator',
	mode: 'single',
	areaToShow: 'preview-area',
	icon: CalculatorIcon,
	render: CalculatorRender,
	position: 21,
} );
