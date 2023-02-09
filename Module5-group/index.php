<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" content="width=device-width, initial-scale=1">
        <title>Calendar</title>
        <link rel="stylesheet" href="style.css" type="text/css">
    </head>
    <body>
        <h1>Calendar</h1>
        <h3 id="month_year"></h3>

        <button id="prev_month_btn"><-</button>
        <button id="next_month_btn">-></button>

        <div style="display: inline-block;" id="unregister_user_btns">
            <button id="register_btn">register</button>
            <button id="login_btn">login</button>
        </div>

        <div style="display: inline-block;" id="register_user_btns">
            <button id="logout_btn">logout</button>
            <button id="add_event_btn">Add Event</button>
            <button id="add_group_btn">Add Group</button>
            <label for="isShowCategory_btn">show category</label>
            <input type="checkbox" id="isShowCategory_btn" checked></input>
        </div>

        <table id="calendar_table" style="width:80%">
            <tr id="day_title">
                <th>Sunday</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
            </tr>
        </table>

        <!-- reference for this popup: https://www.w3schools.com/howto/howto_js_popup_form.asp -->
        <div class="form-popup" id="loginForm">
            <div class="form-container">
                <h1>Login</h1>

                <label for="username"><b>Username</b></label>
                <input id="username" type="text" placeholder="Enter username" name="username" required>

                <label for="psw"><b>Password</b></label>
                <input id="psw" type="password" placeholder="Enter Password" name="password" required>

                <button type="button" id="login_confirm"  class="btn">Login</button>
                <button type="button" id="login_cancel" class="btn cancel">Cancel</button>
            </div>
        </div>

        <div class="form-popup" id="registerForm">
            <div class="form-container">
                <h1>New User</h1>

                <label for="new_username"><b>Username</b></label>
                <input id="new_username" type="text" placeholder="Enter username" name="new_username" required>

                <label for="new_psw"><b>Password</b></label>
                <input id="new_psw" type="password" placeholder="Enter Password" name="new_psw" required>

                <button type="button" id="register_confirm"  class="btn">Register</button>
                <button type="button" id="register_cancel" class="btn cancel">Cancel</button>
            </div>
        </div>

        <div class="form-popup" id="addGroupForm">
            <div class="form-container" id="AddGroupUsers">
                <h1>New Group</h1>
                <label for="new_group"><b>Groupname</b></label>
                <input id="new_group" type="text" placeholder="Enter group name" name="new_group" required>
                <label for="usersList"><b>Current Users</b></label>
                <table id= "AddGroupUsersList" name="usersList"></table>
                <button type="button" id="addGroup_confirm"  class="btn">Add Group</button>
                <button type="button" id="addGroup_cancel" class="btn cancel">Cancel</button>
            </div>
        </div>
        <div class="form-popup" id="ShareForm">
            <div class="form-container" id="shareGroupUsers">
                <h1>Share Events</h1>
                <label for="usersList"><b>Current Users</b></label>
                <table id= "ShareUsersList" name="usersList"></table>
                <button type="button" id="share_confirm"  class="btn">Share</button>
                <button type="button" id="share_cancel" class="btn cancel">Cancel</button>
            </div>
        </div>

        <div class="form-popup" id="addEventForm">
            <div class="form-container" name='events'>
                <h1>New Event</h1>

                <label for="title"><b>Title</b></label>
                <input type="text" placeholder="Enter event title" name="event_title" id="event_title" required>

                <label for="event_date"><b>Date</b></label>
                <input type="date" name="event_date" id="event_date" required>

                <label for="event_time"><b>Time</b></label>
                <input type="time" name="event_time" id="event_time" required>

                <label for="categories"><b>Category</b></label>
                <select id="categories" name="categories">
                    <option value="work">Work</option>
                    <option value="daily">Daily</option>
                    <option value="other">Other</option>
                </select>

                <br>

                <!-- TODO: control the display by js: only show this when group_event checkbox is checked; -->
                <label for="group_members"><b>Group Members</b></label>
                <select id="group_members" name="group_members" multiple>
                    <!-- TODO: the optional users should be requested from database using AJAX-->
                    <option value="user1">user1</option>
                    <option value="user2">user2</option>
                    <option value="user3">user3</option>
                </select>

                <button type="button" id="add_confirm"  class="btn">Add</button>
                <button type="button" id="add_cancel" class="btn cancel">Cancel</button>
            </div>
        </div>

        <div class="form-popup" id="editEventForm">
            <div class="form-container" name='events'>
                <h1>Edit Event</h1>

                <label for="edit_event_title"><b>Title</b></label>
                <input type="text" placeholder="Enter event title" name="edit_event_title" id="edit_event_title" required>

                <label for="edit_event_date"><b>Date</b></label>
                <input type="date" name="edit_event_date" id="edit_event_date" required>

                <label for="edit_event_time"><b>Time</b></label>
                <input type="time" name="edit_event_time" id="edit_event_time" required>

                <label for="edit_event_category"><b>Category</b></label>
                <select id="edit_event_category" name="edit_event_category">
                    <option value="work">Work</option>
                    <option value="daily">Daily</option>
                    <option value="other">Other</option>
                </select>

                <button type="button" id="edit_confirm"  class="btn">Edit</button>
                <button type="button" id="edit_cancel" class="btn cancel">Cancel</button>
            </div>
        </div>

        <hr>

        <div id="todayEvents">
            <h2 id="eventsDate">Events</h2>
            <p id="hint" style="color: gray;">Only registered users can see events</p>
            <p id="no_event" style="color: gray;">Nice! You don't have event today!</p>
        </div>

        <script type="text/javascript" src="./calendar.js"></script>
    </body>
</html>