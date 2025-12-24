import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET() {
  const cookieStore = await cookies();
  
  // Deleta os cookies
  cookieStore.delete('token');
  cookieStore.delete('userName');
  
  // Redireciona para login
  redirect('/login');
}


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdGVAZ21haWwuY29tIiwibmFtZSI6InRlc3RlIiwiaWF0IjoxNzY2NTQ0NDgyLCJleHAiOjE3NjY1NDgwODJ9.c4jUpkbiUVIaRJ_PsFjdcKkffVLvmw0N7Gm0j3zaaAE
