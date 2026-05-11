/**
 * useToast.js
 * Hook for dispatching toast notifications from any component.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success("Product added to cart!");
 *   toast.error("Something went wrong.");
 */

import { useDispatch } from "react-redux";
import { addToast } from "@/store/slices/uiSlice";

const useToast = () => {
  const dispatch = useDispatch();

  return {
    success: (message, duration) =>
      dispatch(addToast({ type: "success", message, duration })),
    error: (message, duration) =>
      dispatch(addToast({ type: "error", message, duration })),
    info: (message, duration) =>
      dispatch(addToast({ type: "info", message, duration })),
    warning: (message, duration) =>
      dispatch(addToast({ type: "warning", message, duration })),
  };
};

export default useToast;
