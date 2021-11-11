function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function delete_cookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function askByPost(cell, date) {
    // making cells valid or invalid
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/checkTime', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let ans = false;
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            ans = this.responseText;
            if (ans === "false") {
                cell.classList.add("dark");
                cell.classList.remove("cell");
            }
            else {
                cell.classList.add("cell");
                cell.classList.remove("dark");
            }
        }
    }
    xhr.send(`salonName=${getCookie("salonName")}&t=${cell.innerText}&d=${date}`);

}



$(document).ready(function () {

    // saving details of time and date into cookies
    $('.book-time').on('click', function () {
        document.cookie = "appointmentDate=" + $(".datepicker").val() + ";";
        if (getCookie("appointmentDate") != "" && getCookie("appointmentTime") != "") {
            const xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                document.querySelector(".wrapper").innerHTML = this.responseText;
                var script = document.createElement('script');
                script.src = "js/service.js";
                $(".wrapper").append(script);
            }
            xhttp.open("GET", "/txts/service.txt", true);
            xhttp.send();
        }
        else {
            alert("Please fill all the required fields!")
        }

    });


    // adding event listener on date picker to get available time schedules
    $('.datepicker').on('change', function () {
        delete_cookie("appointmentTime");
        let cells = document.querySelectorAll(".time");
        let date = $(".datepicker").val();
        for (let cell of cells) {
            cell.classList.remove('select');
            askByPost(cell, date);
        }
    });

    // datepicker formation
    $('.datepicker').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true,
        startDate: '+1d',
        endDate: '+7d'
    });

    $(document).on('click', '.cell', function () {
        $('.cell').removeClass('select');
        $(this).addClass('select');
        document.cookie = "appointmentTime=" + this.innerText;
    });

});
