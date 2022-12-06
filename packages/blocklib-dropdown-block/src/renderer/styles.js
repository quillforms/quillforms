/**
 * WordPress Dependencies
 */
import { isRTL } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { css, keyframes } from '@quillforms/utils';

const moveUp = keyframes( {
	'0%': {
		transform: 'translateY(100%)',
	},
	'100%': {
		transform: 'translateY(0%)',
	},
} );

const moveDown = keyframes( {
	'0%': {
		transform: 'translateY(0%)',
	},
	'100%': {
		transform: 'translateY(100%)',
	},
} );

export const FixedDropdown = css`
	position: fixed;
	inset: 0;
	background-color: #fff;
	height: 100% !important;
	display: flex;
	flex-direction: column;
	padding: 20px 10px;
	z-index: 11;

	&.show {
		transform: translateY(100%);
		animation: ${ moveUp } 0.5s ease-in-out 1 forwards;
	}

	&.hide {
		transform: translateY(0%);
		animation: ${ moveDown } 0.5s ease-in-out 1 forwards;
	}

	.back-icon {
		width: 20px;
		height: 20px;
		margin-right: 5px;
	}
}`;

const vibrate = keyframes( {
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
} );

export const DropdownChoices = css`
	& {
		position: absolute;
		top: 100%;
		right: 0;
		left: 0;
		padding-top: 15px;
		width: 100%;
		height: 0;
		overflow-y: auto;
		transition: transform, opacity 0.3s linear;
		z-index: 11111;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-10px);
	}

	&.visible {
		height: 300px;
		visibility: visible;
		opacity: 1;
		transform: none;
	}

	&.fixed-choices {
		position: static;
		height: auto !important;
		padding: 10px 20px;
	}

	.dropdown__choiceWrapper {
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

		&.isBeingSelected {
			animation: ${ vibrate } 0.4s linear forwards;
		}
	}
}`;

export const iconStyles = css`
	position: absolute;
	${ isRTL() ? `left: 0` : `right: 0` };
	bottom: 4px;
	cursor: pointer;

	svg {
		width: 26px;
		height: 26px;
	}
`;
