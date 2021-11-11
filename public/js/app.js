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

function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute('href', sheet);
}

$(document).ready(function () {
    $('.appointment').on('click', function () {
        var salonName = $(this).attr("id");
        document.cookie = "salonName=" + salonName + ";";

        console.log(getCookie("salonName"));
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            document.querySelector(".wrapper").innerHTML = this.responseText;
            swapStyleSheet('css/book.css');
            var script = document.createElement('script');
            script.src = "js/book.js";
            $(".wrapper").append(script);
        }
        xhttp.open("GET", "/txts/book.txt", true);
        xhttp.send();

    });


    $('.register').on('click', function () {

        $('#signin-form').submit();
    })

    $('.show-pass').click(function () {
        $('#password').attr('type', $(this).is(':checked') ? 'text' : 'password');
    });


    let password = document.getElementById("inputPassword");
    let confPass = document.getElementById("confirmPassword");
    let passValid = false;
    let conf = false;

    // validation of password

    password.onfocus = function () {
        document.getElementById("messageBox").style.display = "block";
    }

    password.onblur = function () {
        document.getElementById("messageBox").style.display = "none";
    }

    password.addEventListener('input', (e) => {
        passValid = checkPassword(password);
        validPassword();
    });

    confPass.addEventListener('input', (e) => {
        if (password.value === confPass.value) {
            conf = true;
            document.getElementById("confirmPassBox").style.display = "none";
        }
        else {
            conf = false;
            document.getElementById("confirmPassBox").style.display = "block";
        }
        validPassword();
    });

    function validPassword() {
        if (passValid === true && conf === true) {
            $('.register').prop('disabled', false);
            console.log("done");
        }
        else {
            $('.register').prop('disabled', true);
            console.log("not yet");
        }
    }

    // function to check correctness of password

    function checkPassword(password) {
        let pass = password.value;
        var lowerCaseLetters = /[a-z]/g;
        var digits = /[0-9]/g;
        var upperCaseLetters = /[A-Z]/g;
        let isOk = true;

        let lis = document.querySelectorAll(".warn");

        if (pass.match(lowerCaseLetters)) {
            console.log("changed")
            lis[0].classList.add("valid");
            lis[0].classList.remove("checker");
        }
        else {
            lis[0].classList.remove("valid");
            lis[0].classList.add("checker");
            isOk = false;
        }

        if (pass.match(upperCaseLetters)) {
            lis[1].classList.add("valid");
            lis[1].classList.remove("checker");
        }
        else {
            lis[1].classList.remove("valid");
            lis[1].classList.add("checker");
            isOk = false;
        }

        if (pass.match(digits)) {
            lis[2].classList.add("valid");
            lis[2].classList.remove("checker");
        }
        else {
            lis[2].classList.remove("valid");
            lis[2].classList.add("checker");
            isOk = false;
        }

        if (pass.length >= 8) {
            lis[3].classList.add("valid");
            lis[3].classList.remove("checker");
        }
        else {
            lis[3].classList.remove("valid");
            lis[3].classList.add("checker");
            isOk = false;
        }
        return isOk;
    }

});



