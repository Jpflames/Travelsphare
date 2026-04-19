import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoWishlistGet } from "@/lib/demo/local-store";
import { getAuthSession } from "@/lib/auth/get-session";
import { User } from "@/models/User";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    const wishlist = await demoWishlistGet(session.user.id);
    return NextResponse.json({ data: wishlist });
  }

  await connectToDatabase();
  const user = await User.findById(session.user.id)
    .populate("wishlist", "title location images price rating propertyType")
    .lean();

  return NextResponse.json({ data: user?.wishlist ?? [] });
}
