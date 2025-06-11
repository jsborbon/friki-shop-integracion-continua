import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { users } from "@clerk/clerk-sdk-node";

export async function GET() {
  const authData = await auth();
  const userId = authData.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await users.getUser(userId);

    return NextResponse.json({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.emailAddresses[0]?.emailAddress || "",
      phone:
        user.phoneNumbers.length > 0 ? user.phoneNumbers[0].phoneNumber : "",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authData = await auth();
  const userId = authData.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, phone } = body;

    // Type-safe update object
    const updateData: Partial<{
      firstName: string;
      lastName: string;
      phoneNumbers: { add: { phoneNumber: string }[] };
    }> = {
      firstName,
      lastName,
    };

    if (phone) {
      updateData.phoneNumbers = { add: [{ phoneNumber: phone }] };
    }

    await users.updateUser(userId, updateData);

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
