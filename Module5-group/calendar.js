/* * * * * * * * * * * * * * * * * * * *\
 *               Module 4              *
 *      Calendar Helper Functions      *
 *                                     *
 *        by Shane Carr '15 (TA)       *
 *  Washington University in St. Louis *
 *    Department of Computer Science   *
 *               CSE 330S              *
 *                                     *
 *      Last Update: October 2017      *
\* * * * * * * * * * * * * * * * * * * */

/*  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
	"use strict";

	/* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
	Date.prototype.deltaDays = function (n) {
		// relies on the Date object to automatically wrap between months for us
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
	};

	/* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
	Date.prototype.getSunday = function () {
		return this.deltaDays(-1 * this.getDay());
	};
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
	"use strict";

	this.sunday = initial_d.getSunday();
		
	
	this.nextWeek = function () {
		return new Week(this.sunday.deltaDays(7));
	};
	
	this.prevWeek = function () {
		return new Week(this.sunday.deltaDays(-7));
	};
	
	this.contains = function (d) {
		return (this.sunday.valueOf() === d.getSunday().valueOf());
	};
	
	this.getDates = function () {
		var dates = [];
		for(var i=0; i<7; i++){
			dates.push(this.sunday.deltaDays(i));
		}
		return dates;
	};
}

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
	"use strict";
	
	this.year = year;
	this.month = month;
	
	this.nextMonth = function () {
		return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
	};
	
	this.prevMonth = function () {
		return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
	};
	
	this.getDateObject = function(d) {
		return new Date(this.year, this.month, d);
	};
	
	this.getWeeks = function () {
		var firstDay = this.getDateObject(1);
		var lastDay = this.nextMonth().getDateObject(0);
		
		var weeks = [];
		var currweek = new Week(firstDay);
		weeks.push(currweek);
		while(!currweek.contains(lastDay)){
			currweek = currweek.nextWeek();
			weeks.push(currweek);
		}
		
		return weeks;
	};
}

/************************ My Code ***************************/
async function updateCalendar(){
	var weeks = currentMonth.getWeeks();
	
	// TODO: login check and isShowTag check
	let isLoginResponse = await getUsername();

	let tagResponse = isLoginResponse.success? await getMonthCategory() : null;

    document.getElementById("month_year").textContent = (currentMonth.month + 1) + ", " + currentMonth.year;

	for(let w = 0; w < 6; ++w){
        let row = document.getElementById("week"+w);
        if(!weeks[w])
        {
            row.hidden = true;
            continue;
        }
        row.hidden = false;

		var days = weeks[w].getDates();

        for(var d in days){
            let grid = document.getElementById(w+"-"+d);
            
            // if the date does not belong to current month
            if((w == 0 && days[d].getDate() > 7) || (w == weeks.length - 1 && days[d].getDate() <= 7))
			{
				grid.childNodes[0].style.display = 'none';  // tag wrapper
				grid.childNodes[1].nodeValue = ""; // text: date number
				grid.setAttribute("class", "otherday");
			}
            else{
				let isLogin = isLoginResponse.success;
				let isShowTag = document.getElementById("isShowCategory_btn").checked;
				grid.childNodes[0].style.display = isLogin && isShowTag ? 'block' : 'none';
				let dayNum = days[d].getDate();
                grid.childNodes[1].nodeValue = dayNum;

				// if login: display tags by category bitMask
				if(isLogin)
				{
					if(!tagResponse.success)
					{
						console.log(tagResponse.message);
						return;
					}
					let dayTags = tagResponse.data;
					// 4 for work: red 
					// 2 for daily: blue 
					// 1 for other: green
					let tagWrapper = document.getElementById(grid.id + "-tag");
					tagWrapper.childNodes[0].style.display = ((dayTags[dayNum] & 4) != 0? "block" : "none");					       
					tagWrapper.childNodes[1].style.display = ((dayTags[dayNum] & 2) != 0? "block" : "none");					       
					tagWrapper.childNodes[2].style.display = ((dayTags[dayNum] & 1) != 0? "block" : "none");					       
				}

				// highlight today
                if(currentMonth.year == now.getFullYear() && currentMonth.month == now.getMonth() && now.getDate() == days[d].getDate())
					grid.setAttribute("class", "today");
				else
					grid.setAttribute("class", "otherday");
            }
		}
	}
}

