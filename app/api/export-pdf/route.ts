import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("practicantes")
    .select("*");

  const html = `
    <html>
      <body>
        ${data!.map(p => `
          <h2>${p.nombre}</h2>
          <p>${p.carrera}</p>
          <p>${p.area}</p>
          <p>${p.tecnologias.join(", ")}</p>
          <hr />
        `).join("")}
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
