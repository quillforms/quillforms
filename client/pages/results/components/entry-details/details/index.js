/**
 * Internal Dependencies
 */
import EntryField from '../../entry-field';
import EntryVariable from '../../entry-variable';
import EntryHiddenField from '../../entry-hidden-field';

const Details = (props) => {
    const { entry, recordsInfo } = props;

    return (
        <ul>
            {Object.entries(recordsInfo.fields).map(
                ([id, info], index) => {
                    const field =
                        entry.records.fields?.[id] ?? {};
                    return (
                        <EntryField
                            key={id}
                            order={index + 1}
                            name={info.name}
                            label={info?.label}
                            value={field?.readable_value}
                            attributes={info?.attributes}
                            id={id}
                            rawValue={field?.value}
                        ></EntryField>
                    );
                }
            )}
            {Object.entries(recordsInfo.variables ?? {}).map(
                ([id, info]) => {
                    const variable =
                        entry.records.variables?.[id] ?? {};
                    return (
                        <EntryVariable
                            key={id}
                            label={info.label}
                            value={variable.readable_value}
                        />
                    );
                }
            )}
            {Object.entries(recordsInfo.hidden_fields ?? {}).map(
                ([id, info]) => {
                    const hidden_field =
                        entry.records.hidden_fields?.[id] ?? {};
                    return (
                        <EntryHiddenField
                            key={id}
                            label={info.label}
                            value={hidden_field.readable_value}
                        />
                    );
                }
            )}
        </ul>
    );
}

export default Details;