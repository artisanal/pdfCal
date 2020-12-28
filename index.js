const PDFDocument = require("pdfkit")
const preview = require("./calendar")
const fs = require("fs")
let dayjs = require("dayjs")
let weekOfYear = require("dayjs/plugin/weekOfYear")
dayjs.extend(weekOfYear)
let duration = require("dayjs/plugin/Duration");
dayjs.extend(duration)
let month = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"]


const rightAlignmentDifferentFontText = ({
                                             textBoxX,
                                             textBoxY,
                                             textBoxWidth,
                                             startText,
                                             middleText,
                                             endText,
                                             startTextFont,
                                             middleTextFont,
                                             endTextFont
                                         }) => {
// get the endText width
    doc.font(endTextFont)
    const endTextWidth = doc.widthOfString(endText)
// take the given width of the whole text
// add the textBoxX
// and subtract the endTextWidth
    const endTextX = textBoxWidth + textBoxX - endTextWidth

    const endTextY = textBoxY

    doc.text(endText, endTextX, endTextY)

    doc.font(middleTextFont)
    const middleTextWidth = doc.widthOfString(middleText)
    // take the X of the endText computed above
    // and compute the X of the replacementText
    // based on the middleText width
    const middleTextX = endTextX - middleTextWidth

    // the Y is the same as the whole textbox
    const middleTextY = textBoxY

    // set the font

    // draw the middleText
    doc.text(middleText, middleTextX, middleTextY)


    doc.font(startTextFont)
    const startTextWidth = doc.widthOfString(startText)

    // take the X of the middleText computed above
    // and compute the X of the startText
    // based on the startText width
    const startTextX = middleTextX - startTextWidth
    const startTextY = textBoxY
    doc.text(startText, startTextX, startTextY)
}

/**
 * This is for the new layout that handles a whole week on two pages.
 * if i adjust the layout in any way, I need to make changes to drawTimeslot. they
 * are connected by the sunday block.
 * @param page
 */
function drawLayout2(page) {
    page.lineWidth(1)
    page.lineCap("drawHeader")
    .moveTo(47, 150)
    .lineTo(548, 150)
    .stroke()
    page.lineWidth(8)
    page.lineCap("vert")
    .moveTo(196, 150)
    .lineTo(196, 700)
    .stroke()
    page.lineWidth(8)
    page.lineCap("vert2")
    .moveTo(392, 150)
    .lineTo(392, 700)
    .stroke()
    page.lineWidth(1)
}


function drawLayout(page) {
    page.lineCap("drawHeader")
    .moveTo(47, 150)
    .lineTo(548, 150)
    .stroke()
    page.lineCap("vert")
    .moveTo(297.5, 150)
    .lineTo(297.5, 700)
    .stroke()
    page.lineCap("drawHeader")
    .moveTo(47, 700)
    .lineTo(548, 700)
    .stroke()
}

//Prints date, just needs to be edited to print the right things.

//function drawHeader(doc, date, sideOfPage){
//    let monthName = month[date.month()];
//    let monthDay = date.date();
//    if(sideOfPage === "left") {
//        doc.text(`From ${monthName} ${monthDay}`);
//    }
//    else{
//        doc.text(`To ${monthName} ${monthDay}`, 450, 50);
//    }
//}

function drawHeader(doc, date, sideOfPage) {
    let monthName = month[date.month()]
    let monthDay = date.date()
    doc.fontSize(12)
    if (sideOfPage === "left") {
        doc.font("Helvetica")
        .fontSize(12)
        .text("from ", 45, 30, {continued: false, textBaseline: "alphabetic", align: "left"})
        .font("Helvetica-Bold")
        .fontSize(52)
        .text(`${monthName} ${monthDay}`, {textBaseline: "alphabetic"})
    } else {
        let heading = `${monthName} ${monthDay}`
        doc.font("Helvetica")
        .fontSize(12)
        .text("to ", 0, 30, {continued: false, textBaseline: "alphabetic", align: "right"})
        .font("Helvetica-Bold")
        .fontSize(52)
        .text(`${monthName} ${monthDay}`, {continued: true, textBaseline: "alphabetic", align: "right"})
    }
    doc.fontSize(12)
}

/**
 * Wish i could combine multiple numbers to a case so that there are less cases.This is where the
 * coordinates are assigned for the days of the week... Your wish has been granted!
 * @param date
 */
function dayPlaceHolders(doc, date) {
    const days = [
        {dow: "Sunday", x: 350, y: 465},
        {dow: "Monday", x: 0, y: 0 },
        {dow: "Tuesday", x: 155, y: 0 },
        {dow: "Wednesday", x: 350, y:0 },
        {dow: "Thursday", x: 0, y: 0 },
        {dow: "Friday", x: 155, y: 0},
        {dow: "Saturday", x: 350, y: 0 }
    ];

    let info = days[date.day()];
    let xOffset = 50;
    let yOffset = 100;
    doc.fontSize(64)
    .text(date.date(), xOffset + info.x, yOffset + info.y)
    .fontSize(28)
    .text(info.dow, xOffset + info.x, yOffset + 60 + info.y)




}


