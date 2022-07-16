const RendererWrapper = () => {
	const [ jsonVal, setJsonVal ] = useState< Node[] >( [
		{
			type: 'paragraph',
			children: [
				{
					text: 'bbb',
				},
			],
		},
	] );
};
