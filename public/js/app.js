// cookie maker


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
    $('.appointment').on('click', function () {
        var salonName = $(this).attr("id");
        document.cookie = "salonName=" + salonName + ";";

        console.log(getCookie("salonName"));
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            document.querySelector(".wrapper").innerHTML = this.responseText;
            var script = document.createElement('script');
            script.src = "js/book.js";
            $(".wrapper").append(script);
        }
        xhttp.open("GET", "/txts/book.txt", true);
        xhttp.send();

    });
});