function drawPreview(page) {
    //page.text("this is the drawPreview",450);
}

//I need to add time increments to each line
//does not work well with createpdfkit1
function drawTimeSlot(page, sideOfPage) {
    let jump = (700 - 150) / 12
    if (sideOfPage === "left") {
        for (let i = 0; i < 12; i++) {
            //page.lineWidth(10);
            page.lineCap("timeslot")
            .moveTo(47, 150 + jump)
            .lineTo(548, 150 + jump)
            .stroke()
            jump += 45.83
        }
    } else {
        for (let i = 0; i < 12; i++) {
            if (i > 8) {
                page.lineCap("sunday")
                .moveTo(47, 150 + jump)
                .lineTo(392, 150 + jump)
                .stroke()
            } else {
                page.lineCap("timeslot")
                .moveTo(47, 150 + jump)
                .lineTo(548, 150 + jump)
                .stroke()
            }
            jump += 45.83
        }
    }
}

//This takes in a number that it prints to the pdf page.
function drawPageNumber(page, number, totalPages, sideOfPage) {
    doc.fontSize(12)
    if (sideOfPage === "left") {
        page.text(`page ${number} of ${totalPages + 1}`, 50, 720, {align: "left"})
    } else {
        page.text(`page ${number} of ${totalPages + 1}`, 15, 720)
    }
}

function drawNotes(page) {
    page.text("This is the drawNotes Section", 320, 170)
}

const defaultOptions = {
    margins: {top: 50, left: 50, right: 50, bottom: 50},
    font: "Helvetica"
}

const doc = new PDFDocument({autoFirstPage: false})

//Eventually pages will be a not needed parameter, start and end should be able to give the amount of pdfs that are needed
//will also need to make a function that edits the default options or at least overwrites them
function createPdf(start, end) {
    let startDate = dayjs(start)
    let endDate = dayjs(end)
    let pageNumber = 0
    for (let currentDate = startDate; endDate.diff(currentDate, 'day') >= 0; currentDate = currentDate.add(1, "day")) {
        doc.addPage(defaultOptions)
        doc.lineWidth(0)
        doc.fontSize(15)
        drawLayout(doc)
        drawHeader(doc, currentDate)//good
        drawPreview(doc)
        drawTimeSlot(doc)//todo: put time to each line
        pageNumber += 1
        drawPageNumber(doc, pageNumber, endDate.diff(startDate, "day") + 1)
        drawNotes(doc)
        preview(doc, currentDate)
    }

}


function createPdf2(start, end) {
    let startDate = dayjs(start).startOf("week")
    //we want start date to begin on a monday.
    startDate = startDate.add(1, "day")
    let endDate = dayjs(end).endOf("week")
    //let totalWeeks = (endDate.week() - startDate.week()) + 1
    let totalWeeks = Math.round(dayjs.duration(endDate.diff(startDate)).asWeeks())
    let totalPages = totalWeeks * 2;

    doc.addPage(defaultOptions)
    let title = '2021'
    let x = doc.x, y = doc.y, h = 700, w = 530;
    let options = {width:w, align:'center'};
    doc.rect(x, y, w, h).stroke()
    .font('Helvetica-Bold')
    .fontSize(128)
    .text(title, x, y + 0.5 * (h - doc.heightOfString(title, options)), options);

    let pageNumber = 2
    //totalPages;
    while (endDate.diff(startDate, "day") >= 0) {
        for (let weeks = totalWeeks; weeks > 0; weeks--) {
            doc.addPage(defaultOptions)
            doc.lineWidth(0)
            drawLayout2(doc)
            drawTimeSlot(doc, "left")
            drawHeader(doc, startDate, "left")//I need to implement this in a better way.
            //This is where i loop through and make the left side of the page.
            for (let weekDay = 0; weekDay < 3; weekDay++) {
                dayPlaceHolders(doc, startDate)
                startDate = startDate.add(1, "day")
            }
            drawPageNumber(doc, pageNumber, totalPages, "left")
            pageNumber += 1
            doc.addPage(defaultOptions)
            doc.lineWidth(0)
            drawLayout2(doc)
            drawTimeSlot(doc)
            //This is where the right side of the page is made.
            for (let weekDay = 3; weekDay < 6; weekDay++) {
                dayPlaceHolders(doc, startDate)
                startDate = startDate.add(1, "day")
            }
            //Added this extra day place holder to account for sunday. I wanna find a workaround for this.
            dayPlaceHolders(doc, startDate)
            drawHeader(doc, startDate)
            startDate = startDate.add(1, "day")
            drawPageNumber(doc, pageNumber, totalPages)
            pageNumber += 1
        }
    }
}


createPdf2("2021-01-01", "2021-12-31")
doc.pipe(fs.createWriteStream("output.pdf"))

doc.end()
