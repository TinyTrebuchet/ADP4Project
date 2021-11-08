
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
        let total = 0;
        let services = [];
        checkboxes.forEach(function (userItem) {
            let service = userItem.parentElement.children[1].children[0].innerText;
            services.push(service);
            total += parseInt(userItem.value);
        });

        document.cookie = "totalCost=" + total + ";";
        document.cookie = "services=" + services.join(",") + ";";

        // var xhr = new XMLHttpRequest();
        // xhr.open("POST", "/appointment", true);
        // xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        // xhr.send(JSON.stringify({
        // }));

        console.log(document.cookie);
    });

    $('.form-check').on('click', function () {

        let checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
        let t = 0;
        checkboxes.forEach(function (userItem) {
            t += parseInt(userItem.value);
        });
        $(".total-price").html(t + " INR");

    });

});