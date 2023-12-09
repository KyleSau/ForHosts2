export default function EditorToggle({ value, onChange, isLoading }: any) {
    return (
        <div className="mb-5 mt-5 flex items-center justify-between text-sm font-medium leading-6 text-gray-900">
            <span>Approximate Address</span>
            <label className="relative inline-flex cursor-pointer items-center space-x-2">
                <input
                    type="checkbox"
                    disabled={isLoading}
                    className="hidden"
                    checked={value}
                    onChange={onChange}
                />
                <div className={`h-6 w-12 bg-${value ? "blue-500" : "gray-300"} rounded-full p-1 transition-transform duration-300`}>
                    <div className={`h-4 w-4 transform rounded-full bg-white shadow-md ${value ? "translate-x-6" : "translate-x-0"}`}></div>
                </div>
            </label>
        </div>
    );
}