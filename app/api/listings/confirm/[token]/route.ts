import { NextRequest, NextResponse } from "next/server";
import { confirmListingByToken } from "@/lib/listing-confirm";

/**
 * GET /api/listings/confirm/[token]
 * Magic link callback — aktivuje anon usera + publikuje jeho DRAFT inzeráty.
 * Volá se ze server-side stránky `/inzerce/potvrdit/[token]`.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  if (!token || token.length < 32) {
    return NextResponse.json({ success: false, error: "Neplatný odkaz" }, { status: 400 });
  }

  const result = await confirmListingByToken(token);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
