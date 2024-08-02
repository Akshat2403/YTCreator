"use client";
import NavBar from "@/_components/NavBar/NavBar";
import axios from "axios";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FormProps = {
    jobid: string;
};

const FormComponent = ({ jobid: jobid }: FormProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: "",
        category: "",
        forKids: false,
        thumbnail: "",
        isVerified: false,
        tags: "",
        formats: "",
        privacyStatus: "",
        video: null
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if (type === "file") {
            setFormData({
                ...formData,
                video: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formdata = new FormData();

        formdata.append('title', formData.title);
        formdata.append('description', formData.description);
        formdata.append('url', formData.url);
        formdata.append('category', formData.category);
        formdata.append('forKids', formData.forKids.toString());
        formdata.append('thumbnail', formData.thumbnail);
        formdata.append('isVerified', formData.isVerified.toString());
        formdata.append('tags', formData.tags); // Assuming tags is an array
        formdata.append('formats', formData.formats); // Assuming formats is an array or object
        formdata.append('privacyStatus', formData.privacyStatus);
        const videoFile = document.querySelector('#video');
        formdata.append('video', formData.video);
        console.log(formData.video)
        try {
            axios.defaults.withCredentials = true;
            // axios.defaults.headers['Content-Type'] = 'multipart/form-data';
            // axios.defaults.headers=origi
            const response = await axios.post(`http://localhost:5000/api/video/editorUpload/${jobid}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            console.log('Video added successfully:', response.data);

        } catch (error) {
            console.error('Error creating job:', error);
        }
    }

    return (
        <>
            <div className="w-full h-full flex justify-center items-center bg-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="h-full bg-white p-6 rounded shadow-md w-full overflow-y-scroll"
                >
                    <h2 className="text-2xl mb-4">Editor Upload Form</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Video File</label>
                        <input
                            id="video"
                            type="file"
                            name="video"
                            // value={formData.url}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4 flex justify-between">
                        <label className="block text-gray-700">For Kids</label>
                        <input
                            type="checkbox"
                            name="forKids"
                            checked={formData.forKids}
                            onChange={handleChange}
                            className="mr-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Thumbnail URL</label>
                        <input
                            type="text"
                            name="thumbnail"
                            value={formData.thumbnail}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4 flex justify-between">
                        <label className="block text-gray-700 ">Is Verified</label>
                        <input
                            type="checkbox"
                            name="isVerified"
                            checked={formData.isVerified}
                            onChange={handleChange}
                            className="mr-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Formats</label>
                        <input
                            type="text"
                            name="formats"
                            value={formData.formats}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Privacy Status</label>
                        <input
                            type="text"
                            name="privacyStatus"
                            value={formData.privacyStatus}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default FormComponent;
