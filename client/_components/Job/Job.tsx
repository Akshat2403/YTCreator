"use client";
import React, { useState, useEffect } from "react";
import viewIcon from "../../public/view-eye.svg";
import editIcon from "../../public/icons8-edit.svg";
import deleteIcon from "../../public/icons8-delete.svg";
import uploadIcon from "../../public/upload.png";
import addIcon from "../../public/add.png";
import sortIcon from "../../public/icons8-sort-24.png";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import FormComponent from "../upload/editorUpload";

type Job = {
  id: string;
  authorId: string;
  title: string;
  editorId: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  additionalComments?: string;
  editor?: {
    name: string;
    email: string;
  };
};

const JobTable: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sortKey, setSortKey] = useState<keyof Job>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [update, setupdate] = useState(false);
  const [title, setTitle] = useState("");
  const [editorId, setEditorId] = useState("");
  const [editors, setEditors] = useState([]);
  const [additionalComments, setAdditionalComments] = useState("");
  const [status, setStatus] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:5000/api/job/allJobs/")
      .then((response) => {
        // Assuming the API returns the status along with other fields
        const jobsData = response.data.map((job: any) => ({
          ...job,
          status: job.status, // Set default status if not provided
        }));
        console.log(jobsData);
        setJobs(jobsData);
      })
      .catch((error) => {
        console.error("Error fetching jobs data:", error);
      });
  }, [dataChanged]);

  useEffect(() => {
    const fetch = async () => {
      // console.log("hehhe",localStorage.getItem('user')?.toString().split(',')[0].split(':')[1]);
      axios.defaults.withCredentials = true
      await axios.get(`http://localhost:5000/api/auth/profile`) // Adjust the endpoint as needed
        .then(response => {
          response.data.Creator ? setIsCreator(true) : setIsCreator(false)
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
    fetch();
  }, []);

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(
          "http://localhost:5000/api/job/getAllEditors/"
        );
        setEditors(response.data);
      } catch (error) {
        console.error("Error fetching editors:", error);
      }
    };
    fetchEditors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateJob = {
      title,
      editorId: editorId,
      additionalComments,
      status,
    };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/job/updateJob/${selectedJob!.id}`,
        updateJob
      );
      console.log("Job updated successfully:", response.data);
      const updatedJob = response.data;
      console.log("Updated job:", updatedJob);

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );
      setDataChanged(!dataChanged);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const sortData = (key: keyof Job) => {
    const sortedJobs = [...jobs].sort((a, b) => {
      if (a[key] < b[key]) return sortOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setJobs(sortedJobs);
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleViewClick = (job: Job) => {
    setSelectedJob(job);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setupdate(false);
    setShowPopup(false);
    setSelectedJob(null);
  };

  const handleDeleteButton = (job: Job) => {
    console.log("Deleting job:", job.id);
    axios
      .delete(`http://localhost:5000/api/job/deleteJob/${job.id}`)
      .then((response) => {
        console.log(response.data);
        setJobs(jobs.filter((j) => j.id !== job.id));
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  };

  const handleUpdateButton = (job: Job) => {
    setSelectedJob(job);
    setTitle(job.title);
    setEditorId(job.editorId);
    setAdditionalComments(job.additionalComments || "");
    setStatus(job.status);
    console.log("Updating job:", job.id);
    setupdate(true);
  };

  const handleCloseUpdate = () => {
    setupdate(false);
    setSelectedJob(null);
  };

  return (
    // <div className="w-full p-4 flex flex-col">
    //   <div className="w-full flex flex-col justify-center items-center my-4 gap-4">
    //     <div className="text-6xl font-bold">Jobs</div>
    //     {isCreator && (<div className="flex self-end">
    //       <Link href="/jobs/createJob">
    //         <button className="flex items-center bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
    //           <Image src={addIcon} alt="plus" className="w-4 h-4 mr-2" />
    //           New Job
    //         </button>
    //       </Link>
    //     </div>)}
    //   </div>
    //   <table className="w-full bg-white border border-gray-200 shadow-md">
    //     <thead className="bg-gray-100 w-full">
    //       <tr>
    //         <th
    //           className="w-1/4 py-2 px-4 border-b cursor-pointer"
    //           onClick={() => sortData("title")}
    //         >
    //           Title
    //         </th>
    //         <th
    //           className="w-1/4 py-2 px-4 border-b cursor-pointer"
    //           onClick={() => sortData("authorId")}
    //         >
    //           Creator/Editor
    //         </th>
    //         <th
    //           className="w-1/4 py-2 px-4 border-b cursor-pointer"
    //           onClick={() => sortData("status")}
    //         >
    //           Status
    //         </th>
    //         <th className="w-1/4 py-2 px-4 border-b">Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {jobs.map((job, index) => (
    //         <tr key={index} className="w-full hover:bg-gray-50">
    //           <td className="w-1/4 py-2 px-4 border-b text-center">
    //             {job.title}
    //           </td>
    //           <td className="w-1/4 py-2 px-4 border-b text-center">
    //             {job.editor.user.name}
    //           </td>
    //           <td className="w-1/4 py-2 px-4 border-b text-center">
    //             {job.status ? (
    //               <button className="bg-green-100 text-green-600 text-xs py-1 px-3 rounded-full">
    //                 Complete
    //               </button>
    //             ) : (
    //               <button className="bg-red-100 text-red-600 text-xs py-1 px-3 rounded-full">
    //                 Pending
    //               </button>
    //             )}
    //             {/* {job.status} */}
    //           </td>

    //           <td className="w-1/4 py-2 px-4 border-b text-center">
    //             <button
    //               className="opacity-60 py-1 px-2 rounded mr-2 hover:opacity-100"
    //               onClick={() => handleViewClick(job)}
    //             >
    //               <Image src={viewIcon} alt="view" className="size-4" />
    //             </button>
    //             <button
    //               className="opacity-60 py-1 px-2 rounded mr-2 hover:opacity-100"
    //               onClick={() => handleUpdateButton(job)}
    //             >
    //               <Image src={editIcon} alt="edit" className="size-4" />
    //             </button>
    //             <button
    //               className="opacity-60 py-1 px-2 rounded mr-2 hover:opacity-100"
    //               onClick={() => handleDeleteButton(job)}
    //             >
    //               <Image src={deleteIcon} alt="delete" className="size-4" />
    //             </button>
    //             <button
    //               className="opacity-60 py-1 px-2 rounded mr-2 hover:opacity-100"
    //               onClick={() => handleUploadButton(job)}
    //             >
    //               <Image src={uploadIcon} alt="upload" className="size-4" />
    //             </button> 
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    //   {update && selectedJob && (
    //     <div className="w-full p-12 flex justify-center items-center fixed inset-0 bg-black bg-opacity-50">
    //       <div className="w-1/2 bg-gray-100 p-8 border-2 border-black-500 rounded-2xl">
    //         <form onSubmit={handleSubmit}>
    //           <div className="space-y-12">
    //             <div className="border-b border-gray-900/10 pb-12">
    //               <h2 className="text-base font-semibold leading-7 text-gray-900">
    //                 Edit Job
    //               </h2>
    //               <p className="mt-1 text-sm leading-6 text-gray-600">
    //                 edit the below form for editing job
    //               </p>

    //               <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    //                 <div className="sm:col-span-4">
    //                   <label
    //                     htmlFor="email"
    //                     className="block text-sm font-medium leading-6 text-gray-900"
    //                   >
    //                     Title
    //                   </label>
    //                   <div className="mt-2">
    //                     <input
    //                       id="title"
    //                       name="title"
    //                       value={title}
    //                       onChange={(e) => setTitle(e.target.value)}
    //                       type="text"
    //                       autoComplete="text"
    //                       required
    //                       className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //                     />
    //                   </div>
    //                 </div>

    //                 <div className="sm:col-span-3">
    //                   <label
    //                     htmlFor="country"
    //                     className="block text-sm font-medium leading-6 "
    //                   >
    //                     Editor
    //                   </label>
    //                   <div className="mt-2">
    //                     <select
    //                       id="editor"
    //                       name="editor"
    //                       autoComplete="editor"
    //                       value={editorId}
    //                       required
    //                       onChange={(e) => setEditorId(e.target.value)}
    //                       className="pl-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
    //                     >
    //                       <option value="">Select an Editor</option>
    //                       {editors.map((editor) => (
    //                         <option key={editor.id} value={editor.id}>
    //                           {`${editor.user.name}->${editor.user.email}`}
    //                         </option>
    //                       ))}
    //                     </select>
    //                   </div>
    //                 </div>
    //                 <div className="sm:col-span-6">
    //                   <label
    //                     htmlFor="status"
    //                     className="block text-sm font-medium leading-6 text-gray-900"
    //                   >
    //                     Status
    //                   </label>
    //                   <div className="mt-2">
    //                     <select
    //                       id="status"
    //                       name="status"
    //                       value={status ? "true" : "false"}
    //                       onChange={(e) => setStatus(e.target.value === "true")}
    //                       className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //                     >
    //                       <option value="false">Pending</option>
    //                       <option value="true">Complete</option>
    //                     </select>
    //                   </div>
    //                 </div>
    //                 <div className="col-span-full">
    //                   <label
    //                     htmlFor="about"
    //                     className="block text-sm font-medium leading-6 text-gray-900"
    //                   >
    //                     Additional Comments
    //                   </label>
    //                   <div className="mt-2">
    //                     <textarea
    //                       id="additionalcomments"
    //                       name="additionalcomments"
    //                       value={additionalComments}
    //                       onChange={(e) =>
    //                         setAdditionalComments(e.target.value)
    //                       }
    //                       rows={3}
    //                       className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //                     />
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //           <div className="mt-6 flex items-center justify-end gap-x-6">
    //             {/* <Link href='/jobs' className="text-sm font-semibold leading-6 text-gray-900">Cancel</Link> */}
    //             <button
    //               type="button"
    //               className="text-sm font-semibold leading-6 text-gray-900"
    //               onClick={() => {
    //                 handleCloseUpdate();
    //               }}
    //             >
    //               Cancel
    //             </button>
    //             <button
    //               type="submit"
    //               className="rounded-md bg-[#FF0000] hover:bg-[#CE3030] px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
    //             >
    //               Save
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //       {showSuccessPopup && (
    //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    //           <div className="bg-white p-6 rounded-lg shadow-lg">
    //             <h2 className="text-lg font-semibold">
    //               Job Edited Successfully
    //             </h2>
    //             <div className="mt-4 flex justify-end gap-x-4">
    //               {/* <Link href='/jobs' className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium text-white">View Jobs</Link> */}
    //               <button
    //                 onClick={handleClosePopup}
    //                 className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium text-white"
    //               >
    //                 Close
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   )}
    //   {showPopup && selectedJob && (
    //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    //       <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
    //         <h2 className="text-lg font-semibold">Job Details</h2>
    //         <div className="mt-4">
    //           <p>
    //             <strong>Title: </strong> {selectedJob.title}
    //           </p>
    //           <p>
    //             <strong>Editor: </strong> {selectedJob.editor.user.name}
    //           </p>
    //           <p>
    //             <strong>Status: </strong>{" "}
    //             {selectedJob.status ? "Complete" : "Pending"}
    //           </p>
    //           <p>
    //             <strong>Additional Comments:</strong>{" "}
    //             {selectedJob.additionalComments}
    //           </p>
    //         </div>
    //         <div className="mt-4 flex justify-end">
    //           <button
    //             onClick={handleClosePopup}
    //             className="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
    //           >
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="w-full p-4 flex flex-col">
      <div className="w-full p-12 flex justify-center items-center fixed inset-0 bg-black bg-opacity-50">
        <div className="w-1/4 bg-gray-100 p-8 border-2 border-black-500 rounded-2xl">
          <FormComponent />
        </div>
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">
                Job Edited Successfully
              </h2>
              <div className="mt-4 flex justify-end gap-x-4">
                {/* <Link href='/jobs' className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium text-white">View Jobs</Link> */}
                <button
                  onClick={handleClosePopup}
                  className="bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTable;
