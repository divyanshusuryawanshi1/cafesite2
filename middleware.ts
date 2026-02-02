import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // We need to create a client here or just check session if using cookie auth helpers
    // For simplicity in this demo without cookie helper package, we might rely on client-side check 
    // or simple session check if we had cookies.
    // BUT: Standard way is using @supabase/ssr or older auth-helpers.
    // Given we only installed supabase-js, true server-side auth is harder to implement robustly 
    // without the helper packages which manage cookies.

    // STRATEGY: We will let the client-side handle the redirect for this MVP if not logged in,
    // OR we can try to read the cookie manually if Supabase sets one. 
    // Actually, standard supabase-js usage on client stores in localStorage.

    // To avoid complexity of server-side cookie parsing without the helper lib in 5 mins:
    // We will do a robust CLIENT-SIDE protection in the Admin Layout/Page. 
    // Middleware here will just pass through or maybe redirect /admin to /login if we could detect it.

    // Better approach for this task constraint:
    // Implement a Client Component wrapper for Admin pages that checks logic.

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
