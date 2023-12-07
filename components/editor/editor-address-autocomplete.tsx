"use client"
import PlacesAutocomplete from "react-places-autocomplete";

export default function EditorAddressAutocomplete({ value, onChange, onSelect, error }: any) {
    return (
        <div>
            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                Address
            </label>
            <PlacesAutocomplete value={value} onChange={onChange} onSelect={onSelect}>
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: "Search for an address...",
                                className: `pl-1 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${error
                                    ? "border-red-500"
                                    : ""
                                    }`,
                            })}
                        />
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => (
                            <div {...getSuggestionItemProps(suggestion)} key={suggestion.id}>
                                {suggestion.description}
                            </div>
                        ))}
                    </div>
                )}
            </PlacesAutocomplete>
            {error && <div className="mt-2 text-sm text-red-600">{error.toString()}</div>}
        </div>
    );
}
