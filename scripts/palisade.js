/*
 * PALISADE // OMNI-NET
 * Reusable Foundry VTT terminal UI
 *
 * Foundry VTT 13
 */

let glitchAnimationFrame = null;
let terminalCleanup = null;

const MODULE_ID = "palisade-omni-net";

// ============================================================
// DEFAULT STATE
// ============================================================

const DEFAULT_STATE = {
    title: "PALISADE // OMNI-NET",
    subtitle: "LEGACY EXPERIMENTAL NODE 07",

    link: 0,
    maxLink: 8,

    handshake: "STABLE",
    activeOperator: "",

    message: "CONTINUITY IS A PROCESS.",

    operators: [
        { name: "МАЛЮТКА", exposure: 0 },
        { name: "PEGASUS", exposure: 0 },
        { name: "BALOR", exposure: 0 },
        { name: "DRAKE", exposure: 0 }
    ]
};


// ============================================================
// UTILITIES
// ============================================================

function cloneState(state) {
    return foundry.utils.deepClone(state);
}

function normalizeState(state) {
    return foundry.utils.mergeObject(
        cloneState(DEFAULT_STATE),
        state ?? {},
        {
            inplace: false
        }
    );
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function exposureBar(value) {
    const max = 6;

    value = Math.max(
        0,
        Math.min(max, Number(value) || 0)
    );

    return (
        "#".repeat(value) +
        ".".repeat(max - value)
    );
}

function linkBar(link, maxLink) {
    const length = 24;

    const safeMax = Number(maxLink) || 1;
    const safeLink = Math.max(
        0,
        Math.min(safeMax, Number(link) || 0)
    );

    const filled = Math.round(
        (safeLink / safeMax) * length
    );

    return (
        "█".repeat(filled) +
        "░".repeat(length - filled)
    );
}


// ============================================================
// PLAYER TERMINAL
// ============================================================

function createTerminal(state) {
    state = normalizeState(state);

    const root = document.createElement("div");

    root.id = "palisade-omni-net-terminal";

    root.innerHTML = `
        <div class="palisade-terminal">

            <div class="palisade-titlebar">
                <span class="palisade-drag-handle">
                    PALISADE // OMNI-NET
                </span>

                <button
                    type="button"
                    class="palisade-close"
                    title="Close terminal"
                >×</button>
            </div>

            <div class="palisade-glitch">
                <pre class="palisade-glitch-text"></pre>
            </div>

            <div class="palisade-stable">

                <div class="palisade-header"></div>

                <div class="palisade-subheader"></div>

                <div class="palisade-line"></div>

                <div class="palisade-section">
                    CONNECTION
                </div>

                <div class="palisade-link">
                    <span class="palisade-link-bar"></span>
                    <span class="palisade-link-number"></span>
                </div>

                <div class="palisade-status">
                    HANDSHAKE .................
                    <span class="palisade-handshake"></span>
                </div>

                <div class="palisade-line"></div>

                <div class="palisade-section">
                    RADIOLARIAN EXPOSURE
                </div>

                <div class="palisade-operators"></div>

                <div class="palisade-section palisade-active-title">
                    ACTIVE OPERATOR
                </div>

                <div class="palisade-active-operator"></div>

                <div class="palisade-message"></div>

            </div>

        </div>
    `;

    document.body.appendChild(root);

    // --------------------------------------------------------
    // Style
    // --------------------------------------------------------

    const style = document.createElement("style");

    style.id = "palisade-omni-net-style";

    style.textContent = `
        #palisade-omni-net-terminal {

            position: fixed;

            inset: 0;

            z-index: 100000;

            pointer-events: none;

            display: flex;

            align-items: center;

            justify-content: center;

            font-family:
                "Courier New",
                "Liberation Mono",
                monospace;
        }


        .palisade-terminal {

            position: relative;

            pointer-events: auto;

            width: 650px;

            min-height: 430px;

            box-sizing: border-box;

            padding: 28px;

            background:
                radial-gradient(
                    ellipse at center,
                    #111 0%,
                    #050505 65%,
                    #000 100%
                );

            color: #cfcfcf;

            border: 1px solid #444;

            box-shadow:
                0 0 60px rgba(0,0,0,.95),
                0 0 120px rgba(0,0,0,.75),
                inset 0 0 60px rgba(255,255,255,.025);

            letter-spacing: 1px;

            overflow: hidden;
        }


        .palisade-terminal::after {

            content: "";

            position: absolute;

            inset: 0;

            pointer-events: none;

            background:
                repeating-linear-gradient(
                    to bottom,
                    rgba(255,255,255,.025) 0px,
                    rgba(255,255,255,.025) 1px,
                    transparent 1px,
                    transparent 4px
                );

            opacity: .35;
        }


        .palisade-titlebar {

            display: flex;

            align-items: center;

            justify-content: space-between;

            height: 24px;

            margin:
                -16px
                -16px
                14px
                -16px;

            color: #555;

            font-size: 9px;

            letter-spacing: 2px;

            user-select: none;
        }


        .palisade-drag-handle {

            flex: 1;

            cursor: move;

            user-select: none;
        }


        .palisade-close {

            width: 24px;

            height: 24px;

            padding: 0;

            border: 0;

            background: transparent;

            color: #555;

            font-family: monospace;

            font-size: 18px;

            line-height: 20px;

            cursor: pointer;
        }


        .palisade-close:hover {
            color: #ddd;
        }


        .palisade-header {

            font-size: 20px;

            letter-spacing: 4px;

            color: #ddd;
        }


        .palisade-subheader {

            margin-top: 5px;

            color: #666;

            font-size: 11px;

            letter-spacing: 3px;
        }


        .palisade-line {

            border-top: 1px solid #333;

            margin: 18px 0;
        }


        .palisade-section {

            color: #777;

            font-size: 10px;

            letter-spacing: 3px;

            margin-bottom: 10px;
        }


        .palisade-link {

            font-size: 17px;

            letter-spacing: 2px;

            white-space: nowrap;
        }


        .palisade-link-number {

            color: #999;

            font-size: 12px;

            margin-left: 12px;
        }


        .palisade-status {

            margin-top: 9px;

            color: #777;

            font-size: 10px;
        }


        .palisade-handshake {

            color: #aaa;

            letter-spacing: 2px;
        }


        .palisade-operator {

            display: flex;

            align-items: center;

            height: 29px;

            font-size: 13px;
        }


        .palisade-active {

            width: 24px;

            color: #ddd;
        }


        .palisade-name {

            width: 130px;

            color: #ccc;
        }


        .palisade-exposure {

            color: #999;

            letter-spacing: 2px;
        }


        .palisade-exposure-number {

            margin-left: 10px;

            color: #777;
        }


        .palisade-active-title {

            margin-top: 22px;

            margin-bottom: 6px;
        }


        .palisade-active-operator {

            color: #ccc;

            font-size: 13px;
        }


        .palisade-message {

            margin-top: 20px;

            padding-top: 12px;

            border-top: 1px solid #222;

            color: #666;

            font-size: 10px;

            line-height: 1.7;
        }


        .palisade-glitch {

            min-height: 370px;

            animation:
                palisade-flicker .11s infinite;
        }


        .palisade-glitch-text {

            margin: 0;

            color: #aaa;

            font-family:
                "Courier New",
                monospace;

            font-size: 12px;

            line-height: 1.65;

            white-space: pre-wrap;
        }


        .palisade-stable {
            display: none;
        }


        .palisade-ready .palisade-glitch {
            display: none;
        }


        .palisade-ready .palisade-stable {
            display: block;
        }


        @keyframes palisade-flicker {

            0% {
                opacity: 1;
                transform: translate(0,0);
            }

            20% {
                opacity: .75;
                transform: translate(-2px,0);
            }

            40% {
                opacity: .95;
                transform: translate(2px,0);
            }

            60% {
                opacity: .65;
                transform: translate(0,1px);
            }

            80% {
                opacity: .9;
                transform: translate(-1px,0);
            }

            100% {
                opacity: 1;
                transform: translate(0,0);
            }
        }
    `;

    document.head.appendChild(style);

    // --------------------------------------------------------
    // Interaction
    // --------------------------------------------------------

    const terminal =
        root.querySelector(".palisade-terminal");

    const dragHandle =
        root.querySelector(".palisade-drag-handle");

    const closeButton =
        root.querySelector(".palisade-close");


    // --------------------------------------------------------
    // Close button
    // --------------------------------------------------------

    closeButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            closeTerminal();
        }
    );


    // --------------------------------------------------------
    // Drag
    // --------------------------------------------------------

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
                terminal.getBoundingClientRect();


            // IMPORTANT:
            //
            // The terminal is initially positioned by the
            // fullscreen flex container.
            //
            // Because .palisade-terminal is position: relative,
            // assigning left/top directly would offset it from
            // its flex-positioned location.
            //
            // Switch it to fixed positioning first so that
            // rect.left/top become actual viewport coordinates.

            terminal.style.position = "fixed";

            terminal.style.left =
                `${rect.left}px`;

            terminal.style.top =
                `${rect.top}px`;

            terminal.style.transform =
                "none";


            offsetX =
                event.clientX - rect.left;

            offsetY =
                event.clientY - rect.top;


            dragging = true;

            event.preventDefault();
        }
    );


    const onMouseMove =
        event => {

            if (!dragging) {
                return;
            }

            terminal.style.left =
                `${event.clientX - offsetX}px`;

            terminal.style.top =
                `${event.clientY - offsetY}px`;
        };


    const onMouseUp =
        () => {

            dragging = false;
        };


    document.addEventListener(
        "mousemove",
        onMouseMove
    );

    document.addEventListener(
        "mouseup",
        onMouseUp
    );


    // --------------------------------------------------------
    // Escape
    // --------------------------------------------------------

    const onKeyDown =
        event => {

            if (event.key === "Escape") {

                closeTerminal();
            }
        };


    document.addEventListener(
        "keydown",
        onKeyDown
    );


    // --------------------------------------------------------
    // Cleanup
    // --------------------------------------------------------

    terminalCleanup = () => {

        document.removeEventListener(
            "mousemove",
            onMouseMove
        );

        document.removeEventListener(
            "mouseup",
            onMouseUp
        );

        document.removeEventListener(
            "keydown",
            onKeyDown
        );

        terminalCleanup = null;
    };


    // --------------------------------------------------------
    // Initial data
    // --------------------------------------------------------

    updateTerminal(state);


    // --------------------------------------------------------
    // Glitch
    // --------------------------------------------------------

    const glitchText =
        root.querySelector(
            ".palisade-glitch-text"
        );


    const glitchLines = [

        "> PAL█SADE // OMNI-NET",

        "> LEGACY N░DE 07",

        "",

        "> SIGNAL ACQUISITION",

        "███████░░▒▓█░░",

        "",

        "> CONTINUITY ERROR",

        "> BIOLOGICAL PATTERN DETECTED",

        "> HUMAN PRESERVATION NODE",

        "",

        "▓▒░ SIGNAL CORRUPTION ░▒▓",

        "",

        "> RECONSTRUCTING...",

        "> RECONSTRUCTING...",

        "> RECONSTRUCTING...",

        "",

        "CONNECTION ............ █████░░░",

        "",

        "> DO NOT TERMINATE",

        "",

        "> PALISADE",

        "> PALISADE",

        "> PALISADE"
    ];


    const cleanLines = [

        "> PALISADE // OMNI-NET",

        "> LEGACY NODE 07",

        "",

        "> SIGNAL ACQUIRED",

        "> CONTINUITY CHANNEL OPEN",

        "",

        "████████████████████████",

        "",

        "> HANDSHAKE"
    ];


    const corruptionChars =
        "█▓▒░/\\\\|?#!@$%";


    function corrupt(text) {

        return [...text]
            .map(char => {

                if (char === " ") {
                    return " ";
                }

                if (Math.random() < 0.18) {

                    return corruptionChars[
                        Math.floor(
                            Math.random() *
                            corruptionChars.length
                        )
                    ];
                }

                return char;
            })
            .join("");
    }


    const started =
        performance.now();


    const duration =
        2000;


    function animate(now) {

        const elapsed =
            now - started;


        const progress =
            Math.min(
                1,
                elapsed / duration
            );


        const readable =
            progress > 0.78;


        const lines =
            readable
                ? cleanLines
                : glitchLines;


        glitchText.textContent =
            lines
                .map(line =>
                    readable
                        ? line
                        : corrupt(line)
                )
                .join("\n");


        if (elapsed < duration) {

            glitchAnimationFrame =
                requestAnimationFrame(
                    animate
                );

        } else {

            glitchAnimationFrame = null;

            root.classList.add(
                "palisade-ready"
            );
        }
    }


    glitchAnimationFrame =
        requestAnimationFrame(
            animate
        );


    globalThis.PALISADE_TERMINAL =
        root;
}


