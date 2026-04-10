"use server";

import { revalidatePath } from "next/cache";
import { createCourseApi } from "@/lib/api";

export type CreateCourseState = {
  error: string | null;
  ok?: boolean;
};

const initial: CreateCourseState = { error: null };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createCourseAction(
  _prev: CreateCourseState,
  formData: FormData,
): Promise<CreateCourseState> {
  const title = String(formData.get("title") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "0");
  const categoryRaw = String(formData.get("category") ?? "");

  if (!title || !description || !duration || !price) {
    return { error: "Please fill title, description, duration, and price." };
  }

  if (!slug) slug = slugify(title);
  const category = Number(categoryRaw);
  if (!Number.isFinite(category) || category < 1) {
    return { error: "Select a category." };
  }

  const rating = Math.min(5, Math.max(0, Number.parseFloat(ratingRaw) || 0));

  try {
    await createCourseApi({
      title,
      slug,
      description,
      duration,
      price,
      rating,
      category,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create course.";
    return { error: msg.slice(0, 500) };
  }

  revalidatePath("/courses");
  revalidatePath("/");
  return { error: null, ok: true };
}

export { initial as createCourseInitialState };
