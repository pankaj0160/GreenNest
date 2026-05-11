import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signupApi } from "@/services/api/authApi";
import { signupSchema } from "@/utils/authSchemas";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ROUTES from "@/constants/routes";
import cn from "@/utils/cn";

const ROLES = [
  { value: "customer", label: "Customer", icon: "🛍️", desc: "Buy plants & book services" },
  { value: "vendor", label: "Vendor", icon: "🏪", desc: "Sell plants & products" },
  { value: "gardener", label: "Gardener", icon: "🌿", desc: "Offer gardening services" },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "customer" },
  });

  const selectedRole = watch("role");

  const { mutate, isPending } = useMutation({
    mutationFn: signupApi,

    onSuccess: (_, variables) => {
      navigate(
        `${ROUTES.AUTH.VERIFY_EMAIL}?email=${encodeURIComponent(
          variables.email
        )}`
      );
    },

    onError: (err) => {
      setServerError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    },
  });

  const onSubmit = (data) => {
    setServerError("");
    mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>

        <p className="text-gray-500 text-sm mt-1">
          Already have an account?{" "}
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="text-brand-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="space-y-2">
        <p className="label">I want to...</p>

        <div className="grid grid-cols-3 gap-2">
          {ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setValue("role", role.value)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all",
                selectedRole === role.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              <span className="text-xl">{role.icon}</span>
              <span className="text-xs font-semibold text-gray-800">
                {role.label}
              </span>
              <span className="text-[10px] text-gray-400 leading-tight">
                {role.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Full Name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="John Doe"
            className={cn("input", errors.name && "input-error")}
          />
        </FormField>

        <FormField label="Email Address" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={cn("input", errors.email && "input-error")}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <input
            {...register("password")}
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            className={cn("input", errors.password && "input-error")}
          />
        </FormField>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <Button type="submit" isLoading={isPending}>
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default SignupPage;