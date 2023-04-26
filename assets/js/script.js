const currentDayEl = $('#currentDay');
const timeBlockEl = $('#timeBlocks');
//var activityListLocal = [];

init();

//Determines whether each hour block in the schedule is past, present, or in the future
function colorCodeTimeblock() {
    for (var i = 0; i < timeBlockEl.children('a').length; i++) {
        let hourBlock = timeBlockEl.children('a').eq(i);
        let hourBlockAtt = $(hourBlock).data("momentjs");
        var timeCompare = moment().set('hour', hourBlockAtt);
        
        if (moment().isAfter(timeCompare) && moment().hour() < 23 && moment().hour() > 8) {
            hourBlock.addClass("past");
        } else if (moment().hour() == timeCompare.hour()) {
            hourBlock.addClass("present");
        } else {
            hourBlock.addClass("future");
        }
    }
}

//Displays inputted activities in their timeblocks
function renderActivity(e) {
    let input = $(e.target).siblings("input").val().trim();
    let activityEl = $(e.target).parents("div.collapse").prev().children('p');
    let hourId = $(e.target).parents("div.collapse").attr("id").split("-")[1];
    //exits function if no text input or if activity is already recorded
    if (input === "" || !(activityEl.text() === "")) {
     return;
    }

    activityEl.text(activityEl.text() + " " + input);
    //clear input field
    $(e.target).siblings("input").val("");

    //call local storage function
    let activityList = JSON.parse(localStorage.getItem("activityList"));
    if (activityList !== null) {
        storeToLocal(input, hourId, activityList);
        return;
    }
    activityList = [];
    storeToLocal(input, hourId, activityList);
}

//This code snippet is for a future feature implementation
/* function renderActivity(e) {
   let input = $(e.target).siblings("input").val();
   //exits function if no text input
   if (input === "") {
    return;
   }
   storeToLocal(input);
   let parentEl = $(e.target).parents("div.collapse");
   var activityList;
    //check if there is already an activity list
   if (($(parentEl).children().length) == 2) {
        activityList = $('<ul>').addClass("list-group list-group-flush row-cols-2");
        parentEl.append(activityList);
   }
   activityList = $(parentEl).children('ul');
   let activityBlock = $('<div>').addClass("container m-1 h-25 row justify-content-between align-items-center");
   activityList.prepend(activityBlock);
   activityBlock.append($('<li>').addClass("col-10 list-group-item").text(input)).append($('<button>').addClass("deleteBtn col-2 h-auto").text("X"));
   $(e.target).siblings("input").val("");
} */

function storeToLocal(string, i, array) {
    //store string input into the apropriate index in array
    i -= 9;
    array[i] = string;
    localStorage.setItem("activityList", JSON.stringify(array));
}

//Deletes activity element and value on local storage array 
function deleteActivity(e) {
    e.preventDefault();
    let activityList = (JSON.parse(localStorage.getItem("activityList")));
    if (activityList === null) {
        return;
    }
    let activityText = $(e.target).siblings('p').text();
    let hourID = $(e.target).parents('a').next("div").attr("id").split("-")[1];
    activityText = "";

    storeToLocal(activityText, hourID, activityList);
    renderSchedule();
}

//renders activity text values pulled from local storage
function renderSchedule() {
    let activityList = (JSON.parse(localStorage.getItem("activityList")));
    if (activityList === null) {
        return;
    }
    let activityEl = timeBlockEl.children('a');

    for (var i = 0; i < activityList.length; i++) {
        activityEl = timeBlockEl.children('a').eq(i);
        activityEl.children('p').text(activityList[i]);
    }
};

//update clock and schedule every second
setInterval(init, 1000);

$(".saveBtn").on("click", renderActivity);
$(".deleteBtn").on("click", deleteActivity);
//currentDayEl.on("click", renderSchedule);

function init() {
    currentDayEl.html(moment().format('LLLL'));
    colorCodeTimeblock(); 
    renderSchedule();
};