const PDFDocument = require('pdfkit');

const generarTicketPDF = (datos, res) => {
    const doc = new PDFDocument({ 
        size: [226, 450], 
        margins: { top: 10, left: 10, right: 10, bottom: 10 } 
    });

    doc.pipe(res);

    // --- ENCABEZADO ---
    doc.fontSize(10).text('KIRKMARK - TICKET', { align: 'center' }).moveDown(0.5);
    doc.fontSize(8).text(`Venta Nro: ${datos.idventa}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    
    // Datos del Cliente
    doc.text(`Cliente: ${datos.cliente.nombre} ${datos.cliente.apellido || ''}`);
    doc.text(`CI/NIT: ${datos.cliente.ci_nit}`);
    doc.text(`Empleado: ${datos.empleadoNombre}`);
    // --- NUEVA LÍNEA: MÉTODO DE PAGO ---
    doc.text(`Método de Pago: ${datos.metodoNombre}`); 
    doc.text('-'.repeat(45));

    // --- DETALLE DE PRODUCTOS ---
    doc.text('CANT  DETALLE          SUBTOT');
    doc.text('-'.repeat(45));

    datos.productos.forEach(p => {
        const nombreProd = (p.nombre || 'Producto').substring(0, 15).padEnd(16);
        const cant = (p.cantidad || 0).toString().padEnd(5);
        const sub = parseFloat(p.subtotal || 0).toFixed(2);
        doc.text(`${cant} ${nombreProd} ${sub}`);
    });

    // --- TOTALES ---
    doc.text('-'.repeat(45));
    doc.fontSize(9).text(`SUBTOTAL: Bs. ${parseFloat(datos.subtotal).toFixed(2)}`, { align: 'right' });
    doc.fontSize(10).text(`TOTAL: Bs. ${parseFloat(datos.total).toFixed(2)}`, { align: 'right', style: 'bold' });

    doc.moveDown(1);
    doc.fontSize(8).text('¡Gracias por su compra!', { align: 'center' });
    
    doc.end();
};

module.exports = { generarTicketPDF };