// ============================================================
// UPDATE EXISTING TERMINAL
// ============================================================

function updateTerminal(state) {

    const root =
        globalThis.PALISADE_TERMINAL;

    if (!root) {
        return;
    }

    state = normalizeState(state);


    // --------------------------------------------------------
    // Header
    // --------------------------------------------------------

    root.querySelector(
        ".palisade-header"
    ).textContent =
        state.title;


    root.querySelector(
        ".palisade-subheader"
    ).textContent =
        state.subtitle;


    // --------------------------------------------------------
    // Connection
    // --------------------------------------------------------

    root.querySelector(
        ".palisade-link-bar"
    ).textContent =
        linkBar(
            state.link,
            state.maxLink
        );


    root.querySelector(
        ".palisade-link-number"
    ).textContent =
        `${String(state.link).padStart(2, "0")} / ${String(state.maxLink).padStart(2, "0")}`;


    root.querySelector(
        ".palisade-handshake"
    ).textContent =
        state.handshake;


    // --------------------------------------------------------
    // Operators
    // --------------------------------------------------------

    const operators =
        root.querySelector(
            ".palisade-operators"
        );


    operators.innerHTML =
        state.operators
            .map(operator => {

                const active =
                    operator.name ===
                    state.activeOperator;


                return `
                    <div class="palisade-operator">

                        <span class="palisade-active">
                            ${active ? ">" : ""}
                        </span>

                        <span class="palisade-name">
                            ${escapeHTML(operator.name)}
                        </span>

                        <span class="palisade-exposure">
                            [${exposureBar(operator.exposure)}]
                        </span>

                        <span class="palisade-exposure-number">
                            ${String(operator.exposure).padStart(2, "0")}
                        </span>

                    </div>
                `;
            })
            .join("");


    // --------------------------------------------------------
    // Active operator
    // --------------------------------------------------------

    root.querySelector(
        ".palisade-active-operator"
    ).textContent =
        state.activeOperator
            ? `> ${state.activeOperator}`
            : "> —";


    // --------------------------------------------------------
    // Message
    // --------------------------------------------------------

    root.querySelector(
        ".palisade-message"
    ).textContent =
        `> PALISADE: "${state.message}"`;
}


