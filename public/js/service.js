
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


    $('.submit').on('click', async function () {
        let checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
        if (checkboxes.length == 0) {
            alert("Please fill atleast one service!");
        }
        else {
            $('#last-form').submit();
        }
        let total = 0;
        let services = [];
        checkboxes.forEach(function (userItem) {
            let service = userItem.parentElement.children[1].children[0].innerText;
            services.push(service);
            total += parseInt(userItem.value);
        });

        document.cookie = "totalCost=" + total + ";";
        document.cookie = "services=" + services.join(",") + ";";
    });

    $('.form-check').on('click', function () {

        let checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
        let t = 0;
        checkboxes.forEach(function (userItem) {
            t += parseInt(userItem.value);
        });
        $(".total-price").html(t + " INR");

    });

    $('#service-backBtn').on('click', function () {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            document.querySelector('.wrapper').innerHTML = this.responseText;
            var script = document.createElement('script');
            script.src = 'js/book.js';
            $('.wrapper').append(script);

            var appointmentTime = getCookie('appointmentTime');
            $('#' + appointmentTime.split(':').join('\\:')).addClass('select');

            var appointmentDate = getCookie('appointmentDate');
            // destroy datepicker
            $('.datepicker').datepicker('destroy');
            // reinitialize
            $('.datepicker').datepicker({
                format: 'dd-mm-yyyy',
                autoclose: true,
                startDate: '+1d',
                endDate: '+7d'
            });
            // set current date
            $('.datepicker').datepicker('setDate', appointmentDate);

            let cells = document.querySelectorAll(".time");
            let date = $(".datepicker").val();
            for (let cell of cells) {
                askByPost(cell, date);
            }

        }
        xhttp.open("GET", 'txts/book.txt', true);
        xhttp.send();

        // delete cookies
        delete_cookie('services');
        delete_cookie('totalCost');
    });

});