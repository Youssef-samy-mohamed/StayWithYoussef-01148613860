import { Path, FieldValues, UseFormRegister } from "react-hook-form";



type InputProps<TFieldValue extends FieldValues> = {
  name: Path<TFieldValue>;
  label: string;
  type?: string;
  register: UseFormRegister<TFieldValue>;
  error: string | undefined;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  formText?: string;
  success?: string;
  disabled?: boolean;
};


const Input = <TFieldValue extends FieldValues>({
  label,
  type = "text",
  register,
  error,
  name,
  onBlur,
  formText,
  success,
  disabled,
}: InputProps<TFieldValue>) => {

    const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur(e);
        register(name).onBlur(e);
      } else {
        register(name).onBlur(e);
      }
    };
  return (
    <>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <input
          type={type}
          {...register(name)}
          onBlur={onBlurHandler}
          disabled={disabled}
          className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 
      ${
        error
          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
          : success
          ? "border-green-500 focus:ring-green-500 focus:border-green-500"
          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      } 
      ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
    `}
        />

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {!error && success && (
          <p className="text-green-500 text-xs mt-1">{success}</p>
        )}
        {formText && <p className="text-gray-500 text-xs mt-1">{formText}</p>}
      </div>


      
    </>
  );
};

export default Input;
