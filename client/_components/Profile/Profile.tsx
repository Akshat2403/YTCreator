"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const userid = localStorage.getItem('user')?.toString().split(',')[0].split(':')[1];
    const useremail = localStorage.getItem('user')?.toString().split(',')[1].split(':')[1];
    const username = localStorage.getItem('user')?.toString().split(',')[2].split(':')[1];
    // console.log(userid);

    // Fetch user details
    useEffect(() => {
        axios.get(`http://localhost:5000/api/auth/profile/${userid?.substring(1, userid?.length - 1)}`) // Adjust the endpoint as needed

            .then(response => {
                setUser(response.data),
                    response.data.Creator ? (setIsCreator(true), response.data.Creator.credentials ? setCredStatus(true) : setCredStatus(false)) : setIsCreator(false)
                // response.data.credentials ? setCredStatus(true) : setCredStatus(false)
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    // Create or Update Credentials
    const handleCredentialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('secret_key', secretKey);
        const url = credStatus ? `http://localhost:5000/api/credentials/updateCredentials/${userid?.substring(1, userid?.length - 1)}` : `http://localhost:5000/api/credentials/addCredentials/${userid?.substring(1, userid?.length - 1)}`;
        const method = credStatus ? 'PUT' : 'POST';
        try {
            const response = await axios({
                method,
                url,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Credentials added successfully:', response.data);
            setFile(null);
            setSecretKey('');
        } catch (error) {
            console.error('Error saving credentials:', error);
        }
    };

    return (
        <div className="w-full p-4 flex flex-col bg-transparent">
            <>
                <h1 className="text-2xl font-bold">User Profile</h1>
                <div className="my-4">
                    <p><strong>Email:</strong> {useremail?.substring(1, useremail.length - 1)}</p>
                    <p><strong>Name:</strong> {username?.substring(1, username.length - 1)}</p>
                    <p><strong>Roles:</strong> {isCreator ? "Creator" : "Editor"} </p>
                </div>

                <div className="my-4">
                    <h2 className="text-xl font-bold">Add Editors</h2>
                    <div className="flex gap-4">
                        <select className="p-2 border rounded">
                            {/* Add options for editors */}
                        </select>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded">Add</button>
                    </div>
                </div>



                {isCreator && (<div className="my-4">
                    <h2 className="text-xl font-bold">{credStatus ? 'Manage' : 'Add'} Credentials</h2>
                    <form onSubmit={handleCredentialSubmit} className="flex flex-col gap-4">
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
                        {credStatus && (<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                            Manage Credentials
                        </button>)}
                        {!credStatus && (<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                            Add Credentials
                        </button>)}
                    </form>
                </div>)}
            </>
        </div>
    );
};

export default Profile;
