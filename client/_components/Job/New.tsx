"use client"

import React, { useState, FormEvent, useEffect } from 'react'
import axios from 'axios'

export default function Page() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [editors, setEditors] = useState<{ id: string; name: string; email: string }[]>([]);

    useEffect(() => {
        const fetchEditors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/job/getAllEditors/');
                setEditors(response.data);
            } catch (error) {
                console.error('Error fetching editors:', error);
            }
        }
        fetchEditors();
    }, [])

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null) // Clear previous errors when a new request starts

        try {
            const formData = new FormData(event.currentTarget)

            // Log the form data
            formData.forEach((value, key) => {
                console.log(key, value);
            });

            const response = await fetch('http://localhost:5000/api/job/createJob/clxdnpkdy000010z2ftmkuu3f', {
                method: 'POST',
                body: formData,
            })

            const rawResponseText = await response.text();
            console.log('Raw response:', rawResponseText);

            if (!response.ok) {
                console.error('Response not OK:', rawResponseText);
                throw new Error('Failed to submit the data. Please try again.');
            }

            // Attempt to parse the JSON response
            const data = JSON.parse(rawResponseText);
            console.log('Parsed response:', data);
            // ...handle success (e.g., display a success message or redirect)
        } catch (error: any) {
            // Capture the error message to display to the user
            setError(error.message)
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                            Title
                        </label>
                        <div className="mt-2">
                            <input
                                id="title"
                                name="title"
                                type="text"
                                autoComplete="text"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="editor" className="block text-sm font-medium leading-6 text-gray-900">
                            Editor
                        </label>
                        <div className="mt-2">
                            <select
                                id="editor"
                                name="editorId" // Ensure the name matches what the server expects
                                autoComplete="editor"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option value="">Select an Editor</option>
                                {editors.map((editor) => (
                                    <option key={editor.id} value={editor.id}>
                                        {editor.name} ({editor.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="additionalComments" className="block text-sm font-medium leading-6 text-gray-900">
                            Additional Comments
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="additionalComments"
                                name="additionalComments"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="mt-6 btn btn-primary">
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}
