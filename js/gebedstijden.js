let currentDate = new Date();
let month = currentDate.getMonth() + 1;
let prayerTimesPicture = document.getElementById("gebedstijdenFoto");
prayerTimesPicture.src = `./assets/images/${month}.webp`;


document.getElementById('submitGebedstijden').addEventListener('click', function (e) {
    e.preventDefault();
    let monthSelected = document.getElementById('maanden').value;
    prayerTimesPicture.src = `./assets/images/${monthSelected}.webp`;
});

/*https://alquran.cloud/api */