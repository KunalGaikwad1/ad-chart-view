import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/admin";
import { connectToMongo } from "@/lib/mongo";
import User from "@/models/User";
import AdminModel from "@/models/Admin";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const idToken = authHeader.split(" ")[1];

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email || "";
    const name = decoded.name || "";

    await connectToMongo();

    // determine if admin
    const isAdmin = !!(await AdminModel.findOne({ email }).lean());

    // create sessionId
    const sessionId = uuidv4();

    // upsert user
    const user = await User.findOneAndUpdate(
      { uid },
      {
        uid,
        email,
        name,
        currentSessionId: sessionId,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // set httponly cookie for sessionId
    const res = NextResponse.json({ ok: true, isAdmin });
    // cookie valid for 30 days
    res.cookies.set({
      name: "sessionId",
      value: sessionId,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return res;
  } catch (err: any) {
    console.error("upsert error", err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}