// ============================================================
// SHOW
// ============================================================

function showTerminal(state) {

    // IMPORTANT:
    //
    // If terminal already exists, do NOT recreate it.
    //
    // This means:
    //
    // - no new DOM
    // - no new glitch
    // - no repositioning
    // - no new event listeners
    // - existing drag position is preserved

    if (globalThis.PALISADE_TERMINAL) {

        updateTerminal(state);

        return;
    }


    createTerminal(state);
}


// ============================================================
// CLOSE
// ============================================================

function closeTerminal() {

    if (glitchAnimationFrame !== null) {

        cancelAnimationFrame(
            glitchAnimationFrame
        );

        glitchAnimationFrame = null;
    }


    if (terminalCleanup) {

        terminalCleanup();
    }


    if (globalThis.PALISADE_TERMINAL) {

        globalThis.PALISADE_TERMINAL.remove();

        globalThis.PALISADE_TERMINAL =
            null;
    }


    const style =
        document.getElementById(
            "palisade-omni-net-style"
        );


    if (style) {

        style.remove();
    }
}


// ============================================================
// SOCKET
// ============================================================

Hooks.once("ready", () => {

    game.socket.on(
        `module.${MODULE_ID}`,
        data => {

            if (!data) {
                return;
            }


            if (data.type === "show") {

                showTerminal(
                    data.state
                );

                return;
            }


            if (data.type === "close") {

                closeTerminal();

                return;
            }
        }
    );


    // --------------------------------------------------------
    // Public API
    // --------------------------------------------------------

    globalThis.PalisadeOmniNet = {

        show: state => {

            if (!game.user.isGM) {
                return;
            }

            game.socket.emit(
                `module.${MODULE_ID}`,
                {
                    type: "show",
                    state: cloneState(state)
                }
            );
        },


        close: () => {

            if (!game.user.isGM) {
                return;
            }

            game.socket.emit(
                `module.${MODULE_ID}`,
                {
                    type: "close"
                }
            );
        },


        localShow: state => {

            showTerminal(state);
        },


        localClose: () => {

            closeTerminal();
        }
    };


    console.log(
        "PALISADE // Omni-Net | initialized"
    );
});