import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#f46f56" />
    <title>A little win</title>
    <style>
      :root {
        --canvas: #fff7e8;
        --paper: #fffdf8;
        --ink: #272322;
        --muted: #655e59;
        --coral: #f46f56;
        --coral-dark: #c84c39;
        --periwinkle: #8e9def;
        --sun: #f7c84b;
        --mint: #81c8b3;
        --line: rgba(39, 35, 34, 0.15);
        --shadow: 0 22px 55px rgba(91, 61, 38, 0.16);
        --radius-card: 28px;
        --radius-control: 999px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        min-height: 100vh;
        margin: 0;
        overflow-x: hidden;
        color: var(--ink);
        background:
          radial-gradient(circle at 8% 9%, rgba(247, 200, 75, 0.42) 0 7%, transparent 7.1%),
          radial-gradient(circle at 91% 88%, rgba(142, 157, 239, 0.3) 0 10%, transparent 10.1%),
          var(--canvas);
        font-family: Georgia, "Times New Roman", serif;
      }

      .page {
        display: grid;
        min-height: 100vh;
        place-items: center;
        padding: 24px;
      }

      .celebration-card {
        position: relative;
        width: min(100%, 680px);
        padding: clamp(36px, 7vw, 72px);
        overflow: hidden;
        text-align: center;
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: var(--radius-card);
        box-shadow: var(--shadow);
      }

      .celebration-card::before,
      .celebration-card::after {
        position: absolute;
        width: 134px;
        height: 134px;
        content: "";
        border: 2px dashed rgba(244, 111, 86, 0.45);
        border-radius: 50%;
        pointer-events: none;
      }

      .celebration-card::before {
        top: -77px;
        left: -60px;
      }

      .celebration-card::after {
        right: -82px;
        bottom: -86px;
        border-color: rgba(142, 157, 239, 0.5);
      }

      .eyebrow {
        display: inline-block;
        margin: 0 0 18px;
        color: var(--coral-dark);
        font-family: Arial, sans-serif;
        font-size: 0.74rem;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      h1 {
        max-width: 560px;
        margin: 0 auto;
        font-size: clamp(3rem, 9vw, 6.5rem);
        font-weight: 700;
        letter-spacing: -0.07em;
        line-height: 0.83;
      }

      .stamp {
        display: inline-block;
        margin-top: 18px;
        padding: 8px 14px 6px;
        color: var(--paper);
        background: var(--coral);
        border-radius: 5px;
        box-shadow: 4px 4px 0 var(--sun);
        font-family: Arial, sans-serif;
        font-size: clamp(1rem, 2vw, 1.35rem);
        font-weight: 900;
        letter-spacing: 0.12em;
        line-height: 1;
        transform: rotate(-3deg);
      }

      .message {
        max-width: 430px;
        margin: 28px auto 0;
        color: var(--muted);
        font-family: Arial, sans-serif;
        font-size: clamp(1rem, 2vw, 1.12rem);
        line-height: 1.65;
      }

      .celebrate-button {
        position: relative;
        z-index: 1;
        min-width: min(100%, 250px);
        margin-top: 34px;
        padding: 17px 27px;
        cursor: pointer;
        color: var(--paper);
        background: var(--ink);
        border: 0;
        border-radius: var(--radius-control);
        box-shadow: 0 6px 0 #12100f;
        font-family: Arial, sans-serif;
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: 0.01em;
        transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
      }

      .celebrate-button:hover {
        background: var(--coral-dark);
        transform: translateY(-2px);
        box-shadow: 0 8px 0 #963124;
      }

      .celebrate-button:active {
        transform: translateY(4px);
        box-shadow: 0 2px 0 #963124;
      }

      .celebrate-button:focus-visible {
        outline: 4px solid var(--periwinkle);
        outline-offset: 5px;
      }

      .status {
        min-height: 1.5em;
        margin: 22px 0 0;
        color: var(--coral-dark);
        font-family: Arial, sans-serif;
        font-size: 0.92rem;
        font-weight: 700;
      }

      .confetti {
        position: fixed;
        z-index: 10;
        width: var(--size);
        height: calc(var(--size) * 0.52);
        pointer-events: none;
        background: var(--color);
        border-radius: 2px;
        transform: translate(-50%, -50%) rotate(var(--rotation));
        animation: confetti-fall 1000ms cubic-bezier(0.19, 0.82, 0.34, 1) forwards;
      }

      @keyframes confetti-fall {
        to {
          opacity: 0;
          transform: translate(calc(-50% + var(--drift)), calc(-50% + var(--drop))) rotate(calc(var(--rotation) + 540deg));
        }
      }

      @media (max-width: 480px) {
        .page {
          padding: 16px;
        }

        .celebration-card {
          padding: 42px 24px;
        }

        .celebrate-button {
          width: 100%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="celebration-card" aria-labelledby="page-title">
        <p class="eyebrow">A small moment, all yours</p>
        <h1 id="page-title">You did it.</h1>
        <div class="stamp" aria-hidden="true">CELEBRATE</div>
        <p class="message">
          Pause for the win. You showed up, made progress, and that deserves a little sparkle.
        </p>
        <button class="celebrate-button" type="button" id="celebrate-button">
          Make it rain confetti
        </button>
        <p class="status" id="celebration-status" aria-live="polite"></p>
      </section>
    </main>
    <script>
      const button = document.getElementById("celebrate-button");
      const status = document.getElementById("celebration-status");
      const colors = ["#f46f56", "#8e9def", "#f7c84b", "#81c8b3", "#f2a5a0"];
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      function launchConfetti() {
        status.textContent = "A little joy for your big moment.";

        if (reducedMotion.matches) {
          return;
        }

        const origin = button.getBoundingClientRect();
        const centerX = origin.left + origin.width / 2;
        const centerY = origin.top + origin.height / 2;

        for (let index = 0; index < 64; index += 1) {
          const piece = document.createElement("span");
          const angle = Math.random() * Math.PI * 2;
          const distance = 120 + Math.random() * 270;
          const size = 7 + Math.random() * 7;

          piece.className = "confetti";
          piece.style.left = centerX + "px";
          piece.style.top = centerY + "px";
          piece.style.setProperty("--color", colors[index % colors.length]);
          piece.style.setProperty("--size", size + "px");
          piece.style.setProperty("--rotation", Math.round(Math.random() * 360) + "deg");
          piece.style.setProperty("--drift", Math.round(Math.cos(angle) * distance) + "px");
          piece.style.setProperty("--drop", Math.round(190 + Math.sin(angle) * distance) + "px");
          piece.addEventListener("animationend", () => piece.remove(), { once: true });
          document.body.append(piece);
        }
      }

      button.addEventListener("click", launchConfetti);
    </script>
  </body>
</html>`);
});

app.get("/user-vault/health", (req, res) => {
  res.json({
    project1: true,
    app1: true,
    success: true,
  });
});

app.get("/user-vault/user/:id", (req, res) => {
  res.json({
    id: req.params.id,
    name: "John Doe",
    role: "QA Engineer",
  });
});

app.use(express.json());

app.post("/user-vault/user", (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({
      success: false,
      message: "name and role are required",
    });
  }

  res.status(201).json({
    success: true,
    user: {
      id: 1,
      name,
      role,
    },
  });
});

const port = Number.parseInt(process.env.PORT ?? "8080", 10);
export const server = app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port ${port}`);
});

export default app;
