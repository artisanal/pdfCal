const PDFDocument = require('pdfkit');
const fs = require('fs');

//const doc = new PDFDocument({autoFirstPage: false, margin:72});


//doc.pipe(fs.createWriteStream('output.pdf'));

function makePdf(page){
    page.lineWidth(10);
    page.lineCap('header')
        .moveTo(47, 100)
        .lineTo(548, 100)
        .stroke();
    page.lineCap('vert')
        .moveTo(297.5, 100)
        .lineTo(297.5, 700)
        .stroke();
    page.lineCap('header')
        .moveTo(47, 700)
        .lineTo(548, 700)
        .stroke();
}

const defaultOptions = {
    margins: { top: 10, left: 50, right: 50, bottom: 10 }
};

const doc = new PDFDocument({ autoFirstPage: false });
doc.on('pageAdding', e => {
    e.options = defaultOptions;
});

doc.addPage(defaultOptions);
makePdf(doc);
doc.pipe(fs.createWriteStream('output.pdf'));
//makePdf(doc)
doc.end();