import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node"; // Clerk SDK for fetching users

export async function GET() {
  try {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    const revenueData = await prisma.order.aggregate({
      _sum: { total: true },
    });

    const totalUsers = (await users.getUserList()).length;

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalOrders,
      revenue: revenueData._sum.total || 0,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
