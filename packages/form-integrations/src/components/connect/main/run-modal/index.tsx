/**
 * QuillForms Dependencies
 */
import { useParams } from '@quillforms/navigation';
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Modal } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { ThreeDots, TailSpin } from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import { useConnectContext } from '../../state/context';
import CustomCheckboxControl from './custom-checkbox-control';

interface Props {
	id: string;
	name: string;
	close: () => void;
}

const RunModal: React.FC< Props > = ( { id, name, close } ) => {
	const formId = useParams().id;
	const { provider, connections } = useConnectContext();
	const connection = connections[ id ];

	const [ entries, setEntries ] = useState< null | any | false >( null );
	const [ selected, setSelected ] = useState< number[] >( [] );
	const [ result, setResult ] = useState< {
		status: string;
		message?: JSX.Element;
	} >( {
		status: 'ready',
	} );

	// on mount fetch entries ids & dates & statuses.
	useEffect( () => {
		apiFetch( {
			path: `/qf/v1/forms/${ formId }/entries?records=false&meta=true`,
			method: 'GET',
		} )
			.then( ( res: any ) => {
				setEntries( res?.items );
			} )
			.catch( ( err ) => {
				console.log( 'Error: ', err );
				setEntries( false );
			} );
	}, [] );

	const run = () => {
		setResult( {
			status: 'running',
		} );
		apiFetch( {
			path: `/qf/v1/addons/${ provider.slug }/run-connection`,
			method: 'POST',
			data: {
				connection_id: id,
				connection,
				form_id: formId,
				entry_ids: selected,
			},
			// @ts-ignore
		} ).then( ( res: any ) => {
			const message = (
				<div>
					<div>Processing selected entries has completed.</div>
					{ !! res.results.succeeded.length && (
						<div>
							{ res.results.succeeded.length } entries has
							succeeded.
						</div>
					) }
					{ !! res.results.failed.length && (
						<div>
							{ res.results.failed.length } entries has failed.
						</div>
					) }
					{ !! res.results.skipped.length && (
						<div>
							{ res.results.skipped.length } entries has been
							skipped.
						</div>
					) }
					<div>Check log for details.</div>
				</div>
			);
			setResult( {
				status: 'done',
				message: message,
			} );
		} );
	};

	return (
		<Modal
			className="integration-run-connection-modal"
			title={ `Run connection: ${ name }` }
			onRequestClose={ close }
			shouldCloseOnClickOutside={ false }
		>
			<div>
				{ entries === null || result.status === 'running' ? (
					<div className="run-connection-modal-loading">
						<ThreeDots color="#8640e3" height={ 50 } width={ 50 } />
					</div>
				) : entries === false ? (
					<div>Error occurred at fetching entries.</div>
				) : result.status === 'done' ? (
					<div style={ { marginTop: '20px' } }>
						{ result.message }
					</div>
				) : (
					<>
						<div className="run-connection-modal-list">
							<div className="list-header">
								<CustomCheckboxControl
									status={
										selected.length === 0
											? 'unchecked'
											: entries.length === selected.length
											? 'checked'
											: 'mixed'
									}
									click={ () => {
										if ( selected.length === 0 ) {
											setSelected(
												entries.map(
													( entry: any ) => entry.ID
												)
											);
										} else {
											setSelected( [] );
										}
									} }
								/>
								<span>{ `${ entries.length } responses in total` }</span>
							</div>
							{ entries.map( ( entry: any ) => {
								const status =
									entry.meta[
										`${ provider.slug }_connection_${ id }_process_status`
									]?.value ?? null;
								const statusStyles = {};
								if ( status === 'succeeded' ) {
									statusStyles[ 'color' ] = '#36c3a9';
								} else if ( status === 'failed' ) {
									statusStyles[ 'color' ] = '#d40000';
								}
								return (
									<div
										key={ entry.ID }
										className="list-item"
										onClick={ () => {
											const checked = ! selected.includes(
												entry.ID
											);
											let _selected = [ ...selected ];
											if ( checked ) {
												_selected.push( entry.ID );
											} else {
												_selected = _selected.filter(
													( item ) => item != entry.ID
												);
											}
											setSelected( _selected );
										} }
									>
										<CustomCheckboxControl
											status={
												selected.includes( entry.ID )
													? 'checked'
													: 'unchecked'
											}
										/>
										<div className="list-item-id">
											{ entry.ID }{ ' ' }
											<small style={ statusStyles }>
												{ status ?? '' }
											</small>
										</div>
										<div className="list-item-date">
											{ entry.date_created }
										</div>
									</div>
								);
							} ) }
						</div>
						<div className="run-connection-modal-footer">
							<Button
								isPrimary
								isLarge
								className="save-button"
								onClick={ run }
								disabled={
									result.status === 'running' ||
									selected.length === 0
								}
							>
								{ result.status === 'running' ? (
									<>
										Running{ ' ' }
										<TailSpin
											color="#fff"
											height={ 16 }
											width={ 16 }
											wrapperStyle={ {
												paddingLeft: '6px',
												paddingTop: '7px',
											} }
										/>
									</>
								) : (
									<>Run</>
								) }
							</Button>
							<Button
								isDefault
								isLarge
								className="cancel-button"
								onClick={ close }
							>
								Cancel
							</Button>
						</div>
					</>
				) }
			</div>
		</Modal>
	);
};

export default RunModal;
