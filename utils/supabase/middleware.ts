import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Keine Authentifizierung oder Weiterleitung mehr erforderlich
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
};
