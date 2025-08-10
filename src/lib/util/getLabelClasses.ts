import { match } from "ts-pattern";

export const getLabelClasses = (color: string) =>
  match(color)
    .with("red", () => ({
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-700 dark:text-red-400",
      icon: "text-red-500",
    }))
    .with("orange", () => ({
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-700 dark:text-orange-400",
      icon: "text-orange-500",
    }))
    .with("amber", () => ({
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-700 dark:text-amber-400",
      icon: "text-amber-500",
    }))
    .with("yellow", () => ({
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      text: "text-yellow-700 dark:text-yellow-400",
      icon: "text-yellow-500",
    }))
    .with("lime", () => ({
      bg: "bg-lime-50 dark:bg-lime-900/20",
      text: "text-lime-700 dark:text-lime-400",
      icon: "text-lime-500",
    }))
    .with("green", () => ({
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-700 dark:text-green-400",
      icon: "text-green-500",
    }))
    .with("emerald", () => ({
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-400",
      icon: "text-emerald-500",
    }))
    .with("teal", () => ({
      bg: "bg-teal-50 dark:bg-teal-900/20",
      text: "text-teal-700 dark:text-teal-400",
      icon: "text-teal-500",
    }))
    .with("cyan", () => ({
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      text: "text-cyan-700 dark:text-cyan-400",
      icon: "text-cyan-500",
    }))
    .with("sky", () => ({
      bg: "bg-sky-50 dark:bg-sky-900/20",
      text: "text-sky-700 dark:text-sky-400",
      icon: "text-sky-500",
    }))
    .with("blue", () => ({
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      icon: "text-blue-500",
    }))
    .with("indigo", () => ({
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      text: "text-indigo-700 dark:text-indigo-400",
      icon: "text-indigo-500",
    }))
    .with("violet", () => ({
      bg: "bg-violet-50 dark:bg-violet-900/20",
      text: "text-violet-700 dark:text-violet-400",
      icon: "text-violet-500",
    }))
    .with("purple", () => ({
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-700 dark:text-purple-400",
      icon: "text-purple-500",
    }))
    .with("fuchsia", () => ({
      bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
      text: "text-fuchsia-700 dark:text-fuchsia-400",
      icon: "text-fuchsia-500",
    }))
    .with("pink", () => ({
      bg: "bg-pink-50 dark:bg-pink-900/20",
      text: "text-pink-700 dark:text-pink-400",
      icon: "text-pink-500",
    }))
    .with("rose", () => ({
      bg: "bg-rose-50 dark:bg-rose-900/20",
      text: "text-rose-700 dark:text-rose-400",
      icon: "text-rose-500",
    }))
    .otherwise(() => ({
      bg: "bg-base-50 dark:bg-base-900/20",
      text: "text-base-700 dark:text-base-400",
      icon: "text-base-500",
    }));
