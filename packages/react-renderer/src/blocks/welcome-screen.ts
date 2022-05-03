import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-welcome-screen-block";

registerBlockType(name, {...metadata, ...rendererSettings});
