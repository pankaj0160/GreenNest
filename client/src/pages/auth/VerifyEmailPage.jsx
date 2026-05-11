import { useState, useRef } from "react";
import {
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  verifyEmailApi,
  resendVerificationApi,
  deleteUnverifiedAccountApi,
} from "@/services/api/authApi";
import Button from "@/components/ui/Button";
import ROUTES from "@/constants/routes";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [serverError, setServerError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const inputs = useRef([]);

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;

    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);

    if (val && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const { mutate: verify, isPending } = useMutation({
    mutationFn: verifyEmailApi,

    onSuccess: () => {
      navigate(ROUTES.AUTH.LOGIN, {
        state: { verified: true },
      });
    },

    onError: (err) => {
      setServerError(
        err.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    },
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: resendVerificationApi,

    onSuccess: () => {
      setResendMsg("A new OTP has been sent to your email.");
      setServerError("");
    },

    onError: (err) => {
      setResendMsg(
        err.response?.data?.message ||
          "Failed to resend OTP."
      );
    },
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteUnverifiedAccountApi,

    onSuccess: () => {
      navigate(ROUTES.AUTH.SIGNUP);
    },

    onError: (err) => {
      setServerError(
        err.response?.data?.message ||
          "Failed to restart signup."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");

    const otpStr = otp.join("");

    if (otpStr.length !== 6) {
      setServerError("Please enter complete 6-digit OTP.");
      return;
    }

    verify({
      email,
      otp: otpStr,
    });
  };

  const handleWrongEmail = () => {
    deleteAccount({ email });
  };

  if (!email) {
    return (
      <div className="text-center space-y-3">
        <p className="text-gray-500">
          No email found. Please sign up first.
        </p>

        <Link
          to={ROUTES.AUTH.SIGNUP}
          className="text-brand-600 hover:underline"
        >
          Go to Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">📧</div>

        <h1 className="text-2xl font-bold text-gray-900">
          Verify your email
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          We sent a 6-digit OTP to{" "}
          <span className="font-medium text-gray-800">
            {email}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          className="flex gap-2 justify-center"
          onPaste={handlePaste}
        >
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, idx)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, idx)
              }
              className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl
                         border-gray-300 focus:border-brand-500 focus:outline-none
                         focus:ring-2 focus:ring-brand-500/20 transition-colors"
            />
          ))}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 text-center">
            {serverError}
          </div>
        )}

        {resendMsg && (
          <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-sm text-brand-700 text-center">
            {resendMsg}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isPending}
          disabled={otp.join("").length !== 6}
        >
          Verify Email
        </Button>
      </form>

      <div className="text-center text-sm text-gray-500 space-y-2">
        <div>
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => resend({ email })}
            disabled={isResending}
            className="text-brand-600 hover:underline font-medium disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <div>
          Entered wrong email?{" "}
          <button
            type="button"
            onClick={handleWrongEmail}
            disabled={isDeleting}
            className="text-red-600 hover:underline font-medium disabled:opacity-50"
          >
            {isDeleting ? "Restarting..." : "Start Over"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;