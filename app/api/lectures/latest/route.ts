import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Neueste Vorträge laden
    const { data: lectures, error } = await supabase
      .from("lectures")
      .select(`
        *,
        mosque:mosque_id (
          name,
          handle
        )
      `)
      .eq("status", "Public")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Server API error:", error);
      return NextResponse.json(
        { error: `Fehler beim Laden der Vorträge: ${error.message}` }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ lectures });
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
