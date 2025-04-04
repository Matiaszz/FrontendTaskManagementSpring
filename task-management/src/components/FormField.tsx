import { Dispatch, SetStateAction, useId } from "react";

interface FormFieldProps {
    action: Dispatch<SetStateAction<string>>;
    field: string;
    value: string;
    type?: string;
    isRequired?: boolean;
}

const FormField = ({
    action,
    field,
    value,
    type = "text",
    isRequired = true,
}: FormFieldProps) => {
    const inputId = useId();
    const inputHasValue = value.length > 0;

    return (
        <div className="relative w-full">
            <input
                type={type}
                id={inputId}
                required={isRequired}
                value={value}
                onChange={(e) => action(e.target.value)}
                className="peer w-full px-3 pt-5 pb-2 text-sm text-white bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <label
                htmlFor={inputId}
                className={`absolute left-3 text-sm text-gray-400 transition-all pointer-events-none
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400
                ${inputHasValue ? "top-1 text-xs text-blue-400" : "top-3.5"}`}
            >
                {field}
            </label>
        </div>
    );
};

export default FormField;
