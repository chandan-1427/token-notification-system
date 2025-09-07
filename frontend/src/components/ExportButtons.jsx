import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const ExportButtons = ({ tokens }) => {
  const exportCSV = () => {
    const csv = Papa.unparse(tokens);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tokens.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Token Report", 14, 16);
    doc.autoTable({
      head: [["Token", "Name", "Contact", "Status"]],
      body: tokens.map(t => [t.tokenNumber, t.name, t.contact, t.status]),
    });
    doc.save("tokens_report.pdf");
  };

  return (
    <div className="flex justify-center gap-3">
      <button onClick={exportCSV} className="bg-gray-600 text-white px-3 py-2 rounded">Export CSV</button>
      <button onClick={exportPDF} className="bg-gray-800 text-white px-3 py-2 rounded">Export PDF</button>
    </div>
  );
};
