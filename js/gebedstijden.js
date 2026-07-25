const months = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December"
];

const year = 2026;
const monthSelect = document.getElementById("maanden");
const calendarImage = document.getElementById("gebedstijdenFoto");
const calendarPaper = document.getElementById("calendarPaper");
const monthTitle = document.getElementById("monthTitle");
const dialogMonthTitle = document.getElementById("dialogMonthTitle");
const calendarStatus = document.getElementById("calendarStatus");
const previousButton = document.getElementById("previousMonth");
const nextButton = document.getElementById("nextMonth");
const monthButtons = [...document.querySelectorAll("[data-month]")];
const downloadLink = document.getElementById("downloadCalendar");
const imageDialog = document.getElementById("imageDialog");
const dialogImage = document.getElementById("dialogImage");
const openFullscreenButton = document.getElementById("openFullscreen");
const closeDialogButton = document.getElementById("closeDialog");

let selectedMonth = getInitialMonth();

function getInitialMonth() {
    const queryMonth = Number(new URLSearchParams(window.location.search).get("month"));

    if (Number.isInteger(queryMonth) && queryMonth >= 1 && queryMonth <= 12) {
        return queryMonth;
    }

    return new Date().getMonth() + 1;
}

function calendarPath(month) {
    return `./assets/images/${month}.png`;
}

function updateUrl(month) {
    try {
        const url = new URL(window.location.href);
        url.searchParams.set("month", String(month));
        window.history.replaceState({}, "", url);
    } catch {
        // De site blijft ook werken wanneer history-API's lokaal beperkt zijn.
    }
}

function setMonth(month, { announce = true, updateHistory = true } = {}) {
    const safeMonth = ((Number(month) - 1 + 12) % 12) + 1;
    const monthName = months[safeMonth - 1];
    const imagePath = calendarPath(safeMonth);
    const imageAlt = `Gebedskalender voor ${monthName.toLowerCase()} ${year}`;

    selectedMonth = safeMonth;
    monthSelect.value = String(safeMonth);
    monthTitle.textContent = monthName;
    dialogMonthTitle.textContent = monthName;

    monthButtons.forEach((button) => {
        const isActive = Number(button.dataset.month) === safeMonth;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "true" : "false");
    });

    calendarPaper.classList.add("is-loading");
    calendarImage.src = imagePath;
    calendarImage.alt = imageAlt;
    dialogImage.src = imagePath;
    dialogImage.alt = imageAlt;

    downloadLink.href = imagePath;
    downloadLink.download = `gebedstijden-${monthName.toLowerCase()}-${year}.png`;

    if (updateHistory) {
        updateUrl(safeMonth);
    }

    if (announce) {
        calendarStatus.textContent = `${monthName} ${year} is geselecteerd.`;
    }
}

calendarImage.addEventListener("load", () => {
    calendarPaper.classList.remove("is-loading");
});

calendarImage.addEventListener("error", () => {
    calendarPaper.classList.remove("is-loading");
    calendarStatus.textContent = "De kalenderafbeelding kon niet worden geladen.";
});

monthSelect.addEventListener("change", (event) => {
    setMonth(Number(event.target.value));
});

previousButton.addEventListener("click", () => {
    setMonth(selectedMonth - 1);
});

nextButton.addEventListener("click", () => {
    setMonth(selectedMonth + 1);
});

monthButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setMonth(Number(button.dataset.month));
    });
});

openFullscreenButton.addEventListener("click", () => {
    if (typeof imageDialog.showModal === "function") {
        imageDialog.showModal();
        document.body.style.overflow = "hidden";
        return;
    }

    window.open(calendarPath(selectedMonth), "_blank", "noopener,noreferrer");
});

function closeDialog() {
    imageDialog.close();
    document.body.style.overflow = "";
}

closeDialogButton.addEventListener("click", closeDialog);

imageDialog.addEventListener("click", (event) => {
    if (event.target === imageDialog) {
        closeDialog();
    }
});

imageDialog.addEventListener("close", () => {
    document.body.style.overflow = "";
});

document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName;
    const isTyping = activeTag === "INPUT" || activeTag === "SELECT" || activeTag === "TEXTAREA";

    if (isTyping || imageDialog.open) {
        return;
    }

    if (event.key === "ArrowLeft") {
        setMonth(selectedMonth - 1);
    }

    if (event.key === "ArrowRight") {
        setMonth(selectedMonth + 1);
    }
});

setMonth(selectedMonth, { announce: false, updateHistory: true });
calendarStatus.textContent = `${months[selectedMonth - 1]} ${year} is automatisch geopend.`;


// Een apart niet-sticky anker voorkomt dat de vaste header de sprong blokkeert.
document.querySelectorAll('a[href="#boven"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });

        if (window.location.hash !== "#boven") {
            window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}#boven`);
        }
    });
});
