
const curTime = document.querySelector("h1");
const selectMenu = document.querySelectorAll("select");
const setAlarmBtn = document.querySelector("button:nth-of-type(1)");
const stopAlarmBtn = document.querySelector("button:nth-of-type(2)");
const resetAlarmBtn = document.querySelector("button:last-of-type");
const content = document.querySelector(".content");
const alarmsDiv = document.querySelector(".alarms");
const alarmsList = alarmsDiv.querySelector("ul");
const alarmtext = document.querySelector(".alarm-text");

//Alarms array to store the alarms
let alarms = [];

let ringtone_index = null;

//Ringtone element for ringtone
const ringtone = new Audio("./Assets/iPhone Ringtone For Android Mobile Phone.mp3");

// Function to populate dropdown menus with options
function addOptions(start, end, selector) {
  for (let i = start; i <= end; i++) {
    const value = i < 10 ? `0${i}` : i;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selector.appendChild(option);
  }
}

// Populating hours, minutes and seconds dropdowns with options
addOptions(1, 12, selectMenu[0]); // Hours
addOptions(0, 59, selectMenu[1]); // Minutes
addOptions(0, 59, selectMenu[2]); // Seconds

// Populating AM/PM dropdown with options
selectMenu[3].innerHTML = ` <option value="AM">AM</option> <option value="PM">PM</option>`;

// Function to update the clock display and check alarms
function updateClock() {
  const date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let ampm = "AM";

  // Converting to 12-hour format
  if (h >= 12) {
    h -= 12;
    ampm = "PM";
  }

  h = h === 0 ? 12 : h;
  h = h < 10 ? `0${h}` : h;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;

  // Updating the clock text
  curTime.textContent = `${h}:${m}:${s} ${ampm}`;

  // Checking if any alarms should go off
  alarms.forEach((alarmTime, index) => {
    if (alarmTime === `${h}:${m}:${s} ${ampm}`) {
      ringtone.play();
      ringtone.loop = true;
      ringtone_index = index;
    }
  });

  // Displaying the reset button if there is more than one alarm
  resetAlarmBtn.style.display = alarms.length > 1 ? "block" : "none";

  // Displaying the alarm text if there is at least one alarm
  alarmtext.style.display = alarms.length > 0 ? "block" : "none";
}


// Function to stop the ringtone
function stopRingtone() {
  //Checking if the ringtone is currently playing
  if (ringtone.currentTime > 0) 
  {
    ringtone.pause(); // Pausing the ringtone
    ringtone.currentTime = 0; //Reseting the current time of the ringtone to the beginning
    ringtone.loop = false; //Disabling the looping of the ringtone
    ringtone_index = null; //Reseting the ringtone index
  }
}

// Function to reset all the alarms
function resetAlarms() {
  // Empting the alarms array
  alarms = [];

  // Clearing the alarms list
  alarmsList.innerHTML = "";
  stopRingtone();
}

// Function for setting a new alarm
function setAlarm() {
  let hour = selectMenu[0].value;
  let minute = selectMenu[1].value;
  let second = selectMenu[2].value;
  let ampm = selectMenu[3].value;

  // Validation check for alarm time
  if (
    hour === "Hour" ||
    minute === "Minute" ||
    second === "Second" ||
    ampm === "AM/PM"
  ) {
    // If alarm time isn't fully selected, showing alert
    alert("Please select a valid alarm time.");
    return;
  }

  // Creating the alarm time string
  const alarmTime = `${hour}:${minute}:${second} ${ampm}`;

  // Checking if the alarm is already set
  if (alarms.includes(alarmTime)) {
    alert("This alarm is already set.");
    return;
  }

  // Adding new alarm time to the alarms array
  alarms.push(alarmTime);

  // Creating a new list item for the alarm
  const li = document.createElement("li");
  li.textContent = alarmTime;

  // Creating a delete button for the alarm
  const deleteBtn = document.createElement("i");
  deleteBtn.classList.add("fas", "fa-trash-alt", "remove-icon");

  // Adingd event listener to delete button to remove the alarm
  deleteBtn.addEventListener("click", () => {
    const index = alarms.indexOf(alarmTime);
    if (index !== -1) {
      
      alarms.splice(index, 1);// Removing alarm from the array
      li.remove(); // Removing alarm from the list
    }
    if (index === ringtone_index) {
      stopRingtone();// If the deleted alarm was ringing, stop the ringtone
    }
  });

  
  li.appendChild(deleteBtn); //Adding the delete button to the list item

  alarmsList.appendChild(li);  //Adding the list item to the alarms list

  // Reseting the select menus to default values
  selectMenu[0].value = "Hour";
  selectMenu[1].value = "Minute";
  selectMenu[2].value = "Second";
  selectMenu[3].value = "AM";
}



// Adding event listener to the set alarm button to set an alarm when clicked
setAlarmBtn.addEventListener("click", setAlarm);

//Adding event listener to the stop alarm button to stop the ringtone
stopAlarmBtn.addEventListener("click", stopRingtone);

// Adding event listener to the reset alarm button to reset all alarms when clicked
resetAlarmBtn.addEventListener("click", resetAlarms);



// Updating the clock every second
setInterval(updateClock, 1000);
