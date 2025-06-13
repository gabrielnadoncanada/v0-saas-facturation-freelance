import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function isPublicRoute(pathname: string) {
  return (
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/confirm') ||
    pathname.startsWith('/reset-password')
  );
}

async function getUserOrganizations(supabase: any, userId: string) {
  const { data } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)
    .limit(1);
  return data || [];
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Redirect non-auth users except on public routes
  if (!user && !isPublicRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated, check organization logic (dashboard/no-organization)
  if (user) {
    // Get orga only once for all org-related logic
    const organizations = await getUserOrganizations(supabase, user.id);
    const hasOrganization = organizations.length > 0;

    // If on /dashboard (but not /no-organization), and user has NO org → redirect to /no-organization
    if (
      pathname.startsWith('/dashboard') &&
      !pathname.startsWith('/no-organization') &&
      !hasOrganization
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/no-organization';
      return NextResponse.redirect(url);
    }

    // If on /no-organization and user HAS org → redirect to /dashboard (rattrapage UX)
    if (
      pathname.startsWith('/no-organization') &&
      hasOrganization
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
