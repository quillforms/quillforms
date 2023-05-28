/**
 * WordPress dependencies
 */
import { useDispatch } from "@wordpress/data";

const useRendererStoreActions = () => {
    return useDispatch('quillForms/renderer-core');
}
export default useRendererStoreActions