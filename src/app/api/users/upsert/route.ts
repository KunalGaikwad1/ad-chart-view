import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToMongo } from "@/lib/mongo";

export async function POST(req: Request) {
  try {
    await connectToMongo();
    const { email, name, phoneNumber, photoURL, sessionToken } =
      await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { email, name, phoneNumber, photoURL, sessionToken },
      { upsert: true, new: true }
    );

    // determine if admin based on DB record or email
    const isAdmin = user.role === "admin";

    return NextResponse.json({ success: true, user, isAdmin });
  } catch (err: any) {
    console.error("Upsert failed:", err.message);
    return NextResponse.json(
      { error: "Server upsert failed", details: err.message },
      { status: 500 }
    );
  }
}
