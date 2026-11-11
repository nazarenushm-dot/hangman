(() => {
  const MAX_MISSES = 7;
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const $ = (id) => document.getElementById(id);
  const els = {
    herbie: $("herbie"), misses: $("misses"), word: $("word"), keyboard: $("keyboard"),
    hintBtn: $("hint-btn"), hintText: $("hint-text"),
    result: $("result"), resultTitle: $("result-title"), resultBody: $("result-body"), nextBtn: $("next-btn"),
    modal: $("modal"), triviaQ: $("trivia-q"), triviaOptions: $("trivia-options"),
    triviaFeedback: $("trivia-feedback"), triviaCancel: $("trivia-cancel"), triviaClose: $("trivia-close"),
    wins: $("stat-wins"), streak: $("stat-streak"), best: $("stat-best"),
  };

  // ---------- storage (safe) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem("herbie-" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("herbie-" + k, JSON.stringify(v)); } catch {} },
  };
  const stats = store.get("stats", { wins: 0, streak: 0, best: 0 });

  // ---------- helpers ----------
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Shuffle-bag so words don't repeat until all have been played.
  function drawFromBag(key, size) {
    let bag = store.get(key, []);
    if (!Array.isArray(bag) || bag.length === 0 || bag.some((i) => i >= size)) bag = shuffle([...Array(size).keys()]);
    const idx = bag.pop();
    store.set(key, bag);
    return idx;
  }

  // ---------- state ----------
  let state;

  function newRound() {
    const entry = WORDS[drawFromBag("word-bag", WORDS.length)];
    state = {
      entry,
      answer: entry.word.toUpperCase(),
      guessed: new Set(),
      misses: 0,
      hintUsed: false,
      over: false,
    };
    els.herbie.classList.remove("cheer", "sad");
    els.hintBtn.disabled = false;
    els.hintText.textContent = "";
    els.hintText.className = "hint-text";
    els.result.hidden = true;
    buildKeyboard();
    render();
  }

  function lettersInAnswer() { return new Set(state.answer.replace(/[^A-Z]/g, "").split("")); }

  function isSolved() { return [...lettersInAnswer()].every((l) => state.guessed.has(l)); }

  // ---------- rendering ----------
  function render() {
    // Word tiles
    els.word.innerHTML = "";
    state.answer.split(" ").forEach((w) => {
      const group = document.createElement("div");
      group.className = "word-group";
      w.split("").forEach((ch) => {
        const tile = document.createElement("div");
        tile.className = "tile";
        const isLetter = /[A-Z]/.test(ch);
        if (!isLetter) tile.textContent = ch;
        else if (state.guessed.has(ch)) tile.textContent = ch;
        else if (state.over) { tile.textContent = ch; tile.classList.add("missed"); }
        group.appendChild(tile);
      });
      els.word.appendChild(group);
    });
    els.word.setAttribute("aria-label", "Word: " + state.answer.split("").map((c) => (/[A-Z]/.test(c) && !state.guessed.has(c) && !state.over ? "blank" : c)).join(" "));

    // Herbie parts
    els.herbie.querySelectorAll(".part").forEach((p) => {
      const step = Number(p.dataset.step);
      // Herbie starts whole; each miss removes a piece (legs first, head last).
      p.classList.toggle("on", step <= MAX_MISSES - state.misses || (state.over && state.won));
    });

    const left = MAX_MISSES - state.misses;
    els.misses.textContent = state.over ? "" : `${left} ${left === 1 ? "miss" : "misses"} left`;

    els.wins.textContent = stats.wins;
    els.streak.textContent = stats.streak;
    els.best.textContent = stats.best;
  }

  function buildKeyboard() {
    els.keyboard.innerHTML = "";
    ALPHABET.forEach((l) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "key";
      b.textContent = l;
      b.dataset.letter = l;
      b.addEventListener("click", () => guess(l));
      els.keyboard.appendChild(b);
    });
  }

  // ---------- gameplay ----------
  function guess(letter) {
    if (state.over || state.guessed.has(letter) || !els.modal.hidden) return;
    state.guessed.add(letter);
    const key = els.keyboard.querySelector(`[data-letter="${letter}"]`);
    key.disabled = true;
    if (lettersInAnswer().has(letter)) {
      key.classList.add("hit");
    } else {
      key.classList.add("miss");
      state.misses++;
    }
    checkEnd();
    render();
  }

  function addMiss() {
    state.misses++;
    checkEnd();
    render();
  }

  function checkEnd() {
    if (isSolved()) finish(true);
    else if (state.misses >= MAX_MISSES) finish(false);
  }

  function finish(won) {
    state.over = true;
    state.won = won;
    els.hintBtn.disabled = true;
    els.keyboard.querySelectorAll(".key").forEach((k) => (k.disabled = true));

    if (won) {
      stats.wins++; stats.streak++; stats.best = Math.max(stats.best, stats.streak);
      els.herbie.classList.add("cheer");
      els.resultTitle.textContent = state.misses === 0 ? "Flawless. Go Big Red!" : "You got it!";
    } else {
      stats.streak = 0;
      els.herbie.classList.add("sad");
      els.resultTitle.textContent = "Herbie's gone! Better luck next time.";
    }
    store.set("stats", stats);

    els.resultBody.innerHTML = "";
    const cat = document.createElement("strong");
    cat.textContent = `${state.entry.category}: `;
    els.resultBody.append("The answer was ", Object.assign(document.createElement("strong"), { textContent: state.entry.word }), `. `);
    els.resultBody.append(cat, state.entry.clue);
    els.result.hidden = false;
    els.nextBtn.focus();
  }

  // ---------- hint / trivia ----------
  function pickTrivia() {
    // Skip questions that would give away the current answer.
    const words = state.answer.split(/\s+/).filter((w) => w.length >= 3 && !["THE", "AND"].includes(w));
    const safe = TRIVIA.map((t, i) => i).filter((i) => {
      const text = (TRIVIA[i].q + " " + TRIVIA[i].a.join(" ")).toUpperCase();
      return !words.some((w) => text.includes(w));
    });
    const pool = safe.length ? safe : TRIVIA.map((t, i) => i);
    let bag = store.get("trivia-bag", []).filter((i) => pool.includes(i));
    if (bag.length === 0) bag = shuffle(pool);
    const idx = bag.pop();
    const fullBag = store.get("trivia-bag", []).filter((i) => i !== idx);
    store.set("trivia-bag", fullBag.length ? fullBag : bag);
    return TRIVIA[idx];
  }

  function openTrivia() {
    if (state.over || state.hintUsed) return;
    const t = pickTrivia();
    const correct = t.a[0];
    els.triviaQ.textContent = t.q;
    els.triviaFeedback.textContent = "";
    els.triviaOptions.innerHTML = "";
    els.triviaCancel.hidden = false;
    els.triviaClose.hidden = true;

    shuffle(t.a).forEach((ans) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.textContent = ans;
      b.addEventListener("click", () => answerTrivia(b, ans === correct, correct));
      els.triviaOptions.appendChild(b);
    });
    els.modal.hidden = false;
    els.triviaOptions.querySelector("button").focus();
  }

  function answerTrivia(btn, isRight, correct) {
    state.hintUsed = true;
    els.hintBtn.disabled = true;
    els.triviaCancel.hidden = true;
    els.triviaClose.hidden = false;
    els.triviaOptions.querySelectorAll(".option").forEach((o) => {
      o.disabled = true;
      if (o.textContent === correct) o.classList.add("correct");
    });

    if (isRight) {
      els.triviaFeedback.textContent = "Correct! Your hint is waiting.";
      els.hintText.className = "hint-text good";
      els.hintText.innerHTML = "<strong>Hint</strong>";
      els.hintText.append(state.entry.clue);
    } else {
      btn.classList.add("wrong");
      els.triviaFeedback.textContent = "Not quite. That one costs you a miss.";
      els.hintText.textContent = "No hint this round. You missed the trivia question.";
      addMiss();
    }
    els.triviaClose.focus();
  }

  function closeTrivia() { els.modal.hidden = true; els.hintBtn.blur(); }

  // ---------- events ----------
  els.hintBtn.addEventListener("click", openTrivia);
  els.triviaCancel.addEventListener("click", closeTrivia);
  els.triviaClose.addEventListener("click", closeTrivia);
  els.nextBtn.addEventListener("click", newRound);

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!els.modal.hidden) {
      if (e.key === "Escape" && !els.triviaCancel.hidden) closeTrivia();
      return;
    }
    if (state.over && e.key === "Enter") { e.preventDefault(); newRound(); return; }
    const l = e.key.toUpperCase();
    if (/^[A-Z]$/.test(l)) guess(l);
  });

  $("today").textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  newRound();
})();
