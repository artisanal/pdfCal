const PDFDocument = require('pdfkit');
const preview = require('./calendar');
const fs = require('fs');
var dayjs = require('dayjs')
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)
let month= ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];


/**
 * This is for the new layout that handles a whole week on two pages.
 * @param page
 */
function drawLayout2(page){
    page.lineCap('drawHeader')
        .moveTo(47, 150)
        .lineTo(548, 150)
        .stroke();
    page.lineCap('vert')
        .moveTo(196, 150)
        .lineTo(196, 700)
        .stroke();
    page.lineCap('vert2')
        .moveTo(392, 150)
        .lineTo(392, 700)
        .stroke();
}


function drawLayout(page){
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


function drawHeader(doc, date, sideOfPage){
    let monthName = month[date.month()];
    let monthDay = date.date();
    if(sideOfPage === "left") {
        doc.text(`From ${monthName} ${monthDay}`);
    }
    else{
        doc.text(`To ${monthName} ${monthDay}`);
    }
}
function drawPreview(page){
    //page.text("this is the drawPreview",450);
}

//I need to add time increments to each line
//does not work well with createpdfkit1
function drawTimeSlot(page){
    let jump = (700-150)/12;
    //page.lineWidth(10);
    for(let i=0; i<12; i++){
        //page.lineWidth(10);
        page.lineCap('timeslot')
            .moveTo(47, 150+jump)
            .lineTo(548, 150+jump)
            .stroke();
        jump+=45.83;
    }
}

//This takes in a number that it prints to the pdf page.
function drawPageNumber(page, number, totalPages, sideOfPage){
    if (sideOfPage === "left"){
        page.text(`page ${number} of ${totalPages}`, 50, 720);
    }
    else {
        page.text(`page ${number} of ${totalPages}`, 480, 720);
    }
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


function createPdf2(start, end){
    let startDate = dayjs(start).startOf('week');
    //we want start date to begin on a monday.
    startDate = startDate.add(1, 'day');
    let endDate = dayjs(end).endOf('week');
    let pageNumber = 1;
    let totalWeeks = (endDate.week() - startDate.week()) + 1
    while(endDate.diff(startDate, 'day') >= 0) {
        for (let weeks = totalWeeks; weeks > 0; weeks--) {
            doc.addPage(defaultOptions);
            doc.lineWidth(0);
            drawLayout2(doc);
            drawTimeSlot(doc);
            drawHeader(doc, startDate,"left");//I need to implement this in a better way.
            //This is where i loop through and make the left side of the page.
            for (let weekDay = 0; weekDay < 3; weekDay++) {
                startDate = startDate.add(1, 'day')
            }
            drawPageNumber(doc, pageNumber, totalWeeks * 2, "left");
            pageNumber += 1;
            doc.addPage(defaultOptions);
            doc.lineWidth(0);
            drawLayout2(doc);
            drawTimeSlot(doc);
            //This is where the right side of the page is made.
            for (let weekDay = 3; weekDay < 6; weekDay++) {
                startDate = startDate.add(1, 'day')
            }
            drawHeader(doc, startDate);
            startDate = startDate.add(1, 'day')
            drawPageNumber(doc, pageNumber, totalWeeks * 2);
            pageNumber += 1;
        }
    }
}



createPdf2('2020-08-01','2020-08-20');
doc.pipe(fs.createWriteStream('output.pdf'));

doc.end();