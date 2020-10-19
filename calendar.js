var dayjs = require('dayjs');

module.exports = function preview(document, date) {
    document.fontSize(5);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let month = [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
    ]
    document.text(monthNames[date.month()],450,60);

    console.log(date.month());
    console.log(date.year());
    let d = new Date(date.year(),date.month(),1)
    let day = new dayjs(d);
    console.log(day.day());
    let dayNum = 0;
    let monthWeek = 0;
    for (let currentDate = day; currentDate.month() === day.month(); currentDate = currentDate.add(1, 'day')) {
        month[monthWeek][currentDate.day()] = dayNum+1;
        if(currentDate.day() === 6){
            monthWeek++;
        }
        dayNum++;
    }
    for(let week = 0; week <= month.length; week++){
        document.text(month[week]);
    }
    console.log(month);
}