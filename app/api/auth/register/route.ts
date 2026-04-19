import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoFindUserByEmail, demoRegisterUser } from "@/lib/demo/local-store";
import { sanitizeText, registerUserSchema } from "@/lib/helpers/validation";
import { User } from "@/models/User";

export async function POST(request: Request) {
  const body = await request.json();
  const parsedBody = registerUserSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const email = parsedBody.data.email.toLowerCase();

  if (isDemoMode()) {
    const existingUser = await demoFindUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "A user with that email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(parsedBody.data.password, 12);
    await demoRegisterUser({
      name: sanitizeText(parsedBody.data.name),
      email,
      passwordHash: hashedPassword,
    });

    return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return NextResponse.json(
      { message: "A user with that email already exists." },
      { status: 409 }
    );
  }

  const hashedPassword = await hash(parsedBody.data.password, 12);

  await User.create({
    name: sanitizeText(parsedBody.data.name),
    email,
    password: hashedPassword,
    role: "user",
  });

  return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
}
