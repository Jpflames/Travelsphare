import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoWishlistAdd, demoWishlistRemove } from "@/lib/demo/local-store";
import { getAuthSession } from "@/lib/auth/get-session";
import { User } from "@/models/User";

type Params = {
  params: Promise<{ listingId: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await params;

  if (isDemoMode()) {
    await demoWishlistAdd(session.user.id, listingId);
    return NextResponse.json({ ok: true });
  }

  await connectToDatabase();

  await User.findByIdAndUpdate(session.user.id, {
    $addToSet: { wishlist: new Types.ObjectId(listingId) },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await params;

  if (isDemoMode()) {
    await demoWishlistRemove(session.user.id, listingId);
    return NextResponse.json({ ok: true });
  }

  await connectToDatabase();

  await User.findByIdAndUpdate(session.user.id, {
    $pull: { wishlist: new Types.ObjectId(listingId) },
  });

  return NextResponse.json({ ok: true });
}
