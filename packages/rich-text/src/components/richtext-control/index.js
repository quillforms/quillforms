/**
 * WordPress Dependencies
 */
import {
	useMemo,
	useCallback,
	useEffect,
	useState,
	Fragment,
} from '@wordpress/element';
import { autop } from '@wordpress/autop';

/**
 * External Dependencies
 */
import { debounce } from 'lodash';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import createEditor from '../../create-editor';
import deserialize from '../../html-deserialize';
import serialize from '../../html-serialize';
import moveFocusToEnd from '../../focus';
import RichTextEditor from '../editor';

const RichTextControl = ( {
	value,
	setValue,
	mergeTags,
	className,
	forceFocusOnMount = false,
} ) => {
	const [ jsonVal, setJsonVal ] = useState( [
		{
			type: 'paragraph',
			children: [
				{
					text: '',
				},
			],
		},
	] );

	const editor = useMemo(
		() =>
			createEditor( {
				withReact: true,
				withMergeTags: true,
				withHistory: true,
				withLinks: true,
			} ),

		[]
	);

	// serializeVal is a debounced function that updates the store with serialized html value
	const serializeVal = useCallback(
		debounce( ( newVal ) => {
			setValue( serialize( newVal ) );
		}, 200 ),
		[]
	);

	const onChange = ( newVal ) => {
		setJsonVal( newVal );
		serializeVal( newVal );
	};

	// Deserialize value on mount.
	useEffect( () => {
		//moveEditor( editor );
		if ( forceFocusOnMount ) {
			setTimeout( () => {
				moveFocusToEnd( editor );
			}, 0 );
		}
		setJsonVal( deserialize( autop( value ) ) );
	}, [] );

	const TextEditor = useMemo(
		() => (
			<RichTextEditor
				value={ jsonVal }
				editor={ editor }
				onChange={ onChange }
				mergeTags={ mergeTags }
			/>
		),
		[ JSON.stringify( jsonVal ), JSON.stringify( mergeTags ) ]
	);

	return (
		<div
			className={ classnames(
				'builder-components-rich-text-control',
				className
			) }
		>
			<Fragment>
				{ TextEditor }
				{ mergeTags?.length > 0 && (
					<Fragment>
						<div
							className="builder-components-rich-text-control__add-variables"
							role="presentation"
						>
							<AddCircleIcon />
						</div>
					</Fragment>
				) }
			</Fragment>
		</div>
	);
};

export default RichTextControl;
