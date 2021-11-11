
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
        }
        xhttp.open("GET", 'txts/book.txt', true);
        xhttp.send();

        var appointmentTime = getCookie('appointmentTime');
        $('#' + appointmentTime.split(':').join('\\:')).addClass('select');

        var appointmentDate = getCookie('appointmentDate');
        $('.datepicker').datepicker('setDate', appointmentDate);

        // delete cookies
        document.cookie = 'services=; Max-Age=0;';
        document.cookie = 'totalCost=; Max-Age=0;';
    });

});