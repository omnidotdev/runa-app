import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect('/?error=missing_code_or_state');
  }

  // Extract PKCE verifier and stored state from cookies or URL-safe session (customize if needed)
  const cookieStore = cookies();
  const storedState = (await cookieStore).get('auth_state')?.value;
  const codeVerifier = (await cookieStore).get('pkce_verifier')?.value;

  if (!storedState || !codeVerifier) {
    return NextResponse.redirect('/?error=missing_pkce_state');
  }

  if (state !== storedState) {
    return NextResponse.redirect('/?error=invalid_state');
  }

  // Exchange code for tokens
  const tokenResponse = await fetch('https://localhost:8000/api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: 'runa-app',
      redirect_uri: 'http://localhost:3000/api/auth/callback',
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect('/?error=token_exchange_failed');
  }

  const tokenData = await tokenResponse.json();

  // Optionally: store tokens in cookies (secure + httpOnly recommended for production)
  (await cookieStore).set('access_token', tokenData.access_token);
  (await cookieStore).set('refresh_token', tokenData.refresh_token);
  (await cookieStore).set('id_token', tokenData.id_token);

  (await cookieStore).delete('auth_state');
  (await cookieStore).delete('pkce_verifier');

  return NextResponse.redirect('/');
}

// https://identity.omni.dev/sign-in?response_type=code&client_id=UioqQUVfdTjjpKVwkyACcOQocyJOwSBf&redirect_uri=https%3A%2F%2Fbackfeed.omni.dev%2Fapi%2Fauth%2Fcallback%2Fomni&scope=openid+profile+email+offline_access&prompt=consent&state=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiQ1ktQkt5UUNpRkg0eTY2RnFyaTlEMHI5a1VKQVNpNm9xdUJtek5wTDdxMEtlcWF1elMybmpnQ2g1OGtVUV9VckNVUnREQjFaaTZHOVUtX0tnNm5vZWcifQ..u1nfNgvJgyKNtQgpqodpoA.ZjkzOFvYRPsyaSpu6-N5zpWuU5KCcOLsjak-adA0-sH6c00oXswHBbC_xo1pc9pv5E5mEiefXkc85-mAQvFW8An4GRhgXyxZbQuZWALFx8CjsSaOTax6s8y0je6EKH9PsZwYqAn9ImluUrWVh5_b5UngGjnagIrmxlHVooTbILeOfpqJJVzuuF74MPT09EAj.ih3O0krHCXglu2r5AZBtsC8NvzVKdJGM754siSZgOBE&code_challenge=ecrCqmOF7TvErPBMS6Rt5u3VeJkKwc6GlYpXLeUAb6c&code_challenge_method=S256
// https://localhost:8000/api/auth/authorize?response_type=code&client_id=runa-app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&scope=openid+profile+email+offline_access&prompt=consent&state=a07a2275-d640-4d46-80ad-725cc0345642&code_challenge=P-V5QhpiL6QLVKgqEpg13oibMFVt9g6HJRAYZ_dc-P0&code_challenge_method=S256