import { css } from 'emotion';
const EntryDetails = ( { id, attributes, value } ) => {
	const { choices } = attributes;
	return (
		<div
			className={ css`
				display: flex;
				flex-wrap: wrap;
				flex-direction: column;
				align-items: flex-start;
			` }
		>
			{ value.map( ( x, index ) => {
				const choiceIndex = choices.findIndex( ( a ) => a.value === x );
				let choiceLabel = 'Choice ' + ( choiceIndex + 1 );
				if ( choices[ choiceIndex ].label ) {
					choiceLabel = choices[ choiceIndex ].label;
				}
				return (
					<div
						key={ index }
						className={ css`
							display: inline-flex;
							margin-bottom: 8px;
							padding: 5px 8px;
							border: 1px solid rgb( 184 184 184 );
							border-radius: 3px;
						` }
					>
						{ choiceLabel }
					</div>
				);
			} ) }
		</div>
	);
};
export default EntryDetails;
