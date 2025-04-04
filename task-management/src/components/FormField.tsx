import { Dispatch, SetStateAction } from "react";

interface FormFieldProps {
    action: Dispatch<SetStateAction<string>>;
    field: string,
    value: string,
    type?: string,
    isRequired?: boolean
}

const FormField = ({ action, field, value, type = "text", isRequired = true }: FormFieldProps) => {
    return (
        <div>
            <label htmlFor={field}>{field}:</label>
            <input
                type={type}
                id={field}
                required={isRequired}
                value={value}
                onChange={(e) => action(e.target.value.trim())}
            />
        </div>
    );
};

export default FormField;
