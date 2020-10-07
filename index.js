const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument;

doc.pipe(fs.createWriteStream('output.pdf'));

doc.text("hello world")
    .fontSize(25)

doc.end();