import cn from "@/utils/cn";

/**
 * FormField.jsx
 * Reusable form field wrapper — label + input + error message.
 * Used across all auth forms and future forms.
 *
 * Usage:
 *   <FormField label="Email" error={errors.email?.message}>
 *     <input {...register("email")} className={inputClass(errors.email)} />
 *   </FormField>
 */
const FormField = ({ label, error, children, className }) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && <label className="label">{label}</label>}
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default FormField;