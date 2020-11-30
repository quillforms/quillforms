/**
 * WordPress Dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { FixedSizeList as List } from 'react-window';
import pick from 'lodash/pick';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';

/**
 * Internal Dependencies
 */
import FontItem from './font-item';

const FontPicker = ( { fonts, selectedFont, setFont } ) => {
	const [ showList, setShowList ] = useState( false );
	const [ searchKeyword, setSearchKeyword ] = useState( '' );
	const filteredFonts = pick(
		fonts,
		Object.keys( fonts ).filter( ( key ) =>
			key.toLowerCase().includes( searchKeyword.toLowerCase() )
		)
	);
	const selectedFontIndex = Object.keys( fonts ).findIndex(
		( fontKey ) => fontKey === selectedFont
	);
	const filteredFontsKeys = Object.keys( filteredFonts );
	const wrapperRef = useRef();
	const searchRef = useRef();
	const listRef = useRef();

	const handleClickOutside = ( e ) => {
		if ( wrapperRef.current && ! wrapperRef.current.contains( e.target ) ) {
			setShowList( false );
		}
	};

	// Attaching the previous event with UseEffect hook
	useEffect( () => {
		// Bind the event listener
		document.addEventListener( 'mousedown', handleClickOutside );
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	} );

	useEffect( () => {
		if ( showList ) {
			searchRef.current.focus();
			setSearchKeyword( '' );
			listRef.current.scrollToItem( selectedFontIndex, 'center' );
		} else {
			setSearchKeyword( '' );
		}
	}, [ showList ] );

	return (
		<div className="builder-components-font-picker">
			<div
				role="presentation"
				className={ classNames(
					'builder-components-font-picker__select',
					{ hidden: showList }
				) }
				onClick={ () => setShowList( true ) }
			>
				<div className="builder-components-font-picker__selected-font">
					{ selectedFont }
				</div>
				<ExpandMoreIcon />
			</div>
			{ showList && (
				<div
					className="builder-components-font-picker__fonts-search-wrapper"
					ref={ wrapperRef }
				>
					<div className="builder-components-font-picker__search">
						<SearchIcon />
						<input
							ref={ searchRef }
							className="builder-components-font-picker__input"
							type="text"
							value={ searchKeyword }
							onChange={ ( e ) =>
								setSearchKeyword( e.target.value )
							}
						/>
					</div>
					<List
						ref={ listRef }
						overscanCount={ 12 }
						className="builder-components-font-picker__fonts-list"
						height={ filteredFontsKeys.length > 0 ? 250 : 20 }
						itemCount={ filteredFontsKeys.length }
						itemSize={ 35 }
					>
						{ ( { index, style } ) => {
							return (
								<div
									role="presentation"
									className={
										'builder-components-font-picker__fonts-list-item' +
										( filteredFontsKeys[ index ] ===
										selectedFont
											? ' selected'
											: '' )
									}
									style={ style }
									onClick={ () => {
										setFont( filteredFontsKeys[ index ] );
										setTimeout( () => {
											setShowList( false );
										}, 100 );
									} }
								>
									<FontItem
										font={ filteredFontsKeys[ index ] }
										fontType={
											filteredFonts[
												filteredFontsKeys[ index ]
											]
										}
									/>
								</div>
							);
						} }
					</List>
				</div>
			) }
		</div>
	);
};
export default FontPicker;
