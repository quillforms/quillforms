/**
 * WordPress Dependencies
 */
import { isRTL } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { css, keyframes } from '@quillforms/utils';

const vibrate = keyframes({
	'0%': {
		transform: 'scale(1)',
	},
	'25%': {
		transform: 'scale(0.94)',
	},
	'50%': {
		transform: 'scale(0.98)',
	},
	'75%': {
		transform: 'scale(0.95)',
	},
	'100%': {
		transform: 'scale(1)',
	},
});
export const MultipleChoiceOptions = css`
	& {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: stretch;
		width: 100%;
		margin-block-end: -8px; */
		margin-inline-end: 8px;
		column-gap: 8px;
	}
	&.valigned {
		display: inline-flex;
		flex-direction: column;
		max-width: 100%;
		align-items: stretch;
		width: auto;
	}
	&:not(.valigned) {

		.multipleChoice__optionWrapper {
			width: calc(33% - 7px);
			min-width: 160px;
			flex: 1 0 31%;
   		 	max-width: calc(33% - 3px);
			@media(max-width: $break-small) {
				width: calc(50% - 7px);
				min-width: 160px;
			ZZZZZZZZZZZZZ	flex: 1 0 48%;
				max-width: calc(50% - 3px);
			}

		}
	}

	.multipleChoice__optionWrapper {
		& {
			display: flex;
			flex-direction: row;
			align-items: center;
			min-width: 215px;
			flex: 1 1 0%;
			cursor: pointer;
			padding: 10px;
			margin-bottom: 7px;
			box-shadow: none;
			outline: none;
			position: relative;
			border-style: solid;
			border-width: 1px;
			appearance: none;
			text-align: ${isRTL() ? 'right' : 'left'};
			user-select: none;
			backface-visibility: hidden;
			-webkit-backface-visibility: hidden;

			@media(max-width: $break-small) {
				margin: 0 16px 10px 0;
				padding: 8px 10px;
				border-radius: 4px;
			}
		}


		&:hover .multipleChoice__optionKey .multipleChoice__optionKeyTip {
			visibility: visible !important;
			opacity: 1 !important;
			transform: none !important;
		}

		&.clicked {
			animation: ${vibrate} 0.4s linear forwards;
		}

		&.correct {
			background: #7bc178 !important;
			border-color: #5da458 !important;
		}

		&.wrong {
			background: #d4494c;
			border-color: #ffa39e;
			
		}

		&.correct, &.wrong {
			color: #fff;
			.multipleChoice__optionKey {
				background: transparent !important;
				border-color: #fff !important;
				color: #fff !important;
			}
			
		}

		.multipleChoice__optionLabel {
			flex-grow: 1;
			padding-right: 12px;
			overflow-wrap: break-word;
			// max-width: calc(100% - 27px);
		}

		.multipleChoice__optionKey {
			& {
				position: relative;
				width: 27px;
				height: 27px;
				min-width: 27px;
   				min-height: 27px;
				line-height: 0;
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				border-width: 1px;
				border-style: solid;
				font-size: 14px;
			}

			.multipleChoice__optionKeyTip {
				position: absolute;
				top: -25px;
				font-size: 10px;
				line-height: 1em;
				font-weight: bold;
				text-transform: uppercase;
				padding: 2px 3px;
				border-radius: 2px;
				transition: 0.2s all ease-in-out;
				transform: translateY(5px);
				visibility: hidden;
				opacity: 0;
			}
		}
	}
}`;
