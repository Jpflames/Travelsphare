"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

const searchSchema = z.object({
  location: z.string().min(2, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  guests: z.number().int().min(1).max(12),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export function SearchBar() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: "",
      startDate: "",
      endDate: "",
      guests: 2,
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    const params = new URLSearchParams({
      location: values.location,
      minPrice: "0",
      maxPrice: "2000",
      sort: "createdAt",
    });
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-3xl bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur md:grid-cols-4"
    >
      <label className="flex flex-col text-sm font-medium text-slate-700">
        Location
        <input
          {...register("location")}
          placeholder="Where to?"
          className="mt-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
        />
        <span className="mt-1 text-xs text-red-500">{errors.location?.message}</span>
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-700">
        Check In
        <input
          type="date"
          {...register("startDate")}
          className="mt-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
        />
        <span className="mt-1 text-xs text-red-500">
          {errors.startDate?.message}
        </span>
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-700">
        Check Out
        <input
          type="date"
          {...register("endDate")}
          className="mt-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
        />
        <span className="mt-1 text-xs text-red-500">{errors.endDate?.message}</span>
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-700">
        Guests
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            min={1}
            max={12}
            {...register("guests", { valueAsNumber: true })}
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none ring-sky-300 focus:ring"
          />
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Search
          </button>
        </div>
        <span className="mt-1 text-xs text-red-500">{errors.guests?.message}</span>
      </label>
    </form>
  );
}
