//import "emoji-mart/css/emoji-mart.css";
import data from './emojis.json';
import NimblePicker from 'emoji-mart/dist-es/components/picker/nimble-picker';

import { Fragment, useState } from '@wordpress/element';
import Popover from '@material-ui/core/Popover';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import Tooltip from '@material-ui/core/Tooltip';

const EmojiPicker = ( props ) => {
	const { emojiSelect } = props;
	const [ anchorEl, setAnchorEl ] = useState( null );

	const handleClick = ( event ) => {
		setAnchorEl( event.currentTarget );
	};

	const handleClose = () => {
		setAnchorEl( null );
	};
	const open = Boolean( anchorEl );
	const id = open ? 'emojis-popover' : undefined;
	const selectHandler = ( emoji ) => {
		setAnchorEl( null );
		emojiSelect( emoji );
	};

	return (
		<Fragment>
			<Tooltip
				disableFocusListener={ true }
				disableTouchListener={ true }
				title="Insert Emoji"
				placement="bottom"
			>
				<div
					role="button"
					tabIndex="-1"
					className="editor__tagfaces-icon"
					onMouseDown={ handleClick }
				>
					<TagFacesIcon />
				</div>
			</Tooltip>
			<Popover
				id={ id }
				open={ open }
				anchorEl={ anchorEl }
				onClose={ handleClose }
				anchorOrigin={ {
					vertical: 'bottom',
					horizontal: 'center',
				} }
				transformOrigin={ {
					vertical: 'top',
					horizontal: 'center',
				} }
			>
				<NimblePicker
					title="Pick your emoji…"
					set="apple"
					data={ data }
					include={ [ 'people', 'foods', 'activity' ] }
					onSelect={ selectHandler }
				/>
			</Popover>
		</Fragment>
	);
};
export default EmojiPicker;
