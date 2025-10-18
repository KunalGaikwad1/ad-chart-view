import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/admin";
import { connectToMongo } from "@/lib/mongo";
import User from "@/models/User";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const idToken = authHeader.split(" ")[1];

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    await connectToMongo();

    const sessionId = uuidv4();
    const user = await User.findOneAndUpdate(
      { uid },
      { currentSessionId: sessionId },
      { new: true }
    );
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "sessionId",
      value: sessionId,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err: any) {
    console.error("create session error", err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}
