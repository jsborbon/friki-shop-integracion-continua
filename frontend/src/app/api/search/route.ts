import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "10000");
    const categoryParam = searchParams.get("category");

    // Ensure category is one of the Prisma enum values, or undefined
    const category =
      categoryParam &&
      Object.values(Category).includes(categoryParam.toUpperCase() as Category)
        ? (categoryParam.toUpperCase() as Category)
        : undefined;

    // Query the database with filters
    const results = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive", // Case-insensitive search
        },
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        category: category, // Uses only valid enum values
      },
      orderBy: {
        title: "asc", // Sort alphabetically
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