function tdClick(event)
{
    let y = currentMonth.year;
    let m = currentMonth.month + 1;
    let d = event.currentTarget.textContent;
	
	let dateStr = y + "-" + m + "-" + d;
	console.log(dateStr);

	// the day is out of this month
	if(d == "")
		return;

	(async () => {
		let res = await getUsername();
		// only registered users can see events
		if(res.success)
		{
			displayEvents(res.success, dateStr);
		}
	})()
}

async function fetchEvents(dateStr)
{
	const data = { 'date': dateStr };

    return await fetch("getEvents.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .catch(err => console.error(err));
}

async function addEvent() {
	const event_title = document.getElementById("event_title");
	const event_date = document.getElementById("event_date");
	const event_time = document.getElementById("event_time");
	const event_categories = document.getElementById('categories');
	const index = event_categories.selectedIndex;
	const event_category = event_categories.options[index].value;

	const event_groups = document.getElementById('group_members');
	const group_index = event_groups.selectedIndex;
	const event_group = event_groups.options[group_index].id;
	console.log(event_group);
	const xmlHttp = new XMLHttpRequest();
	const res = await getUsername();
	if(!res.success)
	{
		alert("Failed: You are not login!");
		return;
	}
	const token = res.token;
	const user = res.username;

    xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState !== 4) return;
    if (xmlHttp.status === 200) {
		var data = JSON.parse(xmlHttp.responseText);
		alert(data);
    } else {
        alert("HTTP error", xmlHttp.status, xmlHttp.statusText);
    }
    };
	if (event_group === '1') {
		const addstr = 'AddEvent.php?';
		var param = 'token='+token+'&user='+user+'&title='+event_title.value+'&date='+event_date.value+'&time='+event_time.value+'&group=1'+'&category='+event_category;
		console.log(addstr);
		xmlHttp.open('POST', addstr);
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlHttp.send(param);
	}
	else{
		const addstr = 'AddGroupEvent.php';
		var param = 'token='+token+'&user='+user+'&title='+event_title.value+'&date='+event_date.value+'&time='+event_time.value+'&group='+event_group+'&category='+event_category;
		console.log(addstr);
		xmlHttp.open('POST', addstr);
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlHttp.send(param);
	}
	event_title.outerHTML = event_title.outerHTML;
	event_date.outerHTML = event_date.outerHTML;
	event_time.outerHTML = event_time.outerHTML;
	event_categories.selectedIndex = 0;
	event_groups.selectedIndex = 0;
	refreshUI();
	document.getElementById("addEventForm").style.display = "none";
}

async function deleteEvent(event_id) {
	const res = await getUsername();
	if(!res.success)
	{
		alert("Failed: You are not login!");
		return;
	}
	const token = res.token;
	const user = res.username;

	const xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = () => {
	if (xmlHttp.readyState !== 4) return;
	if (xmlHttp.status === 200) {
		var data = JSON.parse(xmlHttp.responseText);
		alert(data);
	} else {
		alert("HTTP error", xmlHttp.status, xmlHttp.statusText);
	}
	};
	const deletestr = 'DeleteEvent.php'
	var params = 'token='+token+'&event_id='+ event_id;
	
	console.log(deletestr);
	xmlHttp.open('POST', deletestr, true);
	xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttp.send(params);
	refreshUI();
}

async function shareEvents(event_id) {
	let oldTitle = document.getElementById("title_" + event_id).textContent;
	let oldDate = document.getElementById("date_" + event_id).textContent;
	let oldTime = document.getElementById("time_" + event_id).textContent;
	let oldCategory = document.getElementById("category_" + event_id).textContent;
	const usersToShare = document.getElementsByName("usersInShare");
	console.log(usersToShare);
	const res = await getUsername();
	if(!res.success)
	{
		alert("Failed: You are not login!");
		return;
	}
	const user = res.username;
	const token = res.token;
	for (let index = 0; index < usersToShare.length; index++) {
		if (usersToShare[index].checked && usersToShare[index].id !== user){
			shareEvent(usersToShare[index].id, oldTitle, oldDate, oldTime, oldCategory,token);
			refreshUI();
		}
		
	}
}

