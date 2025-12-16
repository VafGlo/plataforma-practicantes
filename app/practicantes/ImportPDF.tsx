"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
  practicantes: any[];
};

export default function ExportPDF({ practicantes }: Props) {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Listado de Practicantes", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Nombre", "Carrera", "Área", "Estado", "Tecnologías"]],
      body: practicantes.map((p) => [
        p.nombre,
        p.carrera,
        p.area,
        p.estado === "disponible" ? "Disponible" : "No disponible",
        p.tecnologias.join(", "),
      ]),
    });

    doc.save("practicantes.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
    >
      Exportar PDF
    </button>
  );
}