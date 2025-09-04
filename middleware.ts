import { clerkMiddleware } from "@clerk/nextjs/server";

// ✅ Do not pass publicRoutes here — just call the middleware directly
export default clerkMiddleware();

export const config = {
  matcher: [
    '/',                // Landing page
    '/sign-in(.*)',     // Auth page
    '/sign-up(.*)',     // Auth page
    '/dashboard(.*)',   // Protected page
    '/upload(.*)',      // Add more as needed
    '/((?!.+\\.[\\w]+$|_next).*)', // Optional: excludes static files
    '/(api|trpc)(.*)',             // API routes
  ],
};
