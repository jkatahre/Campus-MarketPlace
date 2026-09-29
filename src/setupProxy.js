// Runs inside the CRA dev server (Node), not in the browser. CRA loads this file automatically.
// Pollinations.ai is a free text AI that needs no API key, but it blocks direct browser
// requests, so the form calls this endpoint and it forwards the request.
const express = require("express");

const SYSTEM_PROMPT =
    "You write listings for a campus marketplace where students sell used items to other students. " +
    "Write a friendly, honest description of 2-3 short sentences (under 60 words). " +
    "Don't invent specific details like condition, age, or accessories that weren't given. " +
    "Reply with only the description text, no title or quotes.";

module.exports = function (app) {
    app.post("/api/generate-description", express.json(), async (req, res) => {
        const itemName = String(req.body?.itemName || "").trim().slice(0, 100);
        const category = String(req.body?.category || "").trim().slice(0, 100);

        if (!itemName || !category) {
            return res.status(400).json({ error: "Item name and category are required." });
        }

        const prompt = encodeURIComponent(`Item name: ${itemName}\nCategory: ${category}`);
        const url = `https://text.pollinations.ai/${prompt}?system=${encodeURIComponent(SYSTEM_PROMPT)}`;

        // The free service occasionally stalls, so give it a second attempt.
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
                if (!response.ok) {
                    throw new Error(`Pollinations returned ${response.status}`);
                }

                const description = (await response.text()).replace(/\s+/g, " ").trim();
                if (!description) {
                    throw new Error("Pollinations returned an empty description");
                }

                return res.json({ description });
            } catch (error) {
                console.error(`Description generation attempt ${attempt} failed:`, error.message);
                if (attempt === 1) {
                    // Free tier is rate limited; wait a moment before retrying.
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }
        }

        res.status(502).json({ error: "AI description generation failed. Try again in a moment." });
    });
};
