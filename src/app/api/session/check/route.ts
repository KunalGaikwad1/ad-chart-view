import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/admin";
import { connectToMongo } from "@/lib/mongo";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const idToken = authHeader.split(" ")[1];

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    await connectToMongo();

    const user = await User.findOne({ uid }).lean();
    if (!user) return NextResponse.json({ valid: false });

    const cookieSession = req.cookies.get("sessionId")?.value;
    const valid = cookieSession && user.currentSessionId === cookieSession;

    return NextResponse.json({ valid: !!valid });
  } catch (err: any) {
    console.error("session check error", err);
    return NextResponse.json(
      { valid: false, error: err.message || String(err) },
      { status: 200 }
    );
  }
}
