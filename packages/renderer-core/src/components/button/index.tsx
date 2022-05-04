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
		<div
			tabIndex={ 0 }
			className={ classnames(
				'renderer-core-button',
				className,
				css`
					position: relative;
					background: ${ theme.buttonsBgColor };
					color: ${ theme.buttonsFontColor };
					z-index: 1;
					border-radius: ${ theme.buttonsBorderRadius }px;
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
				`
			) }
			role="presentation"
			onClick={ onClick }
			onKeyDown={ onKeyDown }
			{ ...props }
		>
			{ children }
			<ArrowIcon theme={ theme } />
		</div>
	);
};

export default Button;
