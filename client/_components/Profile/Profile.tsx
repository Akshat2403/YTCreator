"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { type } from "os";
import toast from "react-hot-toast";

type User = {
  id: string;
  email: string;
  name?: string;
  roles: string;
  credentials?: Credentials;
};

type Credentials = {
  id: string;
  key: string;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [secretKey, setSecretKey] = useState<string>('');
  const [credStatus, setCredStatus] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [userdata, setUserData] = useState('');
  const [userid, setUserId] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [username, setUserName] = useState('');
  const [editors, setEditors] = useState([]);
  const [selectedEditor, setSelectedEditor] = useState('');
  // const [test,settest]=useState({});
  // console.log(userid);

  // Fetch user details
  useEffect(() => {
    const res = JSON.parse(localStorage.getItem('user') || "");
    // settest(res);
    // console.log(test)
    // console.log(res.id)
    setUserId(res.id);
    setUserEmail(res.email);
    setUserName(res.name);
    const fetch = async () => {
      // console.log("hehhe",localStorage.getItem('user')?.toString().split(',')[0].split(':')[1]);
      axios.defaults.withCredentials = true
      await axios.get(`http://localhost:5000/api/auth/profile`)// Adjust the endpoint as needed
        .then(response => {
          setUser(response.data),
            response.data.Creator ? (setIsCreator(true), response.data.Creator.credentials ? setCredStatus(true) : setCredStatus(false)) : setIsCreator(false)
          // response.data.credentials ? setCredStatus(true) : setCredStatus(false)
        })
        .catch(error => {
          toast.error(error.response.data.message);
          console.error('Error fetching user data:', error)
        });
      await axios.get(`http://localhost:5000/api/auth/getAllEdtiors`) // Adjust the endpoint as needed
        .then(response => {
          setEditors(response.data.data)
          console.log(response.data.data)
        })
        .catch(error => {
          toast.error(error.response.data.message);
          console.error('Error fetching editors:', error)
        });
    }
    fetch();
  }, []);

  // Create or Update Credentials
  const handleCredentialSubmit = async (e: React.FormEvent) => {
    const res = JSON.parse(localStorage.getItem('user') || "");
    e.preventDefault();
    if (!file) {
      toast.error("No file selected");
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("secret_key", secretKey);
    const url = credStatus
      ? `http://localhost:5000/api/credentials/updateCredentials/${res.id}`
      : `http://localhost:5000/api/credentials/addCredentials/${res.id}`;
    const method = credStatus ? "PUT" : "POST";
    try {
      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Credentials added successfully:", response.data);
      toast.success(response.data);
      setFile(null);
      setSecretKey("");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error saving credentials:", error);
    }
  };

  const handleEditorConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', selectedEditor);
    console.log("email:", selectedEditor);
    const url = `http://localhost:5000/api/auth/addEditor`;
    const method = 'POST';
    try {
      const response = await axios({
        method,
        url,
        data: { email: selectedEditor },
        // headers: {
        //     'Content-Type': 'multipart/form-data',
        // },
        withCredentials: true,
      });
      toast.success(response.data);
      console.log('Editor Connected successfully:', response.data);
      setSelectedEditor('');
    } catch (error) {
      toast.error(error.response.data.message);
      console.error('Error saving credentials:', error);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col bg-transparent">
      <>
        <h1 className="text-2xl font-bold">User Profile</h1>
        <div className="my-4">
          <p>
            <strong>Email:</strong> {useremail}
          </p>
          <p>
            <strong>Name:</strong> {username}
          </p>
          <p>
            <strong>Roles:</strong> {isCreator ? "Creator" : "Editor"}{" "}
          </p>
        </div>

        {isCreator && (<div className="my-4">
          <h2 className="text-xl font-bold">Add Editors</h2>
          <div className="flex gap-4">
            <form onSubmit={handleEditorConnect} className="flex flex-col gap-4">
              <select className="p-2 border rounded" onChange={(e) => setSelectedEditor(e.target.value)}>
                <option value="">Select Editor</option>
                {editors.map(editor => (
                  <option key={editor.id} value={editor.user.email}>{`${editor.user.name}->${editor.user.email}`}</option>
                ))}
              </select>
              <button className="bg-blue-500 text-white py-2 px-4 rounded" type='submit'>Add</button>
            </form>
          </div>
        </div>)}

        {isCreator && (
          <div className="my-4">
            <h2 className="text-xl font-bold">
              {credStatus ? "Update" : "Add"} Credentials
            </h2>
            <form
              onSubmit={handleCredentialSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="file"
                accept=".json"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
                className="p-2 border rounded"
              />
              {credStatus && (
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Update Credentials
                </button>
              )}
              {!credStatus && (
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Add Credentials
                </button>
              )}
            </form>
          </div>
        )}
      </>
    </div>
  );
};

export default Profile;
