import { useBlockTypes } from "@quillforms/renderer-core"

const PartialSubmissionPointContent = () => {
    const blockTypes = useBlockTypes();
    const BlockTypeContent = blockTypes['partial-submission-point'].display;

    return <BlockTypeContent />;
}
export default PartialSubmissionPointContent;