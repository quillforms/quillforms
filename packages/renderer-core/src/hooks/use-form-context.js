/**
 * WordPress Dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { FormContext } from '../components/form-context';

const useFormContext = () => useContext( FormContext );

export default useFormContext;
