"use client";
import { FormEventHandler, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState("creator");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = async (e) => {
    e.preventDefault();
    console.log("start");
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        role,
        name,
        email,
        password,
      }
    );
    console.log(response);
    if (response.status == 201) {
      router.push("/login");
    } else {
      toast.error(response.data.message);
      console.log("Error");
    }
  };
  return (
    <div className="flex h-screen flex-col  bg-gray-100 justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700">
          SignUp to YTCreator
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={register}>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium leading-6 text-gray-400"
            >
              Sign Up as
            </label>
            <div className="mt-2">
              <select
                id="role"
                name="role"
                onChange={(e) => setRole(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1  ring-gray-300 placeholder:text-gray-400 focus:ring-2  focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="creator">Creator</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-400"
            >
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-2 text-gray-800 shadow-sm ring-1  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus: focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-400"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-400 shadow-sm ring-1  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus: focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-400"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Already have an account?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-400 shadow-sm ring-1  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus: focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#ff0000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
