import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-dropdown-block";

registerBlockType(name, {...metadata, ...rendererSettings});
