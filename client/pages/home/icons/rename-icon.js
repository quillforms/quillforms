const RenameIcon = ({ color = '#334155', width = 32, height = 32 }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 32 32" fill="none">
  <path d="M12.4004 8H18.4004M18.4004 8H24.4004M18.4004 8V24.8M18.4004 24.8H12.4004M18.4004 24.8H24.4004" stroke={color} stroke-width="1.2" stroke-linecap="round"/>
  <path d="M14.8 12.7998H6.4C5.07452 12.7998 4 13.8743 4 15.1998V18.6665C4 19.4029 4.59695 19.9998 5.33333 19.9998H14.8" stroke={color} stroke-width="1.2" stroke-linecap="round"/>
  <path d="M22 19.9998H25.6C26.9255 19.9998 28 18.9253 28 17.5998V14.1331C28 13.3968 27.403 12.7998 26.6667 12.7998H22" stroke={color} stroke-width="1.2" stroke-linecap="round"/>
</svg>
	);
};

export default RenameIcon;
