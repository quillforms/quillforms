//@ts-ignore
import registerDataBlock from './blocks/date';
//@ts-ignore
import registerDropdownBlock from './blocks/dropdown';
//@ts-ignore
import registerEmailBlock from './blocks/email';
//@ts-ignore
import registerLongTextBlock from './blocks/long-text';
//@ts-ignore
import registerMultipleChoiceBlock from './blocks/multiple-choice';
//@ts-ignore
import registerNumberBlock from './blocks/number';
//@ts-ignore
import registerShortTextBlock from './blocks/short-text';
//@ts-ignore
import registerSliderBlock from './blocks/slider';
//@ts-ignore
import registerStatementBlock from './blocks/statement';
//@ts-ignore
import registerWebsiteBlock from './blocks/website';
//@ts-ignore
import registerWelcomeScreenBlock from './blocks/welcome-screen';
//@ts-ignore
import registerGroupBlock from './blocks/group';
//@ts-ignore
import registerThankYouScreenBlock from './blocks/thank-you-screen';

const registerCoreBlocks = () => {
	registerDataBlock();
	registerDropdownBlock();
	registerEmailBlock();
	registerLongTextBlock();
	registerMultipleChoiceBlock();
	registerNumberBlock();
	registerShortTextBlock();
	registerStatementBlock();
	registerWebsiteBlock();
	registerWelcomeScreenBlock();
	registerGroupBlock();
	registerSliderBlock();
	registerThankYouScreenBlock();
};

export default registerCoreBlocks;
