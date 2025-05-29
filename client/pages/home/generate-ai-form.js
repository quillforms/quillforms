import { useState } from '@wordpress/element';
import { Button, TextControl, SelectControl, TextareaControl, CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { getHistory, getNewPath } from '@quillforms/navigation';
import { useSelect } from '@wordpress/data';
import { keys } from 'lodash';

const GenerateAIForm = ({ closeModal }) => {
    const [prompt, setPrompt] = useState('');
    const [formType, setFormType] = useState('');
    const [industry, setIndustry] = useState('');
    const [complexity, setComplexity] = useState('medium');
    const [includeLogic, setIncludeLogic] = useState(false);
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const { blockTypes } = useSelect((select) => {
        const { getBlockTypes } = select('quillForms/blocks');
        return {
            blockTypes: getBlockTypes(),
        };
    }, []);
    const handleGenerateForm = async () => {
        if (!prompt) {
            setError(__('Please provide a description of the form you want to create', 'quillforms'));
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Using WordPress's built-in AJAX handler
            const response = await apiFetch({
                path: '/quillforms/v1/generate-form',
                method: 'POST',
                data: {
                    prompt,
                    formType,
                    industry,
                    complexity,
                    includeLogic,
                    additionalInstructions,
                    availableBlocks: keys(blockTypes)
                }
            });

            if (response.success) {
                // Create the form with the generated structure
                createFormWithBlocks(response.form);

            } else {
                setError(response.error?.message || __('Failed to generate form', 'quillforms'));
            }
        } catch (err) {
            setError(__('Network error. Please try again.', 'quillforms'));
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    function createFormWithBlocks(formData) {
        console.log('Creating form with blocks:', formData);
        apiFetch({
            path: '/wp/v2/quill_forms',
            method: 'POST',
            data: {
                title: formData.title,
                status: 'publish',
                blocks: formData.blocks,
            }
        }).then((res) => {
            const { id } = res;
            getHistory().push(getNewPath({}, `/forms/${id}/builder`));
        });
    }

    return (
        <div className="quillforms-ai-form-generator">
            <h2>{__('Generate Form with AI', 'quillforms')}</h2>

            <div className="form-field">
                <TextareaControl
                    label={__('Describe the form you want to create', 'quillforms')}
                    value={prompt}
                    onChange={setPrompt}
                    placeholder={__('E.g., Create a job application form with personal details, education, work experience, and skills sections', 'quillforms')}
                    rows={4}
                />
            </div>

            <div className="form-field">
                <TextControl
                    label={__('Form Type (optional)', 'quillforms')}
                    value={formType}
                    onChange={setFormType}
                    placeholder={__('E.g., contact, survey, registration', 'quillforms')}
                />
            </div>

            <div className="form-field">
                <TextControl
                    label={__('Industry (optional)', 'quillforms')}
                    value={industry}
                    onChange={setIndustry}
                    placeholder={__('E.g., healthcare, education, real estate', 'quillforms')}
                />
            </div>

            <div className="form-field">
                <SelectControl
                    label={__('Complexity', 'quillforms')}
                    value={complexity}
                    options={[
                        { label: __('Simple', 'quillforms'), value: 'simple' },
                        { label: __('Medium', 'quillforms'), value: 'medium' },
                        { label: __('Complex', 'quillforms'), value: 'complex' }
                    ]}
                    onChange={setComplexity}
                />
            </div>

            <div className="form-field">
                <CheckboxControl
                    label={__('Include conditional logic', 'quillforms')}
                    checked={includeLogic}
                    onChange={setIncludeLogic}
                />
            </div>

            <div className="form-field">
                <TextareaControl
                    label={__('Additional Instructions (optional)', 'quillforms')}
                    value={additionalInstructions}
                    onChange={setAdditionalInstructions}
                    placeholder={__('Any specific requirements or details', 'quillforms')}
                    rows={2}
                />
            </div>

            <div className="form-actions">
                <Button
                    isPrimary
                    onClick={handleGenerateForm}
                    disabled={isGenerating || !prompt.trim()}
                >
                    {isGenerating ? __('Generating...', 'quillforms') : __('Generate Form with AI', 'quillforms')}
                </Button>

                <Button
                    isSecondary
                    onClick={closeModal}
                >
                    {__('Cancel', 'quillforms')}
                </Button>
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default GenerateAIForm;