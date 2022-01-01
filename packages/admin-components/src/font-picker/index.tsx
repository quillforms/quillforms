/**
 * WordPress Dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';
import { search, chevronDown } from '@wordpress/icons';
import { Icon } from '@wordpress/components';
/**
 * External Dependencies
 */
import { FixedSizeList as List } from 'react-window';
import { pick } from 'lodash';
import classNames from 'classnames';

/**
 * Internal Dependencies
 */
import FontItem from './font-item';

interface Props {
	fonts: Record< string, string >;
	selectedFont: string;
	setFont: ( font: string ) => void;
}
const FontPicker: React.FC< Props > = ( { fonts, selectedFont, setFont } ) => {
	const [ showList, setShowList ] = useState< boolean >( false );
	const [ searchKeyword, setSearchKeyword ] = useState< string >( '' );
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
	const wrapperRef = useRef< HTMLDivElement | null >( null );
	const searchRef = useRef< HTMLInputElement | null >( null );
	const listRef = useRef< List | null >( null );

	const handleClickOutside = ( e: MouseEvent ) => {
		if (
			e.target &&
			wrapperRef.current &&
			! wrapperRef.current.contains( e.target as Node )
		) {
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
			searchRef?.current?.focus();
			setSearchKeyword( '' );
			listRef?.current?.scrollToItem( selectedFontIndex, 'center' );
		} else {
			setSearchKeyword( '' );
		}
	}, [ showList ] );

	return (
		<div className="admin-components-font-picker">
			<div
				role="presentation"
				className={ classNames(
					'admin-components-font-picker__select',
					{ hidden: showList }
				) }
				onClick={ () => setShowList( true ) }
			>
				<div className="admin-components-font-picker__selected-font">
					{ selectedFont }
				</div>
				<Icon icon={ chevronDown } />
			</div>
			{ showList && (
				<div
					className="admin-components-font-picker__fonts-search-wrapper"
					ref={ wrapperRef }
				>
					<div className="admin-components-font-picker__search">
						<Icon icon={ search } />
						<input
							ref={ searchRef }
							className="admin-components-font-picker__input"
							type="text"
							value={ searchKeyword }
							onChange={ ( e ) =>
								setSearchKeyword( e.target.value )
							}
						/>
					</div>
					<List
						width={ '100%' }
						ref={ listRef }
						overscanCount={ 12 }
						className="admin-components-font-picker__fonts-list"
						height={ filteredFontsKeys.length > 0 ? 250 : 20 }
						itemCount={ filteredFontsKeys.length }
						itemSize={ 35 }
					>
						{ ( { index, style } ) => {
							return (
								<div
									role="presentation"
									className={
										'admin-components-font-picker__fonts-list-item' +
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
