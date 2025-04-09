import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data?.user) {
        console.error("Error fetching user data:", userError?.message);
        return NextResponse.redirect(`${origin}/error`);
      }

      const user = data.user;
      const email = user.email!;
      const id = user.id;

      // Lấy username từ GitHub metadata (ưu tiên user_name > full_name > email)
      const metadata = user.user_metadata;
      let username = metadata?.username || metadata?.user_name || metadata?.full_name || "";

      // Nếu không có username, tạo tạm từ email
      if (!username && email) {
        username = email.split("@")[0];
      }

      // 👇 Lấy avatar_url từ GitHub
      const avatar_url = metadata?.avatar_url ?? "";
      // Kiểm tra nếu user đã có profile chưa
      const existingUser = await prisma.userProfile.findUnique({
        where: { email },
      });

      if (!existingUser) {
        try {
          await prisma.userProfile.create({
            data: {
              id,
              email,
              username,
              avatar_url,
            },
          });
        } catch (dbError: any) {
          console.error("Error inserting user data:", dbError.message);
          return NextResponse.redirect(`${origin}/error`);
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
