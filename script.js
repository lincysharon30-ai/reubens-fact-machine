let selectedCategory = "ALL";
let currentFact = null;

let remainingFacts = [];
let lastFactId = null;

let surpriseFacts = [];
let lastSurpriseFactId = null;

const categoryButtons = document.querySelectorAll(".categoryButton");

const factButton = document.getElementById("factButton");
const category = document.getElementById("category");
const readTime = document.getElementById("readTime");
const title = document.getElementById("factTitle");
const factText = document.getElementById("factText");
const readMoreButton = document.getElementById("readMoreButton");


/* ============================= */
/* SHUFFLE                       */
/* ============================= */

function shuffleFacts(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}


/* ============================= */
/* CATEGORY SELECTION            */
/* ============================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        const clickedCategory =
            this.dataset.category;


        /* SURPRISE ME */

        if (clickedCategory === "ALL") {

            categoryButtons.forEach(btn => {
                btn.classList.remove("selected");
            });

            this.classList.add("selected");

            runSurpriseMe();

            return;
        }


        /* NORMAL CATEGORY */

        categoryButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        this.classList.add("selected");

        selectedCategory =
            clickedCategory;

        /* fresh shuffled deck whenever
           category changes */

        remainingFacts = [];

        const count = facts.filter(
            fact =>
                fact.category ===
                selectedCategory
        ).length;

        category.textContent =
            `${selectedCategory} · ${count} FACTS`;

    });

});


/* ============================= */
/* RETRO BEEP                    */
/* ============================= */

function playBeep() {

    const audio =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();

    oscillator.type = "square";

    oscillator.frequency.setValueAtTime(
        520,
        audio.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        180,
        audio.currentTime + 0.08
    );

    gain.gain.setValueAtTime(
        0.08,
        audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.08
    );

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.start();

    oscillator.stop(
        audio.currentTime + 0.08
    );
}


/* ============================= */
/* SURPRISE SOUND                */
/* ============================= */

function playSurpriseSound() {

    const audio =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    const notes =
        [220, 330, 440, 660, 880];

    notes.forEach(
        (frequency, index) => {

            const oscillator =
                audio.createOscillator();

            const gain =
                audio.createGain();

            oscillator.type =
                "square";

            oscillator.frequency.value =
                frequency;

            gain.gain.setValueAtTime(
                0.04,
                audio.currentTime +
                    index * 0.08
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audio.currentTime +
                    index * 0.08 +
                    0.1
            );

            oscillator.connect(gain);

            gain.connect(
                audio.destination
            );

            oscillator.start(
                audio.currentTime +
                    index * 0.08
            );

            oscillator.stop(
                audio.currentTime +
                    index * 0.08 +
                    0.1
            );

        }
    );
}


/* ============================= */
/* DISPLAY FACT                  */
/* ============================= */

function displayFact(
    fact,
    categoryCount
) {

    currentFact = fact;

    category.textContent =
        `${currentFact.category} · ${categoryCount} FACTS`;

    readTime.textContent =
        currentFact.readTime;

    title.textContent =
        currentFact.title;

    factText.textContent =
        currentFact.text;

    readMoreButton.style.display =
        "inline-block";

    localStorage.setItem(
        "selectedFact",
        JSON.stringify(currentFact)
    );
}


/* ============================= */
/* SURPRISE ME                   */
/* ============================= */

function runSurpriseMe() {

    playSurpriseSound();

    readMoreButton.style.display =
        "none";

    category.textContent =
        "???";

    readTime.textContent =
        "RANDOMIZING";

    title.textContent =
        "RANDOMIZER ACTIVATED";

    factText.textContent =
        "SELECTING YOUR RABBIT HOLE...";


    const categories = [
        "SCIENCE",
        "SPACE",
        "NATURE",
        "ENGINEERING",
        "ANIMALS",
        "HUMAN BODY",
        "HISTORY",
        "WEIRD",
        "???"
    ];

    let cycle = 0;


    const randomizer =
        setInterval(() => {

            category.textContent =
                categories[
                    Math.floor(
                        Math.random() *
                        categories.length
                    )
                ];

            cycle++;


            if (cycle >= 12) {

                clearInterval(
                    randomizer
                );


                /* REFILL SURPRISE DECK */

                if (
                    surpriseFacts.length === 0
                ) {

                    surpriseFacts =
                        shuffleFacts(facts);


                    /* prevent immediate repeat */

                    if (
                        surpriseFacts.length > 1 &&
                        surpriseFacts[0].id ===
                            lastSurpriseFactId
                    ) {

                        [
                            surpriseFacts[0],
                            surpriseFacts[1]
                        ] = [
                            surpriseFacts[1],
                            surpriseFacts[0]
                        ];

                    }
                }


                const surpriseFact =
                    surpriseFacts.shift();

                lastSurpriseFactId =
                    surpriseFact.id;


                const categoryCount =
                    facts.filter(
                        fact =>
                            fact.category ===
                            surpriseFact.category
                    ).length;


                displayFact(
                    surpriseFact,
                    categoryCount
                );

                playBeep();

            }

        }, 120);

}


/* ============================= */
/* GENERATE NORMAL FACT          */
/* ============================= */

factButton.addEventListener(
    "click",
    function () {

        playBeep();

        let availableFacts;


        if (
            selectedCategory === "ALL"
        ) {

            availableFacts =
                facts;

        } else {

            availableFacts =
                facts.filter(
                    fact =>
                        fact.category ===
                        selectedCategory
                );

        }


        /* NO FACTS IN CATEGORY */

        if (
            availableFacts.length === 0
        ) {

            category.textContent =
                selectedCategory;

            readTime.textContent =
                "???";

            title.textContent =
                "NO FACTS LOADED... YET";

            factText.textContent =
                "This rabbit hole is currently under construction.";

            readMoreButton.style.display =
                "none";

            return;
        }


        /* REFILL CATEGORY DECK */

        if (
            remainingFacts.length === 0
        ) {

            remainingFacts =
                shuffleFacts(
                    availableFacts
                );


            /* prevent immediate repeat */

            if (
                remainingFacts.length > 1 &&
                remainingFacts[0].id ===
                    lastFactId
            ) {

                [
                    remainingFacts[0],
                    remainingFacts[1]
                ] = [
                    remainingFacts[1],
                    remainingFacts[0]
                ];

            }
        }


        currentFact =
            remainingFacts.shift();

        lastFactId =
            currentFact.id;


        displayFact(
            currentFact,
            availableFacts.length
        );

    }
);


/* ============================= */
/* READ MORE                     */
/* ============================= */

readMoreButton.addEventListener(
    "click",
    function () {

        if (!currentFact) {
            return;
        }

        localStorage.setItem(
            "selectedFact",
            JSON.stringify(currentFact)
        );

        window.location.href =
            "fact.html";

    }
);


/* ============================= */
/* DEVELOPER NOTE                */
/* ============================= */

const devModal =
    document.getElementById(
        "devModal"
    );

const openDevNote =
    document.getElementById(
        "openDevNote"
    );

const closeDevNote =
    document.getElementById(
        "closeDevNote"
    );


openDevNote.addEventListener(
    "click",
    function () {

        devModal.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";

    }
);


closeDevNote.addEventListener(
    "click",
    function () {

        devModal.classList.remove(
            "show"
        );

        document.body.style.overflow =
            "";

    }
);


devModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === devModal
        ) {

            devModal.classList.remove(
                "show"
            );

            document.body.style.overflow =
                "";

        }

    }
);