import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginApi } from "@/services/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { loginSchema } from "@/utils/authSchemas";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ROUTES from "@/constants/routes";
import cn from "@/utils/cn";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.data.user,
          token: data.data.token,
        })
      );

      const from = state?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    },

    onError: (err, variables) => {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";

      // Redirect unverified users back to verification flow
      if (message.toLowerCase().includes("verify your email")) {
        navigate(
          `${ROUTES.AUTH.VERIFY_EMAIL}?email=${encodeURIComponent(
            variables.email
          )}`
        );
        return;
      }

      setServerError(message);
    },
  });

  const onSubmit = (data) => {
    setServerError("");
    mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>

        <p className="text-gray-500 text-sm mt-1">
          Don't have an account?{" "}
          <Link
            to={ROUTES.AUTH.SIGNUP}
            className="text-brand-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Success message after verification */}
      {state?.verified && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-sm text-brand-700">
          ✅ Email verified successfully! You can now log in.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email Address" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={cn("input", errors.email && "input-error")}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <div className="space-y-1">
            <input
              {...register("password")}
              type="password"
              placeholder="Your password"
              className={cn("input", errors.password && "input-error")}
            />

            <div className="text-right">
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-xs text-brand-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </FormField>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <Button type="submit" isLoading={isPending}>
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;