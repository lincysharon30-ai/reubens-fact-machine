const selectedFact =
    JSON.parse(localStorage.getItem("selectedFact"));


/* FIND THE FULL FACT */

const article = selectedFact
    ? facts.find(fact => fact.id === selectedFact.id)
    : null;


/* ============================= */
/* DOMAIN OVERLAY                */
/* ============================= */

const factDomainOverlay =
    document.getElementById("factDomainOverlay");

const factDomainOverlays = {

    "SCIENCE":
        "images/arcade/science-overlay.png",

    "SPACE":
        "images/arcade/space-overlay.png",

    "NATURE":
        "images/arcade/nature-overlay.png",

    "ENGINEERING":
        "images/arcade/engineering-overlay.png",

    "ANIMALS":
        "images/arcade/animals-overlay.png",

    "HUMAN BODY":
        "images/arcade/human-body-overlay.png",

    "HISTORY":
        "images/arcade/history-overlay.png",

    "WEIRD":
        "images/arcade/weird-overlay.png"

};


/* LOAD FACT */

if (!article) {

    window.location.href = "index.html";

} else {

    /* LOAD CORRECT DOMAIN OVERLAY */

    const overlayImage =
        factDomainOverlays[article.category];

    if (factDomainOverlay && overlayImage) {

        factDomainOverlay.style.backgroundImage =
            `url("${overlayImage}")`;

    }


    /* LOAD FACT INFORMATION */

    document.getElementById("fullCategory").textContent =
        article.category;

    document.getElementById("fullReadTime").textContent =
        article.readTime;

    document.getElementById("fullTitle").textContent =
        article.title;


    document.getElementById("fullIntro").textContent =
        article.intro ||
        "This rabbit hole hasn't been fully documented yet.";


    /* HERO IMAGE */

    const image =
        document.getElementById("heroImage");


    if (article.image) {

        image.src = article.image;
        image.alt = article.title;

    } else {

        image.style.display = "none";

    }


    /* ARTICLE CONTENT */

    if (article.content) {

        document.getElementById("articleContent").innerHTML =
            article.content;

    } else {

        document.getElementById("articleContent").innerHTML = `
            <section class="factSection">

                <h2>COMING SOON</h2>

                <p>
                    The full version of this fact is still being loaded
                    into the machine.
                </p>

            </section>
        `;

    }


    /* SOURCE */

    document.getElementById("factSource").textContent =
        article.source
            ? "SOURCE: " + article.source
            : "";

}


/* ============================= */
/* KNOWLEDGE POWER-UP            */
/* ============================= */


/* Automatically counts however many facts exist */

const TOTAL_FACTS = facts.length;

let powerUpShown = false;


/* Get previously completed facts */

let completedFacts =
    JSON.parse(
        localStorage.getItem("completedFacts")
    ) || [];


/* POWER-UP SOUND */

function playPowerUpSound() {

    const audio =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    const notes =
        [440, 660, 880];


    notes.forEach((frequency, index) => {

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();


        oscillator.type = "square";

        oscillator.frequency.value =
            frequency;


        gain.gain.setValueAtTime(
            0.05,
            audio.currentTime +
                index * 0.09
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime +
                index * 0.09 +
                0.12
        );


        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );


        oscillator.start(
            audio.currentTime +
                index * 0.09
        );


        oscillator.stop(
            audio.currentTime +
                index * 0.09 +
                0.12
        );

    });

}


/* SHOW POWER-UP */

function showPowerUp() {

    if (powerUpShown || !article) {
        return;
    }


    /* Don't award the same fact twice */

    if (
        completedFacts.includes(
            article.id
        )
    ) {
        return;
    }


    powerUpShown = true;


    /* Add this fact to completed facts */

    completedFacts.push(
        article.id
    );


    localStorage.setItem(
        "completedFacts",
        JSON.stringify(completedFacts)
    );


    const count =
        completedFacts.length;


    const percentage =
        Math.min(
            (count / TOTAL_FACTS) * 100,
            100
        );


    /* UPDATE COUNTER */

    document
        .getElementById("knowledgeCount")
        .textContent =

        String(count).padStart(2, "0") +
        " / " +
        TOTAL_FACTS;


    /* SHOW POP-UP */

    const powerUp =
        document.getElementById(
            "powerUp"
        );


    powerUp.classList.add(
        "show"
    );


    /* ANIMATE BATTERY */

    setTimeout(() => {

        document
            .getElementById("batteryFill")
            .style.width =
            percentage + "%";

    }, 250);


    playPowerUpSound();

}


/* ============================= */
/* DETECT END OF ARTICLE         */
/* ============================= */

window.addEventListener(
    "scroll",
    function () {

        const scrollPosition =
            window.innerHeight +
            window.scrollY;


        const pageHeight =
            document
                .documentElement
                .scrollHeight;


        if (
            scrollPosition >=
            pageHeight - 120
        ) {

            showPowerUp();

        }

    }
);


/* ============================= */
/* CLOSE POWER-UP                */
/* ============================= */

document
    .getElementById("powerUp")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target === this
            ) {

                this.classList.remove(
                    "show"
                );

            }

        }
    );