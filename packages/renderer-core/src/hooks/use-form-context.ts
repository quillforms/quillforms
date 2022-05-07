/**
 * WordPress Dependencies
 */
import { useContext } from 'react';

/**
 * Internal Dependencies
 */
import { FormContext } from '../components/form-context';

const useFormContext = () => useContext( FormContext );

export default useFormContext;
