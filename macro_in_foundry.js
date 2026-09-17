// ============================================================
// PALISADE // CONTROL
// GM CONTROL PANEL
// ============================================================

if (!game.user.isGM) {

    ui.notifications.warn(
        "PALISADE control is GM-only."
    );

    return;
}


// ------------------------------------------------------------
// State
// ------------------------------------------------------------

if (!globalThis.PALISADE_STATE) {

    globalThis.PALISADE_STATE = {

        title:
            "PALISADE // OMNI-NET",

        subtitle:
            "LEGACY EXPERIMENTAL NODE 07",

        link: 0,

        maxLink: 8,

        handshake:
            "STABLE",

        activeOperator:
            "МАЛЮТКА",

        message:
            "CONTINUITY IS A PROCESS.",

        operators: [

            {
                name: "МАЛЮТКА",
                exposure: 0
            },

            {
                name: "PEGASUS",
                exposure: 0
            },

            {
                name: "BALOR",
                exposure: 0
            },

            {
                name: "DRAKE",
                exposure: 0
            }

        ]
    };
}


const state =
    globalThis.PALISADE_STATE;


// ------------------------------------------------------------
// Existing panel?
// ------------------------------------------------------------

document
    .getElementById(
        "palisade-gm-control"
    )
    ?.remove();


// ------------------------------------------------------------
// Panel
// ------------------------------------------------------------

const panel =
    document.createElement("div");


panel.id =
    "palisade-gm-control";


panel.innerHTML = `

<style>

#palisade-gm-control {

    position: fixed;

    top: 80px;

    right: 30px;

    width: 360px;

    z-index: 100001;

    background: #050505;

    color: #bbb;

    border: 1px solid #444;

    box-shadow:
        0 0 30px rgba(0,0,0,.8);

    padding: 18px;

    font-family:
        "Courier New",
        monospace;

    font-size: 12px;
}


#palisade-gm-control h2 {

    margin: 0 0 4px 0;

    color: #ddd;

    font-size: 15px;

    letter-spacing: 2px;
}


.pgm-sub {

    color: #666;

    font-size: 9px;

    letter-spacing: 2px;

    margin-bottom: 15px;
}


.pgm-row {

    display: flex;

    align-items: center;

    gap: 8px;

    margin: 7px 0;
}


.pgm-label {

    width: 120px;

    color: #777;

    font-size: 10px;

    letter-spacing: 1px;
}


.pgm-value {

    width: 45px;

    text-align: center;

    color: #ddd;

}


.pgm-btn {

    cursor: pointer;

    background: #111;

    color: #bbb;

    border: 1px solid #444;

    padding: 3px 9px;

    font-family: inherit;
}


.pgm-btn:hover {

    background: #222;

    color: white;
}


.pgm-input {

    flex: 1;

    background: #080808;

    color: #ccc;

    border: 1px solid #333;

    padding: 5px;

    font-family: inherit;
}


.pgm-select {

    flex: 1;

    background: #080808;

    color: #ccc;

    border: 1px solid #333;

    padding: 5px;

    font-family: inherit;
}


.pgm-divider {

    border-top: 1px solid #222;

    margin: 14px 0;
}


.pgm-action {

    display: flex;

    gap: 8px;

    margin-top: 16px;
}


.pgm-broadcast {

    flex: 1;

    background: #151515;

    color: #ddd;

    border: 1px solid #777;

    padding: 9px;

    cursor: pointer;

    font-family: inherit;

    letter-spacing: 2px;
}


.pgm-close {

    width: 90px;

    background: #080808;

    color: #888;

    border: 1px solid #333;

    cursor: pointer;

    font-family: inherit;
}


.pgm-broadcast:hover,
.pgm-close:hover {

    background: #222;

    color: white;
}

</style>


<h2>PALISADE // CONTROL</h2>

<div class="pgm-sub">
GM TERMINAL INTERFACE
</div>


<div class="pgm-divider"></div>


<div class="pgm-row">

    <div class="pgm-label">
        CONNECTION
    </div>

    <button class="pgm-btn"
            data-action="link-minus">
        −
    </button>

    <div class="pgm-value"
         id="pgm-link">
        ${state.link}
    </div>

    <button class="pgm-btn"
            data-action="link-plus">
        +
    </button>

</div>


<div class="pgm-row">

    <div class="pgm-label">
        OPERATOR
    </div>

    <select
        class="pgm-select"
        id="pgm-operator">

        ${state.operators
            .map(op => `
                <option
                    value="${op.name}"
                    ${op.name === state.activeOperator
                        ? "selected"
                        : ""}>
                    ${op.name}
                </option>
            `)
            .join("")}

    </select>

</div>


<div class="pgm-divider"></div>


<div class="pgm-sub">
RADIOLARIAN EXPOSURE
</div>


<div id="pgm-exposure"></div>


<div class="pgm-divider"></div>


<div class="pgm-row">

    <div class="pgm-label">
        HANDSHAKE
    </div>

    <select
        class="pgm-select"
        id="pgm-handshake">

        <option
            ${state.handshake === "STABLE"
                ? "selected" : ""}>
            STABLE
        </option>

        <option
            ${state.handshake === "ANOMALOUS"
                ? "selected" : ""}>
            ANOMALOUS
        </option>

        <option
            ${state.handshake === "CRITICAL"
                ? "selected" : ""}>
            CRITICAL
        </option>

        <option
            ${state.handshake === "UNKNOWN"
                ? "selected" : ""}>
            UNKNOWN
        </option>

    </select>

</div>


<div class="pgm-row">

    <div class="pgm-label">
        MESSAGE
    </div>

    <input
        class="pgm-input"
        id="pgm-message"
        value="${state.message.replaceAll('"', '&quot;')}"
    />

</div>


<div class="pgm-action">

    <button
        class="pgm-broadcast"
        data-action="broadcast">

        BROADCAST

    </button>


    <button
        class="pgm-close"
        data-action="close">

        CLOSE

    </button>

</div>

`;

