/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classnames from 'classnames';

const BorderRadiusTemplates = ( { onChange, attachmentBorderRadius } ) => {
	const arr = [
		'30% 70% 70% 30% / 30% 30% 70% 70%',
		'43% 57% 70% 30% / 37% 37% 63% 63%',
		'39% 56% 40% 60% / 50% 57% 33% 42%',
		'39% 61% 70% 30% / 70% 64% 36% 30%',
		'54% 46% 63% 37% / 52% 48% 52% 48%',
		'39% 61% 70% 30% / 54% 24% 76% 46%',
		'31% 69% 52% 48% / 67% 26% 74% 33%',
		'66% 34% 73% 27% / 39% 58% 42% 61%',
		'87% 12% 100% 10% / 54% 10% 43% 10%',
		'100% 1% 100% 73% / 91% 49% 77% 0%',
	];
	return (
		<div className="block-editor-border-radius-templates">
			{ arr.map( ( template ) => {
				return (
					<div
						key={ template }
						className={ classnames(
							'block-editor-border-radius-template',
							{
								selected: template === attachmentBorderRadius,
							}
						) }
						onClick={ () => {
							onChange( template );
						} }
					>
						<div
							style={ {
								borderRadius: template,
							} }
						></div>
					</div>
				);
			} ) }
		</div>
	);
};

export default BorderRadiusTemplates;