function shareEvent(user_id, title, Date, Time, category, token) {
	const xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = () => {
		if (xmlHttp.readyState !== 4) return;
		if (xmlHttp.status === 200) {
			var data = JSON.parse(xmlHttp.responseText);
			alert(data);
		} else {
			alert("HTTP error", xmlHttp.status, xmlHttp.statusText);
		}
		};
		const sharestr = 'ShareEvent.php';
		var params = 'token='+token+'&newUser='+user_id+'&newTitle='+title+'&newDate='+Date+'&newTime='+Time+'&group=1'+'&newCategory='+category;
		
		console.log(sharestr);
		xmlHttp.open('POST', sharestr, true);
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlHttp.send(params);
}

async function getAllUsers(userDivId, tableID, button_id, usersList) {
	let usersDiv = document.getElementById(userDivId);
	var table = document.getElementById(tableID);
	const res = await getUsername();
	const curUser = res.username;
	if(table)
	 usersDiv.removeChild(table);
	const xmlHttp = new XMLHttpRequest();
	const button = document.getElementById(button_id);
	const line = document.createElement("br");
	xmlHttp.onreadystatechange = () => {
	 if (xmlHttp.readyState !== 4) return;
	 if (xmlHttp.status === 200) {
	  var table = document.createElement("p");
	  table.id = tableID;
	  table.name = tableID;
	  var data = JSON.parse(xmlHttp.responseText);
	  for (let index = 0; index < data.length; index++) {
		if (data[index] === curUser && button_id === "share_confirm") continue;
	   var user = document.createElement("input");
	   user.id = data[index];
	   user.type = "checkbox";
	   user.name = usersList;
	   var label = document.createElement("label");
	   label.textContent = data[index];
	   table.appendChild(user);
	   table.appendChild(label);
	  }
	  usersDiv.insertBefore(table, button);
	 } else {
	  alert("HTTP error", xmlHttp.status, xmlHttp.statusText);
	 }
	 };
	xmlHttp.open('POST', "GetAllUsers.php", true);
	xmlHttp.send();
	
   }


   async function addGroup(usersList) {
	const group_name = document.getElementById("new_group");
	const group_list = document.getElementsByName(usersList);
	
	const checkedUsers = [];
	var userListStr = ""
	for (let index = 0; index < group_list.length; index++) {
		const user = group_list[index];
		if (user.checked) {
			if (index != group_list.length-1){
				userListStr += user.id;
				userListStr += ";";
			}
			else{
				userListStr += user.id;
			}
		}
	}

	const status = await getUsername();
	if(!status.success)
	{
		alert("Failed: You are not login!");
		return;
	}
	const user = status.username;
	const token = status.token;

	const xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = () => {
		if (xmlHttp.readyState !== 4) return;
		if (xmlHttp.status === 200) {
			var data = xmlHttp.responseText;
			alert(data);
		} else {
			alert("HTTP error", xmlHttp.status, xmlHttp.statusText);
		}
	};
	var addGroupStr = "AddGroup.php";
	var params = "token="+token+"&groupName=" + group_name.value + "&groupList="+userListStr;
	console.log(addGroupStr);
	xmlHttp.open('POST', addGroupStr, true);
	xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttp.send(params);
	group_name.outerHTML = group_name.outerHTML;
	group_list.outerHTML = group_list.outerHTML;
}

function getAllGroups(eventNumber, button_id) {
	let eventDiv = document.getElementsByName("events")[eventNumber];
	var groups = document.getElementsByName("group_members")[eventNumber];
	if (groups){
		eventDiv.removeChild(groups);
	}
	const xmlHttp = new XMLHttpRequest();
	const button = document.getElementById(button_id);
	xmlHttp.onreadystatechange = () => {
		if (xmlHttp.readyState !== 4) return;
		if (xmlHttp.status === 200) {
			var groups = document.createElement("select");
			groups.id = "group_members";
			groups.name = "group_members";
			var data = JSON.parse(xmlHttp.responseText);
			console.log(data);
			for (let index = 0; index < data.length; index++) {
				var group = document.createElement("option");
				group.id = data[index]["group_id"];
				group.textContent = data[index]["group_name"];
				groups.appendChild(group);
			}
			eventDiv.insertBefore(groups, button);
		} else {
			alert("HTTP error", xmlHttp.status, xmlHttp.statusText);
		}
		};
	xmlHttp.open('POST', "GetAllGroups.php", true);
	xmlHttp.send();
}

