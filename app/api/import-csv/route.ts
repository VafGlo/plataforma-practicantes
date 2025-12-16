import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const text = await file.text();
  const lines = text.split("\n").slice(1);

  const practicantes = lines
    .map((line) => line.split(","))
    .filter((row) => row.length >= 6)
    .map((row) => ({
      nombre: row[0],
      carrera: row[1],
      email: row[2],
      area: row[3],
      tecnologias: row[4].split(";").map((t) => t.trim()),
      estado: row[5] || "disponible",
    }));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("practicantes").insert(practicantes);

  return Response.json({ success: true });
}