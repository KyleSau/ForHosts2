interface ListingDetailsSelectProps {
    formik: any;
    label: string;
    name: string;
    options: string[];
}

export default function ListingDetailsSelect({ formik, label, name, options }: ListingDetailsSelectProps) {
    return (
        <>
            <label htmlFor={name} className="col-start-1 block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="col-span-1 col-start-3 flex items-center sm:col-span-3 sm:col-start-5 md:col-span-2 md:col-start-4">
                <select id={name} name={name} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full rounded-md border p-2">
                    <option value="" disabled>Select {label}</option>
                    {options.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
        </>
    );
}