async function editEvent(event)
{
	let event_id = event.currentTarget.value;
	let newTitle = document.getElementById("edit_event_title").value;
	let newDate = document.getElementById("edit_event_date").value;
	let newTime = document.getElementById("edit_event_time").value;
	let newCategory = document.getElementById("edit_event_category").value;

	let status = await getUsername();
	if(!status.success)
	{
		alert("Failed: You are not login!");
		return;
	}
	const user = status.username;
	const token = status.token;
	console.log("this is:" + user);

	const data = { 	'event_id': event_id,
					'newTitle': newTitle,
					'newDate': newDate,
					'newTime': newTime,
					'newCategory': newCategory,
					'token': token
				};
	
    let res = await fetch("editEvent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .catch(err => console.error(err));

	if(res.success)
	{
		document.getElementById("editEventForm").style.display = "none";
		alert("The event has been successfully edited!");
		refreshUI();
	} else 
	{
		alert("Failed to edit the event!");
	}
}

async function getMonthCategory()
{
	let year = currentMonth.year;
	let month = currentMonth.month + 1;

	const data = { 'year': year, 'month': month };
	return await fetch("getMonthCategory.php", {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'content-type': 'application/json' }
	})
	.then(response => response.json())
	.catch(err => console.error(err));
}

function displayEditWindow(event)
{
	let btn_id = event.currentTarget.id;
	let event_id = btn_id.substr(5, btn_id.length - 5);

	//display old value of each field
	let oldTitle = document.getElementById("title_" + event_id).textContent;
	document.getElementById("edit_event_title").value = oldTitle;

	let oldDate = document.getElementById("date_" + event_id).textContent;
	document.getElementById("edit_event_date").value = oldDate;
	
	let oldTime = document.getElementById("time_" + event_id).textContent;
	document.getElementById("edit_event_time").value = oldTime;

	let oldCategory = document.getElementById("category_" + event_id).textContent;
	document.getElementById("edit_event_category").value = oldCategory;

	// give the event_id to the confirm button
	document.getElementById("edit_confirm").value = event_id;

	// display the edit popup
	document.getElementById("editEventForm").style.display = "block";
}

async function displayEvents(isLogin = false, dateStr = new Date().toISOString().split('T')[0])
{
	document.getElementById("hint").style.display = isLogin? "none" : "block";
	document.getElementById("no_event").style.display = isLogin? "block" : "none";
	document.getElementById("eventsDate").textContent = isLogin? "Events on " + dateStr : "Events";
	let eventDiv = document.getElementById("todayEvents");

	let table = document.getElementById("eventTable");
	if(table)
		eventDiv.removeChild(table);
	
	if(!isLogin)
	{
		return;
	}

	let todayEvents = null;
	let res = await fetchEvents(dateStr);
	if(res.success)
		todayEvents = res.data;
	
	
	document.getElementById("no_event").style.display = todayEvents.length == 0? "block" : "none";

	table = document.createElement("ul");
	table.setAttribute("id", "eventTable");
	for(let i in todayEvents)
	{
		// one li element for each event
		let listItem = document.createElement("li");
		table.appendChild(listItem);

		// title div
		let titleDiv = document.createElement("div");
		let bolded = document.createElement("b");
		bolded.textContent = todayEvents[i]["title"];
		titleDiv.setAttribute("id", "title_" + todayEvents[i]["event_id"]);
		titleDiv.appendChild(bolded);
		listItem.appendChild(titleDiv);

		// date div
		let dateDiv = document.createElement("div");
		dateDiv.textContent = todayEvents[i]["date"];
		dateDiv.setAttribute("id", "date_" + todayEvents[i]["event_id"]);
		listItem.appendChild(dateDiv);

		// time div
		let timeDiv = document.createElement("div");
		timeDiv.textContent = todayEvents[i]["time"];
		timeDiv.setAttribute("id", "time_" + todayEvents[i]["event_id"]);
		listItem.appendChild(timeDiv);

		// category div
		let categoryDiv = document.createElement("div");
		categoryDiv.textContent = todayEvents[i]["category"];
		categoryDiv.setAttribute("id", "category_" + todayEvents[i]["event_id"]);
		listItem.appendChild(categoryDiv);

		// group div
		let groupDiv = document.createElement("div");
		groupDiv.textContent = todayEvents[i]["group"];
		groupDiv.setAttribute("id", "group_" + todayEvents[i]["event_id"]);
		listItem.appendChild(groupDiv);

		// share button
		let share_btn = document.createElement("button");
		const sharePage = document.getElementById("ShareForm");
		share_btn.textContent = "Share";
		share_btn.setAttribute("class", "share");
		share_btn.setAttribute("id", "share_" + todayEvents[i]["event_id"]);
		// TODO: add event listener to edit button
		share_btn.addEventListener("click", function(){
			sharePage.style.display = "block";
			const button = document.getElementById("share_confirm");
			button.value = todayEvents[i]["event_id"];
			getAllUsers("shareGroupUsers", "ShareUsersList", "share_confirm", "usersInShare");
		})
		listItem.appendChild(share_btn);
		if (todayEvents[i]["group"] !== "personal") {
			share_btn.style.backgroundColor = "gray";
			share_btn.disabled = true;
		}

		// edit button
		let edit_btn = document.createElement("button");
		edit_btn.textContent = "Edit";
		edit_btn.setAttribute("class", "edit");
		edit_btn.setAttribute("id", "edit_" + todayEvents[i]["event_id"]);
		// TODO: add event listener to edit button
		edit_btn.addEventListener("click", function(event){
			displayEditWindow(event);
		})
		listItem.appendChild(edit_btn);
		if (todayEvents[i]["group"] !== "personal") {
			edit_btn.style.backgroundColor = "gray";
			edit_btn.disabled = true;
		}
		// delete button
		let delete_btn = document.createElement("button");
		delete_btn.textContent = "Delete";
		delete_btn.setAttribute("class", "delete");
		delete_btn.setAttribute("id", 'delete_' + todayEvents[i]['event_id']);
		// TODO: add event listener to delete button
		delete_btn.addEventListener("click", function() {
			deleteEvent(todayEvents[i]['event_id']);
		})
		listItem.appendChild(delete_btn);
		
	}
	eventDiv.appendChild(table);
}

