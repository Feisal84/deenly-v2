import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mosqueId: string }> }
) {
  const searchParams = request.nextUrl.searchParams;
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const limit = 5; // Anzahl der zu ladenden Vorträge
  const { mosqueId } = await params;

  try {
    const supabase = await createClient();

    // Weitere Khutbas laden
    const { data: lectures, error } = await supabase
      .from("lectures")
      .select("*")
      .eq("mosque_id", mosqueId)
      .eq("status", "Public")
      .order("created_at", { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: "Fehler beim Laden der Vorträge" },
        { status: 500 }
      );
    }

    return NextResponse.json({ lectures });
  } catch (error) {
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
