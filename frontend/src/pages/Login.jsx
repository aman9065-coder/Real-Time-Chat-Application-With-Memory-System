import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Login = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();


  const onSubmit = async (data) => {
  try {
    const res = await api.post("/auth/login", {
      email: data.email.trim(),
      password: data.password.trim()
    });
   

    if (res.status === 200) {
      toast.success("Login success");
      // mark as logged in (simple client-side flag)
      localStorage.setItem('isLoggedIn', 'true');
      // notify same-tab listeners
      window.dispatchEvent(new Event('auth-change'));
      // console.log(res.data.user._id)
      navigate("/home");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto mt-12 p-6 rounded-2xl shadow-lg bg-[#0f1724] text-gray-100 flex flex-col gap-4"
    >

      <h2 className="text-2xl font-semibold text-center text-white">
        Login
      </h2> 

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        autoComplete="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Invalid email format"
          }
        })}
        className="w-full px-4 py-2 bg-[#0b1220] border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-400 text-gray-100"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 3,
            message: "Password must be at least 3 characters"
          }
        })}
        className="w-full px-4 py-2 bg-[#0b1220] border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-400 text-gray-100"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <button
        type="submit"
        className="w-full bg-emerald-500 text-black py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        Login
      </button> 

      <div className="text-center text-sm text-gray-600">
        Don't have an account? <a href="/register" className="text-white font-medium">Register</a>
      </div>

    </form>
  );
};

export default Login;
