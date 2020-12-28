var dayjs = require('dayjs');


function digits_count(n) {
    let count = 0;
    if (n >= 1) ++count;

    while (n / 10 >= 1) {
        n /= 10;
        ++count;
    }

    return count;
}

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
    /**
     * Here all i had was document.text(month[week]) inside a for loop but rn I am trying to properly space the numbers
     * based on the amount of digits.
     */
    for(let week =0; week <7; week ++){
        document.text(month[week]);
    }
    /**
    for(let week = 0; week <= month.length; week++){
        for(let i = 0; i < 7;i++){
            if(digits_count(month[week][i]) > 1){
                document.text(month[week][i] + " ")
            }
            else{
                document.text(month[week][i] + "  ")
            }
        }
    }
**/
    /**
    monthWeek = 0;
    for (let i = 0; i < 42; i++){
        if ((i % 7 === 0) && (i !== 0)) {
            monthWeek++;
            console.log(month[monthWeek][i] + '\n');
        }
        else {
            if(month[monthWeek][i].toString().length > 1){
                console.log(month[monthWeek][i] + " ");
            }
            console.log(month[monthWeek][i] + "  ");
        }
    }
     **/
    console.log(month);
}