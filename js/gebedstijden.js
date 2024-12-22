let currentDate = new Date();
let month = currentDate.getMonth() + 1;
let prayerTimesPicture = document.getElementById("gebedstijdenFoto");
prayerTimesPicture.src = `./assets/images/${month}.png`;


document.getElementById('submitGebedstijden').addEventListener('click', function (e) {
    e.preventDefault();
    let monthSelected = document.getElementById('maanden').value;
    if (monthSelected != "") {
        prayerTimesPicture.src = `./assets/images/${monthSelected}.png`;
    }
});
