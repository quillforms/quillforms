import { css } from 'emotion';
const EntryDetails = ({ id, attributes, value }) => {
	const { yesLabel, noLabel } = attributes;
	return (
		<div
			className={css`
				display: flex;
				flex-wrap: wrap;
				flex-direction: column;
				align-items: flex-start;
			` }
		>
			<div
				className={css`
					display: inline-flex;
					margin-bottom: 8px;
					padding: 5px 8px;
					border: 1px solid rgb( 184 184 184 );
					border-radius: 3px;
				` }
			>
				{value === 'yes' ? yesLabel : noLabel}
			</div>
		</div>
	);
};
export default EntryDetails;
