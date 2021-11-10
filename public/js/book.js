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


    console.log(getCookie("salon-name"));

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



    $('.datepicker').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true,
        startDate: '+1d',
        endDate: '+7d'
    });

    $('.cell').click(function () {
        $('.cell').removeClass('select');
        $(this).addClass('select');
    });


    $(".cell").on('click', function () {
        document.cookie = "appointmentTime=" + this.innerText;
        console.log(document.cookie);
    });

});
