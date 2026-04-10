import { NextResponse } from "next/server";

// Example data
const courses = [
  { id: 1, title: "Course 1", description: "Intro to Course 1" },
  { id: 2, title: "Course 2", description: "Intro to Course 2" },
];

export async function GET() {
  return NextResponse.json(courses);
}