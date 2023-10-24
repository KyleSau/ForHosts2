import IncrementDecrementButton from "./increment-decrement-button";

interface ListingDetailsIncrementProps {
    formik: any;
    label: string;
    name: string;
}

export default function ListingDetailsIncrement({ formik, label, name }: ListingDetailsIncrementProps) {
    return (
        <>
            <label htmlFor={name} className="col-start-1 block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="col-start-3 flex flex-col md:col-start-4">
                <IncrementDecrementButton value={formik.values[name]} setValue={(newValue) => formik.setFieldValue(name, newValue)} />
                {formik.touched[name] && formik.errors[name] && (
                    <div className="mt-2 text-sm text-red-600">{formik.errors[name].toString()}</div>
                )}
            </div>
        </>
    );
}