const path = require("path");
const express = require("express");
const { sendToSupport } = require("./support");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  express.static(path.join(__dirname, "..", "public"), {
    extensions: ["html"],
  }),
);

app.post("/contact", (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const message = (req.body.message || "").trim();

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({
        ok: false,
        error: "Please fill in your name, email and message.",
      });
  }

  if (req.body.website !== undefined && req.body.website !== "") {
    return res.json({ ok: true });
  }

  const elapsed = req.body.formElapsedMs;

  if (typeof elapsed !== "number" || !Number.isFinite(elapsed) || elapsed < 0) {
    return res.status(400).json({ ok: false, error: "Invalid form timing." });
  }

  if (elapsed < 3000) {
    return res.json({ ok: true });
  }

  sendToSupport({ name, email, message });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Calico Media site running at http://localhost:${PORT}`);
});
