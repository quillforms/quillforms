/**
 * WordPress Dependencies
 */
import { isRTL } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { css, keyframes } from '@quillforms/utils';

const moveUp = keyframes({
	'0%': {
		transform: 'translateY(100%)',
	},
	'100%': {
		transform: 'translateY(0%)',
	},
});

const moveDown = keyframes({
	'0%': {
		transform: 'translateY(0%)',
	},
	'100%': {
		transform: 'translateY(100%)',
	},
});

const getBackgroundImageCSS = (theme) => {
	let backgroundImageCSS = '';
	if (theme.backgroundImage && theme.backgroundImage) {
		backgroundImageCSS = `background-image: url('${theme.backgroundImage
			}');
			background-size: cover;
			background-position: ${
			// @ts-expect-error
			parseFloat(theme.backgroundImageFocalPoint?.x) * 100
			}%
			${
			// @ts-expect-error
			parseFloat(theme.backgroundImageFocalPoint?.y) * 100
			}%;

			background-repeat: no-repeat;
		`;
	}
	return backgroundImageCSS;
};

export const FixedDropdown = (theme) => css`
	position: fixed;
	inset: 0;
	height: 100% !important;
	display: flex;
	background-color: #fff;
	flex-direction: column;
	z-index: 111111111;

	&.show {
		transform: translateY(100%);
		animation: ${moveUp} 0.5s ease-in-out 1 forwards;
	}

	&.hide {
		transform: translateY(0%);
		animation: ${moveDown} 0.5s ease-in-out 1 forwards;
	}
	> div {
		background: ${theme.backgroundColor};
		${getBackgroundImageCSS(theme)};
		padding: 20px 10px;
		overflow-y: auto;
		height: 100% !important;
	}
	.back-icon {
		width: 20px;
		height: 20px;
		margin-right: 5px;
		fill: ${theme.questionsColor} !important
	}
}`;

const vibrate = keyframes({
	'0%': {
		transform: 'scale( 1 )',
	},

	'25%': {
		transform: 'scale( 0.97 )',
	},

	'50%': {
		transform: 'scale( 0.99 )',
	},

	'75%': {
		transform: 'scale( 0.97 )',
	},

	'100%': {
		transform: 'scale( 1 )',
	},
});

export const DropdownChoices = css`
	& {
		position: absolute;
		top: 112%;
		right: 0;
		left: 0;
		padding-top: 15px;
		border-radius: 5px;
		width: 100%;
		overflow-y: auto;
		transition: transform, opacity 0.3s linear;
		z-index: 11111;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-10px);
	}

	&.visible {
		max-height: 300px;
		visibility: visible;
		opacity: 1;
		transform: none;
	}

	&.fixed-choices {
		position: static;
		height: auto !important;
		padding: 10px 20px;
	}


}`;

export const DropdownChoiceWrapper = css`
	& {
		padding: 10px;
		margin-bottom: 8px;
		border-width: 1px;
		border-style: solid;
		border-radius: 5px;
		cursor: pointer;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}
	&:last-child {
		margin-bottom: 0;
	}

	&.isBeingSelected {
		animation: ${vibrate} 0.4s linear forwards;
	}
}`;
export const iconStyles = css`
	position: absolute;
	${isRTL() ? `left: 0` : `right: 0`};
	bottom: 4px;
	cursor: pointer;

	svg {
		width: 26px;
		height: 26px;
	}
`;
