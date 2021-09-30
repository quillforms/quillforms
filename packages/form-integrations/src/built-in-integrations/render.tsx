import { StoreAddon } from '@quillforms/config/build-types/types/store-addons';

interface Props {
	slug: string;
	addon: StoreAddon;
}

const Render: React.FC< Props > = ( { slug, addon } ) => {
	return (
		<div>
			{ slug } { addon.name }
		</div>
	);
};

export default Render;
