import { withAuth } from "next-auth/middleware";
import { getNextAuthSecret } from "@/lib/auth/constants";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

export default withAuth(
  function proxy() {
    return;
  },
  {
    secret: getNextAuthSecret(),
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) {
          return false;
        }

        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token.role === "admin";
        }

        return true;
      },
    },
  }
);
