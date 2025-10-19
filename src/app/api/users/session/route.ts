import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToMongo } from "@/lib/mongo";

export async function POST(req: Request) {
  try {
    await connectToMongo();
    const { email, sessionToken } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ valid: false, reason: "User not found" });
    }

    // 🔹 Compare tokens
    if (user.sessionToken !== sessionToken) {
      return NextResponse.json({ valid: false, reason: "Session invalid" });
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ valid: false, reason: "Server error" });
  }
}
