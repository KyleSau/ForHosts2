export default function PolicySettings({ data }) {

    const id = data["id"];
    const desc = data["description"];

    return (
        <div>
            <div className="bg-gray-500">{id}</div>
            <div className="bg-gray-500">{desc}</div>
            <div className="flex-auto flex flex-row-reverse">
                <button
                    type="submit" // Specify the button type as "submit" to trigger form submission
                    className="rounded-md hover:scale-110 duration-200 ease-in-out transition bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save
                </button>

            </div>
        </div>
    )
}