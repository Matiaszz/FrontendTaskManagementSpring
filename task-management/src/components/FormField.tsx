import { Dispatch, SetStateAction } from "react";

interface FormFieldProps {
    action: Dispatch<SetStateAction<string>>;
    field: string,
    type?: string,
    isRequired?: boolean
}

const FormField = ({ action, field, type = "text", isRequired = true }: FormFieldProps) => {
    return (
        <div>
            <label htmlFor={field}>{field}:</label>
            <input
                type={type}
                id={field}
                required
                onChange={(e) => action(e.target.value)}
            />
        </div>
    );
};

export default FormField;
