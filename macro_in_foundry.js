// ============================================================
// PALISADE // OMNI-NET
// GM CONTROL MACRO
//
// Requires:
//   palisade-omni-net module
//
// Public API:
//   PalisadeOmniNet.show(state)
//   PalisadeOmniNet.close()
// ============================================================

if (!game.user.isGM) {
    ui.notifications.warn("PALISADE control is GM-only.");
    return;
}


// ============================================================
// STATE
// ============================================================

if (!globalThis.PALISADE_STATE) {

    globalThis.PALISADE_STATE = {

        title: "PALISADE // OMNI-NET",

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


// ============================================================
// REMOVE EXISTING PANEL
// ============================================================

const existing =
    document.getElementById(
        "palisade-gm-control"
    );

if (existing) {
    existing.remove();
}


// ============================================================
// ROOT
// ============================================================

const root =
    document.createElement("div");

root.id =
    "palisade-gm-control";

root.innerHTML = `

    <div class="palisade-gm-panel">

        <div class="palisade-gm-titlebar">

            <span class="palisade-gm-drag">
                PALISADE // CONTROL
            </span>

            <button
                type="button"
                class="palisade-gm-close"
                title="Close control panel"
            >×</button>

        </div>


        <div class="palisade-gm-section">

            <div class="palisade-gm-label">
                CONNECTION
            </div>

            <div class="palisade-gm-row">

                <button
                    type="button"
                    data-action="link-minus"
                >−</button>

                <span
                    class="palisade-gm-value"
                    data-value="link"
                ></span>

                <button
                    type="button"
                    data-action="link-plus"
                >+</button>

            </div>

        </div>


        <div class="palisade-gm-section">

            <div class="palisade-gm-label">
                ACTIVE OPERATOR
            </div>

            <select
                class="palisade-gm-select"
                data-field="activeOperator"
            ></select>

        </div>


        <div class="palisade-gm-section">

            <div class="palisade-gm-label">
                EXPOSURE
            </div>

            <div class="palisade-gm-row">

                <button
                    type="button"
                    data-action="exposure-minus"
                >−</button>

                <span
                    class="palisade-gm-value"
                    data-value="exposure"
                ></span>

                <button
                    type="button"
                    data-action="exposure-plus"
                >+</button>

            </div>

        </div>


        <div class="palisade-gm-section">

            <div class="palisade-gm-label">
                HANDSHAKE
            </div>

            <select
                class="palisade-gm-select"
                data-field="handshake"
            >

                <option value="STABLE">
                    STABLE
                </option>

                <option value="UNSTABLE">
                    UNSTABLE
                </option>

                <option value="CRITICAL">
                    CRITICAL
                </option>

                <option value="LOST">
                    LOST
                </option>

            </select>

        </div>


        <div class="palisade-gm-section">

            <div class="palisade-gm-label">
                MESSAGE
            </div>

            <input
                type="text"
                class="palisade-gm-message"
                data-field="message"
            />

        </div>


        <div class="palisade-gm-actions">

            <button
                type="button"
                class="palisade-gm-broadcast"
                data-action="broadcast"
            >
                BROADCAST
            </button>

            <button
                type="button"
                class="palisade-gm-close-terminal"
                data-action="close-terminal"
            >
                CLOSE
            </button>

        </div>

    </div>
`;


// ============================================================
// CSS
// ============================================================

const style =
    document.createElement("style");

style.id =
    "palisade-gm-control-style";

style.textContent = `

    #palisade-gm-control {

        position: fixed;

        inset: 0;

        z-index: 100001;

        pointer-events: none;

        font-family:
            "Courier New",
            "Liberation Mono",
            monospace;
    }


    .palisade-gm-panel {

        position: fixed;

        left: 30px;

        top: 100px;

        width: 270px;

        box-sizing: border-box;

        padding: 14px;

        pointer-events: auto;

        background:
            radial-gradient(
                ellipse at center,
                #111 0%,
                #050505 70%,
                #000 100%
            );

        color: #aaa;

        border: 1px solid #444;

        box-shadow:
            0 0 30px rgba(0,0,0,.8),
            inset 0 0 25px rgba(255,255,255,.025);

        letter-spacing: 1px;

        user-select: none;
    }


    .palisade-gm-titlebar {

        display: flex;

        align-items: center;

        justify-content: space-between;

        height: 24px;

        margin:
            -4px
            -4px
            12px
            -4px;

        color: #666;

        font-size: 9px;

        letter-spacing: 2px;
    }


    .palisade-gm-drag {

        flex: 1;

        cursor: move;

        user-select: none;
    }


    .palisade-gm-close {

        width: 24px;

        height: 24px;

        padding: 0;

        border: 0;

        background: transparent;

        color: #666;

        font-family: monospace;

        font-size: 18px;

        line-height: 20px;

        cursor: pointer;
    }


    .palisade-gm-close:hover {

        color: #ddd;
    }


    .palisade-gm-section {

        margin-bottom: 15px;
    }


    .palisade-gm-label {

        margin-bottom: 6px;

        color: #666;

        font-size: 9px;

        letter-spacing: 2px;
    }


    .palisade-gm-row {

        display: flex;

        align-items: center;

        gap: 8px;
    }


    .palisade-gm-row button {

        width: 28px;

        height: 25px;

        padding: 0;

        border: 1px solid #444;

        background: #080808;

        color: #aaa;

        font-family: monospace;

        font-size: 15px;

        cursor: pointer;
    }


    .palisade-gm-row button:hover {

        border-color: #777;

        color: #eee;
    }


    .palisade-gm-value {

        flex: 1;

        text-align: center;

        color: #ccc;

        font-size: 12px;
    }


    .palisade-gm-select,
    .palisade-gm-message {

        width: 100%;

        box-sizing: border-box;

        border: 1px solid #444;

        background: #080808;

        color: #bbb;

        font-family: monospace;

        font-size: 11px;

        padding: 5px 6px;

        outline: none;
    }


    .palisade-gm-select:focus,
    .palisade-gm-message:focus {

        border-color: #777;
    }


    .palisade-gm-actions {

        display: flex;

        gap: 8px;

        margin-top: 20px;
    }


    .palisade-gm-actions button {

        flex: 1;

        height: 30px;

        border: 1px solid #555;

        background: #090909;

        color: #aaa;

        font-family: monospace;

        font-size: 9px;

        letter-spacing: 1px;

        cursor: pointer;
    }


    .palisade-gm-actions button:hover {

        border-color: #888;

        color: #eee;
    }

`;

document.head.appendChild(style);

document.body.appendChild(root);


// ============================================================
// ELEMENTS
// ============================================================

const panel =
    root.querySelector(
        ".palisade-gm-panel"
    );

const dragHandle =
    root.querySelector(
        ".palisade-gm-drag"
    );

const closeButton =
    root.querySelector(
        ".palisade-gm-close"
    );

const operatorSelect =
    root.querySelector(
        '[data-field="activeOperator"]'
    );

const handshakeSelect =
    root.querySelector(
        '[data-field="handshake"]'
    );

const messageInput =
    root.querySelector(
        '[data-field="message"]'
    );


// ============================================================
// SELECT OPERATORS
// ============================================================

operatorSelect.innerHTML =
    state.operators
        .map(operator => `
            <option value="${operator.name}">
                ${operator.name}
            </option>
        `)
        .join("");


// ============================================================
// ACTIVE OPERATOR INDEX
// ============================================================

function getActiveOperator() {

    return state.operators.findIndex(
        operator =>
            operator.name ===
            state.activeOperator
    );
}


function getActiveOperatorData() {

    const index =
        getActiveOperator();

    if (index < 0) {
        return null;
    }

    return state.operators[index];
}


// ============================================================
// RENDER PANEL STATE
// ============================================================

function render() {

    root.querySelector(
        '[data-value="link"]'
    ).textContent =
        `${String(state.link).padStart(2, "0")} / ${String(state.maxLink).padStart(2, "0")}`;


    const active =
        getActiveOperatorData();


    root.querySelector(
        '[data-value="exposure"]'
    ).textContent =
        active
            ? String(active.exposure).padStart(2, "0")
            : "--";


    operatorSelect.value =
        state.activeOperator;


    handshakeSelect.value =
        state.handshake;


    messageInput.value =
        state.message;
}


render();


// ============================================================
// LINK CONTROLS
// ============================================================

root.querySelector(
    '[data-action="link-minus"]'
).addEventListener(
    "click",
    () => {

        state.link =
            Math.max(
                0,
                state.link - 1
            );

        render();
    }
);


root.querySelector(
    '[data-action="link-plus"]'
).addEventListener(
    "click",
    () => {

        state.link =
            Math.min(
                state.maxLink,
                state.link + 1
            );

        render();
    }
);


// ============================================================
// OPERATOR
// ============================================================

operatorSelect.addEventListener(
    "change",
    event => {

        state.activeOperator =
            event.target.value;

        render();
    }
);


// ============================================================
// EXPOSURE
// ============================================================

root.querySelector(
    '[data-action="exposure-minus"]'
).addEventListener(
    "click",
    () => {

        const active =
            getActiveOperatorData();

        if (!active) {
            return;
        }

        active.exposure =
            Math.max(
                0,
                active.exposure - 1
            );

        render();
    }
);


root.querySelector(
    '[data-action="exposure-plus"]'
).addEventListener(
    "click",
    () => {

        const active =
            getActiveOperatorData();

        if (!active) {
            return;
        }

        active.exposure =
            Math.min(
                6,
                active.exposure + 1
            );

        render();
    }
);


// ============================================================
// HANDSHAKE
// ============================================================

handshakeSelect.addEventListener(
    "change",
    event => {

        state.handshake =
            event.target.value;
    }
);


// ============================================================
// MESSAGE
// ============================================================

messageInput.addEventListener(
    "input",
    event => {

        state.message =
            event.target.value;
    }
);


// ============================================================
// BROADCAST
// ============================================================

root.querySelector(
    '[data-action="broadcast"]'
).addEventListener(
    "click",
    () => {

        globalThis.PalisadeOmniNet.show(
            state
        );
    }
);


// ============================================================
// CLOSE TERMINAL — ALL CLIENTS
// ============================================================

root.querySelector(
    '[data-action="close-terminal"]'
).addEventListener(
    "click",
    () => {

        globalThis.PalisadeOmniNet.close();
    }
);


// ============================================================
// CLOSE CONTROL PANEL — LOCAL ONLY
// ============================================================

function closePanel() {

    cleanupDrag();

    document.removeEventListener(
        "keydown",
        onKeyDown
    );

    root.remove();

    const panelStyle =
        document.getElementById(
            "palisade-gm-control-style"
        );

    if (panelStyle) {
        panelStyle.remove();
    }
}


closeButton.addEventListener(
    "click",
    event => {

        event.preventDefault();

        event.stopPropagation();

        closePanel();
    }
);


// ============================================================
// ESC — LOCAL PANEL ONLY
// ============================================================

function onKeyDown(event) {

    if (event.key === "Escape") {

        closePanel();
    }
}

document.addEventListener(
    "keydown",
    onKeyDown
);


// ============================================================
// DRAG
// ============================================================

let dragging = false;

let offsetX = 0;
let offsetY = 0;


dragHandle.addEventListener(
    "mousedown",
    event => {

        if (event.button !== 0) {
            return;
        }

        const rect =
            panel.getBoundingClientRect();


        panel.style.left =
            `${rect.left}px`;

        panel.style.top =
            `${rect.top}px`;

        panel.style.transform =
            "none";


        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;


        dragging = true;

        event.preventDefault();

        event.stopPropagation();
    }
);


function onMouseMove(event) {

    if (!dragging) {
        return;
    }

    panel.style.left =
        `${event.clientX - offsetX}px`;

    panel.style.top =
        `${event.clientY - offsetY}px`;
}


function onMouseUp() {

    dragging = false;
}


document.addEventListener(
    "mousemove",
    onMouseMove
);

document.addEventListener(
    "mouseup",
    onMouseUp
);


// ============================================================
// DRAG CLEANUP
// ============================================================

function cleanupDrag() {

    dragging = false;

    document.removeEventListener(
        "mousemove",
        onMouseMove
    );

    document.removeEventListener(
        "mouseup",
        onMouseUp
    );
}
