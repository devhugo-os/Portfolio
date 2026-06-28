(function () {
  function init(skills) {
    const grid = document.getElementById("memory-grid");
    if (!grid) return;

    const movesEl = document.getElementById("memory-moves");
    const pairsEl = document.getElementById("memory-pairs");
    const statusEl = document.getElementById("memory-status");
    const resetButton = document.getElementById("memory-reset");

    const state = {
      cards: [],
      opened: [],
      matched: 0,
      moves: 0,
      locked: false
    };

    function shuffle(items) {
      const copy = items.slice();
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function setHud() {
      if (movesEl) movesEl.textContent = String(state.moves);
      if (pairsEl) pairsEl.textContent = `${state.matched}/6`;
      if (statusEl) {
        statusEl.textContent = state.matched === 6 ? "Completo" : "Pronto";
      }
    }

    function createDeck() {
      const selected = shuffle(skills).slice(0, 6);
      const pairs = selected.flatMap((skill) => [
        { id: `${skill.name}-a`, pair: skill.name, name: skill.name, icon: skill.icon },
        { id: `${skill.name}-b`, pair: skill.name, name: skill.name, icon: skill.icon }
      ]);
      return shuffle(pairs);
    }

    function render() {
      const cards = state.cards.map((card) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-card";
        button.dataset.id = card.id;
        button.setAttribute("aria-label", `Carta ${card.name}`);

        if (card.open) button.classList.add("is-open");
        if (card.matched) button.classList.add("is-matched");

        const inner = document.createElement("span");
        inner.className = "memory-card-inner";

        const back = document.createElement("span");
        back.className = "memory-face memory-back";
        const backIcon = document.createElement("i");
        backIcon.className = "bi bi-code-slash";
        back.appendChild(backIcon);

        const front = document.createElement("span");
        front.className = "memory-face memory-front";
        const img = document.createElement("img");
        img.src = card.icon;
        img.alt = "";
        img.loading = "lazy";
        front.appendChild(img);

        inner.append(back, front);
        button.appendChild(inner);
        button.addEventListener("click", () => openCard(card.id));
        return button;
      });

      grid.replaceChildren(...cards);
      setHud();
    }

    function openCard(id) {
      if (state.locked || state.opened.length >= 2) return;
      const card = state.cards.find((item) => item.id === id);
      if (!card || card.open || card.matched) return;

      card.open = true;
      state.opened.push(card);
      render();

      if (state.opened.length === 2) {
        state.moves += 1;
        state.locked = true;
        const [first, second] = state.opened;
        if (first.pair === second.pair) {
          first.matched = true;
          second.matched = true;
          state.matched += 1;
          state.opened = [];
          state.locked = false;
          render();
        } else {
          setTimeout(() => {
            first.open = false;
            second.open = false;
            state.opened = [];
            state.locked = false;
            render();
          }, 720);
        }
      }
    }

    function reset() {
      state.cards = createDeck().map((card) => ({
        ...card,
        open: false,
        matched: false
      }));
      state.opened = [];
      state.matched = 0;
      state.moves = 0;
      state.locked = false;
      render();
    }

    if (resetButton) {
      resetButton.addEventListener("click", reset);
    }

    reset();
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.MemoryStack = { init };
})();
