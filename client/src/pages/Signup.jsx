import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/errorMessage";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      toast.error("All fields are required.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      await signup(form);
      toast.success("Account created successfully.");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Signup failed. Please try again."),
      );
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="mx-auto w-full max-w-md rounded-2xl border border-amber-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-amber-950 sm:text-3xl">
              Create your account
            </h1>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100 sm:px-4 sm:text-sm"
            >
              Back
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Start storing and organizing your files in seconds.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div>
              <label className="text-sm font-medium text-amber-950">
                Username
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-amber-500"
                value={form.username}
                onChange={(e) =>
                  setForm((s) => ({ ...s, username: e.target.value }))
                }
                placeholder="Your display name"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-amber-950">
                Email
              </label>
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-amber-500"
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value.trim() }))
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-amber-950">
                Password
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-amber-500"
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
                placeholder="Minimum 6 characters"
                minLength={6}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 rounded-xl bg-linear-to-r from-amber-700 to-amber-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-amber-700/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-amber-800 transition-colors hover:text-amber-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Signup;
