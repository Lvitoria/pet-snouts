import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// carrega este middleware sozinho no nextjs com servidor
// para proteger rotas de admin 
export function middleware(request: NextRequest) {
  console.log('Middleware running for:', request.url);
  const token = request.cookies.get('token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
