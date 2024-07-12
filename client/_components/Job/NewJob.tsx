"use client"

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const NewJob = () => {
    const [title, setTitle] = useState("");
    const [editorId, setEditorId] = useState("");
    const [editors, setEditors] = useState([]);
    const [additionalComments, setAdditionalComments] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    // const router = useRouter();

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


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newJob = {
            title,
            editorId: editorId,
            additionalComments,
        }
        try {
            const response = await axios.post('http://localhost:5000/api/job/createJob/clxdnpkdy000010z2ftmkuu3f', newJob);
            console.log('Job created successfully:', response.data);
            setShowSuccessPopup(true);

        } catch (error) {
            console.error('Error creating job:', error);
        }
    }


    return (
        <div className="w-full p-12 bg-white flex justify-center items-center">
            <div className="w-1/2 bg-gray-100 p-8 border-2 border-black-500 rounded-2xl">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">New Job</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Fill the below form for creating new job</p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Title
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="title"
                                            name="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            type="text"
                                            autoComplete="text"
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 ">
                                        Editor
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="editor"
                                            name="editor"
                                            autoComplete="editor"
                                            value={editorId}
                                            required
                                            onChange={(e) => setEditorId(e.target.value)}
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
                                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                        Additional Comments
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="additionalcomments"
                                            name="additionalcomments"
                                            value={additionalComments}
                                            onChange={(e) => setAdditionalComments(e.target.value)}
                                            rows={3}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Link href='/jobs' className="text-sm font-semibold leading-6 text-gray-900">Cancel</Link>
                        {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button> */}
                        <button
                            type="submit"
                            className="rounded-md bg-[#FF0000] hover:bg-[#CE3030] px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold">Job Created Successfully</h2>
                        <div className="mt-4 flex justify-end gap-x-4">
                            <Link href='/jobs' className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium text-white">View Jobs</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NewJob;