document.body.appendChild(panel);


// ============================================================
// EXPOSURE UI
// ============================================================

function renderExposure() {

    const container =
        panel.querySelector(
            "#pgm-exposure"
        );


    container.innerHTML =
        state.operators
            .map((op, index) => `

                <div class="pgm-row">

                    <div class="pgm-label">
                        ${op.name}
                    </div>

                    <button
                        class="pgm-btn"
                        data-exp-minus="${index}">
                        −
                    </button>

                    <div
                        class="pgm-value">
                        ${op.exposure}
                    </div>

                    <button
                        class="pgm-btn"
                        data-exp-plus="${index}">
                        +
                    </button>

                </div>

            `)
            .join("");
}


renderExposure();


// ============================================================
// EVENT HANDLERS
// ============================================================

panel.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("button");

        if (!button) return;


        const action =
            button.dataset.action;


        // ----------------------------------------------------
        // Link
        // ----------------------------------------------------

        if (action === "link-minus") {

            state.link =
                Math.max(
                    0,
                    state.link - 1
                );

            panel.querySelector(
                "#pgm-link"
            ).textContent =
                state.link;

            return;
        }


        if (action === "link-plus") {

            state.link =
                Math.min(
                    state.maxLink,
                    state.link + 1
                );

            panel.querySelector(
                "#pgm-link"
            ).textContent =
                state.link;

            return;
        }


        // ----------------------------------------------------
        // Exposure
        // ----------------------------------------------------

        if (
            button.dataset.expMinus !==
            undefined
        ) {

            const index =
                Number(
                    button.dataset.expMinus
                );

            state.operators[index].exposure =
                Math.max(
                    0,
                    state.operators[index].exposure - 1
                );

            renderExposure();

            return;
        }


        if (
            button.dataset.expPlus !==
            undefined
        ) {

            const index =
                Number(
                    button.dataset.expPlus
                );

            state.operators[index].exposure =
                Math.min(
                    6,
                    state.operators[index].exposure + 1
                );

            renderExposure();

            return;
        }


        // ----------------------------------------------------
        // Broadcast
        // ----------------------------------------------------

        if (action === "broadcast") {

            state.activeOperator =
                panel.querySelector(
                    "#pgm-operator"
                ).value;


            state.handshake =
                panel.querySelector(
                    "#pgm-handshake"
                ).value;


            state.message =
                panel.querySelector(
                    "#pgm-message"
                ).value;


            if (
                globalThis.PalisadeOmniNet
            ) {

                globalThis.PalisadeOmniNet.show(
                    state
                );

                ui.notifications.info(
                    "PALISADE // broadcast sent."
                );

            } else {

                ui.notifications.error(
                    "PALISADE module is not initialized."
                );
            }

            return;
        }


        // ----------------------------------------------------
        // Close
        // ----------------------------------------------------

        if (action === "close") {

            if (
                globalThis.PalisadeOmniNet
            ) {

                globalThis.PalisadeOmniNet.close();

            }

            return;
        }
    }
);