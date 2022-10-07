/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { css } from 'emotion';

const BlockLayout = ( { layout, setAttributes } ) => {
	layout = layout ?? 'stack';
	return (
		<div className="block-editor-block-layouts">
			<BoxWrapper
				onClick={ () => {
					setAttributes( {
						layout: 'stack',
					} );
				} }
				isSelected={ layout === 'stack' }
			>
				<div
					className={ css`
						padding: 0 11px;
					` }
				>
					<TextSymbol isHeading={ true } />
					<div
						className={ css`
							width: 24px;
							height: 15px;
							background: #7c7c7c;
							margin: 4px 0;
						` }
					></div>
					<TextSymbol />
				</div>
			</BoxWrapper>
			<BoxWrapper
				onClick={ () => {
					setAttributes( {
						layout: 'float-right',
					} );
				} }
				isSelected={ layout === 'float-right' }
			>
				<FloatingBox />
			</BoxWrapper>
			<BoxWrapper
				onClick={ () => {
					setAttributes( {
						layout: 'float-left',
					} );
				} }
				isSelected={ layout === 'float-left' }
			>
				<FloatingBox direction="left" />
			</BoxWrapper>

			<BoxWrapper
				onClick={ () => {
					setAttributes( {
						layout: 'split-right',
					} );
				} }
				isSelected={ layout === 'split-right' }
			>
				<SplitBox />
			</BoxWrapper>
			<BoxWrapper
				onClick={ () => {
					setAttributes( {
						layout: 'split-left',
					} );
				} }
				isSelected={ layout === 'split-left' }
			>
				<SplitBox direction="left" />
			</BoxWrapper>
		</div>
	);
};

const BoxWrapper = ( { children, isSelected, onClick } ) => {
	return (
		<div
			className={ css`
				width: 56px;
				height: 40px;
				border: 1px solid ${ isSelected ? '#a120f1' : '#7c7c7c' };
				border-radius: 5px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				cursor: pointer;
				${ ! isSelected &&
				`&:hover {
					border-color: #424141;
				 > div div {
					background: #424141;
				}` }
				${ isSelected &&
				` > div div {
					background: #a120f1
				}` }
			` }
			onClick={ onClick }
		>
			{ children }
		</div>
	);
};
const TextSymbol = ( { isHeading }: { isHeading?: boolean } ) => {
	return (
		<div
			className={ css`
				height: 2px;
				width: ${ isHeading ? `16px` : `12px` };
				background: #7c7c7c;
			` }
		></div>
	);
};

const FloatingBox = ( { direction = 'right' } ) => {
	return (
		<div
			className={ css`
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				flex-direction: ${ direction === 'right'
					? 'row'
					: 'row-reverse' };
			` }
		>
			<div
				className={ css`
					background: transparent !important;
				` }
			>
				<TextSymbol isHeading={ true } />
				<div
					className={ css`
						margin: 4px 0;
						background: transparent !important;
					` }
				></div>
				<TextSymbol />
			</div>
			<div
				className={ css`
					width: 16px;
					height: 12px;
					background: #7c7c7c;
				` }
			></div>
		</div>
	);
};

const SplitBox = ( { direction = 'right' } ) => {
	return (
		<div
			className={ css`
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				flex-direction: ${ direction === 'right'
					? 'row'
					: 'row-reverse' };
			` }
		>
			<div
				className={ css`
					background: transparent !important;
				` }
			>
				<TextSymbol isHeading={ true } />
				<div
					className={ css`
						margin: 4px 0;
						background: transparent !important;
					` }
				></div>
				<TextSymbol />
			</div>
			<div
				className={ css`
					width: 50%;
					min-height: 36px;
					border-radius: 3px;
					background: #7c7c7c;
				` }
			></div>
		</div>
	);
};
export default BlockLayout;
