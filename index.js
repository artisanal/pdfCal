const PDFDocument = require('pdfkit');
const preview = require('./calendar');
const fs = require('fs');
var dayjs = require('dayjs')

//const doc = new PDFDocument({autoFirstPage: false, margin:72});


//doc.pipe(fs.createWriteStream('output.pdf'));

function drawLayout(page){
  //  page.lineWidth(1);
    page.lineCap('drawHeader')
        .moveTo(47, 150)
        .lineTo(548, 150)
        .stroke();
    page.lineCap('vert')
        .moveTo(297.5, 150)
        .lineTo(297.5, 700)
        .stroke();
    page.lineCap('drawHeader')
        .moveTo(47, 700)
        .lineTo(548, 700)
        .stroke();
}
//Prints date, just needs to be edited to print the right things.


function drawHeader(page, date){
    page.text(date.format('dddd, MMMM D'));
}
function drawPreview(page){
    //page.text("this is the drawPreview",450);
}

//I need to add time increments to each line
function drawTimeSlot(page){
    let jump = (700-150)/12;
    //page.lineWidth(10);
    for(let i=0; i<12; i++){
        //page.lineWidth(10);
        page.lineCap('timeslot')
            .moveTo(47, 150+jump)
            .lineTo(297.5, 150+jump)
            .stroke();
        jump+=45.83;
    }
}

//This takes in a number that it prints to the pdf page.
function drawPageNumber(page, number, totalPages){
    page.text(`page ${number} of ${totalPages}`,480, 720);
}

function drawNotes(page){
    page.text("This is the drawNotes Section",320, 170)
}

const defaultOptions = {
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
    font: 'helvetica'
};

const doc = new PDFDocument({ autoFirstPage: false });

//Eventually pages will be a not needed parameter, start and end should be able to give the amount of pdfs that are needed
//will also need to make a function that edits the default options or at least overwrites them
function createPdf( start, end ) {
    let startDate = dayjs(start);
    let endDate = dayjs(end);
    let pageNumber = 0;
    for (let currentDate = startDate; endDate.diff(currentDate, 'day') >= 0; currentDate = currentDate.add(1, 'day')) {
        doc.addPage(defaultOptions)
        doc.lineWidth(0);
        doc.fontSize(15);
        drawLayout(doc);
        drawHeader(doc, currentDate);//good
        drawPreview(doc);
        drawTimeSlot(doc);//todo: put time to each line
        pageNumber+=1;
        drawPageNumber(doc, pageNumber, endDate.diff(startDate, 'day')+1);
        drawNotes(doc);
        preview(doc, currentDate);
    }

}


createPdf('2020-08-01','2020-08-03');
doc.pipe(fs.createWriteStream('output.pdf'));

doc.end();