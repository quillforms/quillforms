import { useSelect } from '@wordpress/data';
import ThemesList from '../themes-list';
import Customize from '../customize';
const ThemeRender = () => {
    const { currentTab } = useSelect(select => {
        return {
            currentTab: select('quillForms/theme-editor').getCurrentTab()
        }
    })
    return (
        <>
            {currentTab === 'themes-list' && <ThemesList />}
            {currentTab === 'customize' && <Customize />}

        </>
    )
}

export default ThemeRender;