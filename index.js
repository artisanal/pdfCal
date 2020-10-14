const PDFDocument = require('pdfkit');
const fs = require('fs');
var dayjs = require('dayjs')

//const doc = new PDFDocument({autoFirstPage: false, margin:72});


//doc.pipe(fs.createWriteStream('output.pdf'));

function makePdf(page){
    page.lineWidth(10);
    page.lineCap('header')
        .moveTo(47, 150)
        .lineTo(548, 150)
        .stroke();
    page.lineCap('vert')
        .moveTo(297.5, 150)
        .lineTo(297.5, 700)
        .stroke();
    page.lineCap('header')
        .moveTo(47, 700)
        .lineTo(548, 700)
        .stroke();
}
//This is the first function i need to work on, it will be where the new dates will be printed in the pdf.
function header(page, date){
    page.text(date);
}
function preview(page){
    page.text("this is the preview",450);
}
function timeSlot(page){
    let jump = (700-150)/12;
    page.lineWidth(10);
    for(let i=0; i<12; i++){
        page.lineWidth(10);
        page.lineCap('timeslot')
            .moveTo(47, 150+jump)
            .lineTo(297.5, 150+jump)
            .stroke();
        jump+=45.83;
    }
}
function timeZone(page){
    page.text("This is the time zone", 50,720);
}
function pageNumber(page){
    page.text("This is the page number",400, 720);
}
function notes(page){
    page.text("This is the notes Section",320, 170)
}

const defaultOptions = {
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
    font: 'helvetica'
};

const doc = new PDFDocument({ autoFirstPage: false });
doc.on('pageAdding', e => {
    e.options = defaultOptions;
});

//Eventually pages will be a not needed parameter, start and end should be able to give the amount of pdfs that are needed
//will also need to make a function that edits the default options or at least overwrites them
function createPdf( start, end){
    let startDate = dayjs(start);
    let endDate = dayjs(end);
    for(let date = startDate; date === endDate; date.add(1, 'day')){
        console.log('inside');
        doc.addPage(defaultOptions);
        makePdf(doc);
        header(doc, date);
        preview(doc);
        timeSlot(doc);
        timeZone(doc);
        pageNumber(doc);
        notes(doc);
    }
    console.log(start);
    console.log(end);
}

//const date = dayjs('2020-01-1');
//console.log(date);
createPdf('2020-07-01','2020-07-03');
doc.pipe(fs.createWriteStream('output.pdf'));

doc.end();