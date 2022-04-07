/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * External Dependencies
 */
import { FixedSizeList as List } from 'react-window';
import { cloneDeep } from 'lodash';

/**
 * Internal Dependencies
 */
import { ChoiceContextProvider } from './choices-context';
import ChoiceWrapper from './choice-wrapper';
import ChoiceRow from './choice-row';
import __experimentalDragDropContext from '../drag-drop-context';
import __experimentalDroppable from '../droppable';
import generateChoiceId from './generate-choice-id';
import type { Choices } from '../choices-bulk-btn/types';

interface Props {
	choices: Choices;
	setChoices: ( choices: Choices ) => void;
	withAttachment: boolean;
}
const ChoicesInserter: React.FC< Props > = ( {
	choices,
	setChoices,
	withAttachment,
} ) => {
	const labelChangeHandler = ( val: string, index: number ) => {
		const $choices = cloneDeep( choices );
		$choices[ index ] = { ...$choices[ index ], label: val };
		setChoices( $choices );
	};

	const addChoice = ( at: number ) => {
		const $choices = cloneDeep( choices );
		$choices.splice( at, 0, {
			value: generateChoiceId(),
			label: '',
		} );
		setChoices( $choices );
	};

	const deleteChoice = ( value: string ) => {
		const newChoices = cloneDeep( choices ).filter(
			( choice ) => choice.value !== value
		);
		setChoices( newChoices );
	};

	const deleteImageHandler = ( index ) => {
		const $choices = cloneDeep( choices );
		$choices[ index ].imageUrl = undefined;
		setChoices( $choices );
	};
	const handleMediaUpload = ( media, index ) => {
		const $choices = cloneDeep( choices );
		$choices[ index ].imageUrl = media.url;
		setChoices( $choices );
	};

	const context = {
		addChoice,
		labelChangeHandler,
		deleteChoice,
		deleteImageHandler,
		handleMediaUpload,
		withAttachment,
	};

	return (
		<__experimentalDragDropContext
			onDragEnd={ ( result ) => {
				const { source, destination } = result;
				if (
					! result.destination ||
					result.source.index === result.destination.index
				) {
					return;
				}

				const sourceIndex = source.index;
				const destinationIndex = destination?.index;
				const $choices = [ ...choices ];
				const output = Array.from( $choices );
				const [ removed ] = output.splice( sourceIndex, 1 );
				if ( destinationIndex !== undefined ) {
					output.splice( destinationIndex, 0, removed );
					setChoices( output );
				}
			} }
		>
			<ChoiceContextProvider
				// It is important to return the same object if props haven't
				// changed to avoid  unnecessary rerenders.
				// See https://reactjs.org/docs/context.html#caveats.
				value={ useMemo( () => context, Object.values( context ) ) }
			>
				<__experimentalDroppable
					droppableId="CHOICES_DROP_AREA"
					mode="virtual"
					renderClone={ ( provided, _snapshot, rubric ) => {
						return (
							<div
								{ ...provided.draggableProps }
								{ ...provided.dragHandleProps }
								ref={ provided.innerRef }
								style={ {
									...provided.draggableProps.style,
								} }
							>
								<ChoiceRow
									choices={ choices }
									index={ rubric.source.index }
									provided={ provided }
								/>
							</div>
						);
					} }
				>
					{ ( provided, snapshot ) => {
						const itemCount = snapshot.isUsingPlaceholder
							? choices.length + 1
							: choices.length;

						return (
							<div
								ref={ provided.innerRef }
								{ ...provided.droppableProps }
							>
								<List
									className="admin-components-choices-inserter__choices-wrapper"
									outerRef={ provided.innerRef }
									height={ 250 }
									width={ '100%' }
									itemCount={ itemCount }
									itemSize={ 54 }
									itemData={ choices }
								>
									{ ChoiceWrapper }
								</List>
							</div>
						);
					} }
				</__experimentalDroppable>
			</ChoiceContextProvider>
		</__experimentalDragDropContext>
	);
};

export default ChoicesInserter;
