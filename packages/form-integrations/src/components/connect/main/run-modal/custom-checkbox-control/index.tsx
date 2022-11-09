interface Props {
	status: 'checked' | 'unchecked' | 'mixed';
	click?: () => void;
}

const CustomCheckboxControl: React.FC< Props > = ( { status, click } ) => {
	return (
		<div className="run-connection-modal-checkbox">
			<input
				readOnly
				tabIndex={ 0 }
				type="checkbox"
				checked={ status === 'checked' || status === 'mixed' }
			/>
			<label
				onClick={ ( e ) => {
					if ( click ) {
						e.stopPropagation();
						click();
					}
				} }
			>
				<svg height="32" width="32" viewBox="0 0 24 24">
					{ status === 'mixed' ? (
						<path d="M7 11h12v2H6z"></path>
					) : (
						<>
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
						</>
					) }
				</svg>
			</label>
		</div>
	);
};

export default CustomCheckboxControl;
