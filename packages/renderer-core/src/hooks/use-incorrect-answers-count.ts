import { useSelect } from '@wordpress/data';

const useIncorrectAnswersCount = () => {
    return useSelect( ( select ) => {
        const { getIncorrectAnswersCount } = select(
            'quillForms/renderer-core'
        );
        return getIncorrectAnswersCount();
    }, [] );
};

export default useIncorrectAnswersCount;