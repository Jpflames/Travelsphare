import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/get-session";
import { cloudinary, isCloudinaryConfigured } from "@/lib/helpers/cloudinary";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { message: "Cloudinary is not configured. Add CLOUDINARY_* keys to enable signed uploads." },
      { status: 503 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "travelsphere/listings" },
    process.env.CLOUDINARY_API_SECRET ?? ""
  );

  return NextResponse.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: "travelsphere/listings",
  });
}
