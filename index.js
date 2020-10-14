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
//Prints date, just needs to be edited to print the right things.


function header(page, date){
    page.text(date.format('dddd, MMMM D'));
}
function preview(page){
    page.text("this is the preview",450);
}

//I need to add time increments to each line
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
//This is where the time zone is printed in the pdf.
function timeZone(page, date){
    page.text("add time zone support later", 50,720);
}

//This takes in a number that it prints to the pdf page.
function pageNumber(page, number){
    page.text(number ,480, 720);
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
    let days = endDate.diff(startDate, 'day');
    for(let next = 0; next <=  days; next++){
        doc.addPage(defaultOptions);
        makePdf(doc);
        header(doc, startDate);//good
        preview(doc);
        timeSlot(doc);
        timeZone(doc, startDate);//later
        pageNumber(doc, next+1);//good
        notes(doc);
        startDate = startDate.add(1, 'day');
    }

}


createPdf('2020-07-01','2020-07-03');
doc.pipe(fs.createWriteStream('output.pdf'));

doc.end();