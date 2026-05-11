import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "@/services/api/authApi";
import { forgotPasswordSchema } from "@/utils/authSchemas";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ROUTES from "@/constants/routes";
import cn from "@/utils/cn";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setSubmitted(true);
    },
  });

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">📬</div>
        <h2 className="text-2xl font-bold text-gray-900">Check your inbox</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          If <span className="font-medium text-gray-700">{submittedEmail}</span> is
          registered, you'll receive a reset OTP shortly.
        </p>
        <button
          onClick={() =>
            navigate(ROUTES.AUTH.RESET_PASSWORD.replace(":token", "otp"), {
              state: { email: submittedEmail },
            })
          }
          className="btn-primary w-full justify-center py-2.5"
        >
          Enter OTP →
        </button>
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="block text-sm text-gray-500 hover:text-gray-700"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
        <p className="text-gray-500 text-sm mt-1">
          Enter your email and we'll send you a reset OTP.
        </p>
      </div>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField label="Email Address" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={cn("input", errors.email && "input-error")}
          />
        </FormField>

        <Button type="submit" isLoading={isPending}>
          Send Reset OTP
        </Button>
      </form>

      <div className="text-center">
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;