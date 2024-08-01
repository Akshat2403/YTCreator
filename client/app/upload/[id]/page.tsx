"use client";
import NavBar from "@/_components/NavBar/NavBar";
import axios from "axios";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FormComponent = () => {
  const router = useRouter();
  const params = useSearchParams();
  console.log(params.get("code"));
  const [submitting, setSubmitting] = useState(
    params.get("code") ? "Upload" : "Authourize"
  );
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
    secret_key: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    if (submitting === "Authourize") {
      setSubmitting("Authorizing");
      const response = await axios.post(
        "http://localhost:5000/api/video/auth",
        {
          secret_key: formData.secret_key,
        },
        {
          withCredentials: true,
        }
      );
      router.push(response.data.url);
    }
    console.log(formData);
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-lg"
        >
          {submitting === "Upload" && (
            <>
              <h2 className="text-2xl mb-4">Form</h2>

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
                <label className="block text-gray-700">URL</label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
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
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Secret Key</label>
            <input
              type="text"
              name="secret_key"
              value={formData.secret_key}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {submitting}
          </button>
        </form>
      </div>
    </>
  );
};

export default FormComponent;
