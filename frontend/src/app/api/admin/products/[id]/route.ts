import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getIdFromUrl(req: NextRequest): number | null {
  const id = req.nextUrl.pathname.split("/").pop();
  return id && !isNaN(Number(id)) ? Number(id) : null;
}

export async function GET(req: NextRequest) {
  try {
    const productId = getIdFromUrl(req);
    if (!productId) {
      return NextResponse.json(
        { error: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const productId = getIdFromUrl(req);
    if (!productId) {
      return NextResponse.json(
        { error: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, price, image, category, description, metadata } = body;

    if (!title && !price && !image && !category && !description && !metadata) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        price,
        image,
        category: category ? category.toUpperCase() : undefined,
        description,
        metadata,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const productId = getIdFromUrl(req);
    if (!productId) {
      return NextResponse.json(
        { error: "Invalid Product ID" },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}