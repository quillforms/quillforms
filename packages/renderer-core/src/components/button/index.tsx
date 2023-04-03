/**
 * External dependencies
 */
import { FormTheme } from '@quillforms/types/src';
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import useTheme from '../../hooks/use-theme';
import ArrowIcon from './arrow-icon';

interface Props {
	className?: string;
	onClick: React.MouseEventHandler< HTMLDivElement >;
	onKeyDown?: React.KeyboardEventHandler< HTMLDivElement >;
	theme?: FormTheme;
	children: React.ReactNode;
}
const Button: React.FC< Props > = ( {
	className,
	onClick,
	children,
	onKeyDown,
	theme,
	...props
} ) => {
	if ( ! theme ) theme = useTheme();
	return (
		<button
			tabIndex={ 0 }
			className={ classnames(
				'renderer-core-button',
				className,
				css`
					position: relative;
					background: ${ theme.buttonsBgColor };
					color: ${ theme.buttonsFontColor };
					box-shadow: none !important;
					outline: none !important;
					z-index: 1;
					border-radius: ${ theme.buttonsBorderRadius }px;
					border-width: ${ theme.buttonsBorderWidth }px;
					border-color: ${ theme.buttonsBorderColor };
					border-style: solid;
					&:before {
						position: absolute;
						top: -2.5px;
						bottom: -2.5px;
						right: -2.5px;
						left: -2.5px;
						border: 2px solid #fff;
						z-index: -1;
						border-radius: 5px;
					}
					&:after {
						position: absolute;
						top: -4.5px;
						bottom: -4.5px;
						right: -4.5px;
						left: -4.5px;
						background: ${ theme.buttonsBgColor };
						z-index: -2;
						border-radius: 6px;
					}

					&:focus-visible:after,
					&:focus-visible:before {
						content: '';
					}

					&:focus:not( :focus-visible ):after,
					&:focus:not( :focus-visible ):before {
						outline: none;
						box-shadow: none;
						display: none;
					}
					svg {
						transition: all 0.2s;
					}
					&:hover svg {
						transform: translateX( 3px );
					}

					@media ( min-width: 768px ) {
						& {
							font-size: ${ theme.buttonsFontSize.lg };
							padding: ${ theme.buttonsPadding.top.lg }
								${ theme.buttonsPadding.right.lg }
								${ theme.buttonsPadding.bottom.lg }
								${ theme.buttonsPadding.left.lg };
						}
					}

					@media ( max-width: 767px ) {
						& {
							font-size: ${ theme.buttonsFontSize.sm };
							padding: ${ theme.buttonsPadding.top.sm }
								${ theme.buttonsPadding.right.sm }
								${ theme.buttonsPadding.bottom.sm }
								${ theme.buttonsPadding.left.sm };
						}
					}
				`
			) }
			role="presentation"
			// @ts-ignore
			onClick={ onClick }
			// @ts-ignore
			onKeyDown={ onKeyDown }
			{ ...props }
		>
			{ children }
			<ArrowIcon theme={ theme } />
		</button>
	);
};

export default Button;