async function refreshUI()
{
	let isLogin = await getUsername();
	console.log(isLogin.username);
	// update event display
	updateCalendar();
	displayEvents(isLogin.success);

	// update buttons
	if(isLogin.success)
	{
		document.getElementById("unregister_user_btns").style.display = "none";
		document.getElementById("register_user_btns").style.display = "inline-block";

	}else {
		document.getElementById("unregister_user_btns").style.display = "inline-block";
		document.getElementById("register_user_btns").style.display = "none";
	}
}

async function register()
{
	let newUser = document.getElementById("new_username").value;
	let newPassword = document.getElementById("new_psw").value;

	const data = { 'username': newUser, 'password': newPassword };

    let res = await fetch("registerAction.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .catch(err => console.error(err));

	if(res.success)
	{
		document.getElementById("new_username").value = "";
		document.getElementById("new_psw").value = "";
		document.getElementById("registerForm").style.display = "none";
		alert("Hi " + newUser + ", your account has been successfully created!");
	} else 
	{
		alert("Invaild username or password!");
	}
}

async function login()
{
	let username_input = document.getElementById("username").value;
	let password_input = document.getElementById("psw").value;

	// Make a URL-encoded string for passing POST data:
    const data = { 'username': username_input, 'password': password_input };

    let res = await fetch("loginAction.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .catch(err => console.error(err));

	if(res.success)
	{
		document.getElementById("username").value = "";
		document.getElementById("psw").value = "";
		document.getElementById("loginForm").style.display = "none";

		refreshUI();

		alert("Hello, " + username_input + "!");
	} else 
	{
		alert("Incorrect username or password!");
	}
}

async function getUsername()
{
	return await fetch("getUsername.php", {
		method: 'POST',
		headers: { 'content-type': 'application/json' }
	}).then(response => response.json()).catch(err => console.error(err));
}

async function logout()
{
	let res = await fetch("logoutAction.php", {
		method: 'GET',
		headers: { 'content-type': 'application/json' }
	}).then(response => response.json()).catch(err => console.error(err));
	
	alert(res.message);
	if(res.success)
	{
		refreshUI();
	}

}

const table = document.getElementById("calendar_table");
var now = new Date(); // today
var currentMonth = new Month(now.getFullYear(), now.getMonth()); // the Month that calendar is currenly showing

// initialize table grids for month display
for(let i = 0; i < 6; ++i)
{
    let row = document.createElement("tr");
    row.setAttribute("id", "week"+i);
    for(let j = 0; j < 7; ++j)
    {
        let grid = document.createElement("td");
        grid.setAttribute("id", i + "-"+j);
        grid.addEventListener('click',  function(event){
            tdClick(event);
        });

		// create tag display
		let tagWrapper = document.createElement('div');
		tagWrapper.setAttribute("class", "tag");
		tagWrapper.setAttribute("id", i + "-" + j + "-tag");
		
		let workTag = document.createElement('div');
		workTag.setAttribute("class", "work_tag");
		
		let dailyTag = document.createElement('div');
		dailyTag.setAttribute("class", "daily_tag");
		
		let otherTag = document.createElement('div');
		otherTag.setAttribute("class", "other_tag");

		tagWrapper.appendChild(workTag);
		tagWrapper.appendChild(dailyTag);
		tagWrapper.appendChild(otherTag);

		grid.appendChild(tagWrapper);
		grid.appendChild(document.createTextNode(""));

        row.appendChild(grid);
    }
    row.hidden = true;
    table.appendChild(row);
}

// adding event handlers
document.getElementById("next_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.nextMonth();
	updateCalendar();
}, false);

document.getElementById("prev_month_btn").addEventListener("click", function(event){
	currentMonth = currentMonth.prevMonth();
	updateCalendar(); 
}, false);

document.getElementById("register_btn").addEventListener("click", function(){
	document.getElementById("registerForm").style.display = "block";
})

document.getElementById("register_confirm").addEventListener("click", function(){
	register();
})

document.getElementById("register_cancel").addEventListener("click", function(){
	document.getElementById("new_username").value = "";
	document.getElementById("new_psw").value = "";
	document.getElementById("registerForm").style.display = "none";
})

document.getElementById("login_btn").addEventListener("click", function(){
	document.getElementById("loginForm").style.display = "block";
})

document.getElementById("logout_btn").addEventListener("click", function(){
	logout();
	// updateCalendar();
});

document.getElementById("login_confirm").addEventListener("click", function(){
	login();
	// updateCalendar();
})

document.getElementById("login_cancel").addEventListener("click", function(){
	document.getElementById("username").value = "";
	document.getElementById("psw").value = "";
	document.getElementById("loginForm").style.display = "none";
})

document.getElementById("add_event_btn").addEventListener("click", function(){
	document.getElementById("addEventForm").style.display = "block";
	getAllGroups(0, 'add_confirm');
})

document.getElementById("add_group_btn").addEventListener("click", function(){
	document.getElementById("addGroupForm").style.display = "block";
	getAllUsers("AddGroupUsers", "AddGroupUsersList", "addGroup_confirm", "usersInAddGroup");
})

document.getElementById("isShowCategory_btn").addEventListener("change", function(event){
	updateCalendar();
})

document.getElementById("addGroup_confirm").addEventListener("click", function() {
	addGroup("usersInAddGroup");
	document.getElementById("new_group").value = "";
	document.getElementById("addGroupForm").style.display = "none";
});
document.getElementById("addGroup_cancel").addEventListener("click", function(){
	document.getElementById("new_group").value = "";
	document.getElementById("addGroupForm").style.display = "none";
})

document.getElementById('add_confirm').addEventListener("click", addEvent, false);
document.getElementById("add_cancel").addEventListener("click", function(){
	const event_title = document.getElementById("event_title");
	const event_date = document.getElementById("event_date");
	const event_time = document.getElementById("event_time");
	const event_groups = document.getElementById('group_members');
	const event_categories = document.getElementById('categories');
	event_title.outerHTML = event_title.outerHTML;
	event_date.outerHTML = event_date.outerHTML;
	event_time.outerHTML = event_time.outerHTML;
	event_categories.selectedIndex = 0;
	event_groups.selectedIndex = 0;
	document.getElementById("addEventForm").style.display = "none";
})

document.getElementById("edit_confirm").addEventListener("click", function(event){
	console.log(event);
	editEvent(event);
})

document.getElementById("edit_cancel").addEventListener("click", function(){
	document.getElementById("editEventForm").style.display = "none";
})

document.getElementById("share_confirm").addEventListener("click", function(){
	const event_id = document.getElementById("share_confirm").value;
	console.log(event_id);
	shareEvents(event_id);
})

document.getElementById("share_cancel").addEventListener("click", function(){
	const sharePage = document.getElementById("ShareForm");
	sharePage.style.display="none";
})


refreshUI();