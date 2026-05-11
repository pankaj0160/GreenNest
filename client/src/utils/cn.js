/**
 * cn.js
 * className utility combining clsx + tailwind-merge.
 *
 * Why both?
 * - clsx: handles conditional class logic (objects, arrays, falsy values)
 * - tailwind-merge: resolves Tailwind class conflicts (e.g., "px-2 px-4" → "px-4")
 *
 * Usage:
 *   cn("base-class", isActive && "active-class", "px-2", overridePx && "px-4")
 *   // Without tailwind-merge: "base-class active-class px-2 px-4" (conflict!)
 *   // With tailwind-merge:    "base-class active-class px-4" (resolved)
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export default cn;
