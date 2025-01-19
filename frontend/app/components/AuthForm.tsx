"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  isSignup: boolean;
}
const BASE_URL = "http://localhost:5000";
const AuthForm: React.FC<AuthFormProps> = ({ isSignup }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const router = useRouter();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignup) {
      try {
        const { username, password } = form;
        const response = await axios.post(`${BASE_URL}/api/v1/users/signup`, {
          data: {
            username: username,
            password: password,
          },
        });
        if (response.status === 201) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { username, password } = form;
        const response = await axios.post(`${BASE_URL}/api/v1/users/signin`, {
          data: {
            username,
            password,
          },
        });
        if (response.status === 201) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <ThemeToggle />
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-white text-black p-6 rounded-md shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">
            {isSignup ? "Sign Up" : "Log In"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-black rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-black rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
            >
              {isSignup ? "Sign Up" : "Log In"}
            </button>
          </form>
          <p className="text-center mt-4 text-sm">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Log In
                </Link>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <Link href="/signup" className="underline">
                  Sign Up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
