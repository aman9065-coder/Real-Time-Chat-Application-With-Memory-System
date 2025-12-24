import { useForm } from "react-hook-form";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate= useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

 const onSubmit = async (data) => {
  const payload = {
    fullName: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
    email: data.email,
    password: data.password,
  };

  try {
    await api.post("/auth/register", payload);

    toast.success("Register Successful ✅");

    reset();

    setTimeout(() => navigate("/login"), 1500);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Registration failed ❌"
    );
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto mt-10 p-6 rounded-2xl shadow-lg flex flex-col gap-4"
    >

      <h2 className="text-2xl font-semibold text-center text-white">
        Register
      </h2>

      {/* First Name */}
      <input
        type="text"
        placeholder="First Name"
        {...register("firstName", {
          required: "First name is required",
          minLength: {
            value: 3,
            message: "Minimum 3 characters"
          }
        })}
        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.firstName && (
        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
      )}

      {/* Last Name */}
      <input
        type="text"
        placeholder="Last Name"
        {...register("lastName", {
          required: "Last name is required"
        })}
        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.lastName && (
        <p className="text-red-500 text-sm">{errors.lastName.message}</p>
      )}

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 3,
            message: "Password must be 6 characters"
          }
        })}
        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
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

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
      >
        Register
      </button>

    </form>
  );
};

export default Register;
