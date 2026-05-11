import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "@/services/api/authApi";
import { resetPasswordSchema } from "@/utils/authSchemas";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ROUTES from "@/constants/routes";
import cn from "@/utils/cn";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () =>
      navigate(ROUTES.AUTH.LOGIN, { state: { reset: true } }),
    onError: (err) =>
      setServerError(err.response?.data?.message || "Reset failed. Please try again."),
  });

  const onSubmit = (data) => {
    setServerError("");
    mutate({ email, otp: data.otp, password: data.password });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="text-gray-500 text-sm mt-1">
          Enter the OTP sent to{" "}
          <span className="font-medium text-gray-700">{email || "your email"}</span> and
          choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="OTP Code" error={errors.otp?.message}>
          <input
            {...register("otp")}
            placeholder="6-digit OTP"
            maxLength={6}
            className={cn("input tracking-widest text-center text-lg font-bold", errors.otp && "input-error")}
          />
        </FormField>

        <FormField label="New Password" error={errors.password?.message}>
          <input
            {...register("password")}
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            className={cn("input", errors.password && "input-error")}
          />
        </FormField>

        <FormField label="Confirm New Password" error={errors.confirmPassword?.message}>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Repeat your new password"
            className={cn("input", errors.confirmPassword && "input-error")}
          />
        </FormField>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <Button type="submit" isLoading={isPending}>
          Reset Password
        </Button>
      </form>

      <div className="text-center">
        <Link to={ROUTES.AUTH.LOGIN} className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;