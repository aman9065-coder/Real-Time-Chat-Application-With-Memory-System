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

  // const onSubmit = async (data) => {
  //   console.log(data)
  //   try {
  //     const res = await api.post("/login", data);

  //     console.log(res.user._id)

  //     toast.success("Login Successful ✅");


  //     reset();

  //     // redirect after login
  //     setTimeout(() => navigate("/"), 1500);

  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.message || "Login failed ❌"
  //     );
  //   }
  // };

  const onSubmit = async (data) => {
  try {
    const res = await api.post("/auth/login", {
      email: data.email.trim(),
      password: data.password.trim()
    });
   

    if (res.status === 200) {
      toast.success("Login success");
      // console.log(res.data.user._id)
      navigate("/");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto mt-10 p-6 rounded-2xl shadow-lg flex flex-col gap-4"
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
        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
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
        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
      >
        Login
      </button>

    </form>
  );
};

export default Login;
