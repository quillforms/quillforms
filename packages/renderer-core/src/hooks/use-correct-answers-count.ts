import { useSelect } from '@wordpress/data';

const useCorrectAnswersCount = () => {
    return useSelect( ( select ) => {
        const { getCorrectAnswersCount } = select(
            'quillForms/renderer-core'
        );
        return getCorrectAnswersCount();
    }, [] );
};

export default useCorrectAnswersCount;