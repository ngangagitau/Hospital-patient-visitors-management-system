// Utility to export table data to PDF using jsPDF and autoTable
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportVisitorsToPDF(visitors) {
  const doc = new jsPDF();
  doc.text('Visitor History', 14, 16);
  autoTable(doc, {
    startY: 24,
    head: [[
      'Visitor', 'Patient', 'Visit Type', 'Check-in', 'Check-out', 'Status'
    ]],
    body: visitors.map(v => [
      v.name,
      v.patientName,
      v.visitType === 'lunch' ? 'Lunch' : 'Evening',
      new Date(v.checkInTime).toLocaleString(),
      v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : '-',
      v.status
    ]),
  });
  doc.save('visitor-history.pdf');
}
