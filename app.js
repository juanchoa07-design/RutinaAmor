(function () {
  "use strict";

  const STORAGE_KEY = "rutinaAmor:v1";
  const TITLE_KEY = "rutinaAmor:title";

  const DAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  const DAY_LABELS = {
    lunes: "Lun", martes: "Mar", miercoles: "Mié", jueves: "Jue",
    viernes: "Vie", sabado: "Sáb", domingo: "Dom"
  };
  const DAY_FULL = {
    lunes: "Lunes", martes: "Martes", miercoles: "Miércoles", jueves: "Jueves",
    viernes: "Viernes", sabado: "Sábado", domingo: "Domingo"
  };

  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function defaultRoutine() {
    // 3 días por semana con máquinas de gimnasio: lunes pierna, miércoles tren superior, viernes full body.
    return {
      lunes: [
        { id: uid(), name: "Prensa de piernas", sets: 4, reps: "12", notes: "Pies al ancho de hombros" },
        { id: uid(), name: "Extensión de cuádriceps", sets: 3, reps: "12", notes: "" },
        { id: uid(), name: "Curl femoral", sets: 3, reps: "12", notes: "Acostada o sentada" },
        { id: uid(), name: "Hip thrust en máquina", sets: 4, reps: "12", notes: "Apretar glúteos arriba" },
        { id: uid(), name: "Abductora", sets: 3, reps: "15", notes: "" },
        { id: uid(), name: "Aductora", sets: 3, reps: "15", notes: "" },
        { id: uid(), name: "Pantorrillas en máquina", sets: 3, reps: "15", notes: "" }
      ],
      martes: [],
      miercoles: [
        { id: uid(), name: "Jalón al pecho", sets: 3, reps: "12", notes: "Polea alta, agarre ancho" },
        { id: uid(), name: "Remo sentado en máquina", sets: 3, reps: "12", notes: "" },
        { id: uid(), name: "Press de pecho en máquina", sets: 3, reps: "12", notes: "" },
        { id: uid(), name: "Press de hombros en máquina", sets: 3, reps: "12", notes: "" },
        { id: uid(), name: "Curl de bíceps en polea", sets: 3, reps: "12", notes: "" },
        { id: uid(), name: "Tríceps en polea", sets: 3, reps: "12", notes: "Con soga o barra" },
        { id: uid(), name: "Abdominales en máquina", sets: 3, reps: "15", notes: "" }
      ],
      jueves: [],
      viernes: [
        { id: uid(), name: "Cinta o elíptica", sets: 1, reps: "10 min", notes: "Entrada en calor" },
        { id: uid(), name: "Sentadilla en Smith", sets: 3, reps: "12", notes: "O prensa si no hay Smith" },
        { id: uid(), name: "Patada de glúteo en polea", sets: 3, reps: "12 por pierna", notes: "" },
        { id: uid(), name: "Jalón al pecho", sets: 3, reps: "12", notes: "" },
        { id: uid(), name: "Press de pecho en máquina", sets: 3, reps: "12", notes: "" },
        { id: uid(), name: "Remo sentado en máquina", sets: 3, reps: "12", notes: "" },
        { id: uid(), name: "Plancha", sets: 3, reps: "30 seg", notes: "" }
      ],
      sabado: [],
      domingo: []
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.routine && parsed.completions) return parsed;
      }
    } catch (e) {}
    return { routine: defaultRoutine(), completions: {} };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = loadState();

  // ---- fechas ----
  function startOfWeek(d) {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7; // lunes = 0
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function dateForDayIndex(idx) {
    const monday = startOfWeek(new Date());
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    return d;
  }

  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function todayIndex() {
    return (new Date().getDay() + 6) % 7;
  }

  let selectedIndex = todayIndex();

  // ---- helpers de estado ----
  function getDayKey(idx) {
    return DAY_ORDER[idx];
  }

  function getDateKey(idx) {
    return isoDate(dateForDayIndex(idx));
  }

  function isExerciseDone(dateKey, exId) {
    return !!(state.completions[dateKey] && state.completions[dateKey][exId]);
  }

  function toggleExercise(dateKey, exId) {
    if (!state.completions[dateKey]) state.completions[dateKey] = {};
    state.completions[dateKey][exId] = !state.completions[dateKey][exId];
    if (!state.completions[dateKey][exId]) delete state.completions[dateKey][exId];
    saveState();
    render();
  }

  function dayCompletion(idx) {
    const dayKey = getDayKey(idx);
    const list = state.routine[dayKey] || [];
    if (list.length === 0) return null; // descanso
    const dateKey = getDateKey(idx);
    const done = list.filter(ex => isExerciseDone(dateKey, ex.id)).length;
    return { done, total: list.length };
  }

  // ---- DOM refs ----
  const dayTabsEl = document.getElementById("dayTabs");
  const dateLabelEl = document.getElementById("dateLabel");
  const exerciseListEl = document.getElementById("exerciseList");
  const progressFillEl = document.getElementById("progressFill");
  const progressTextEl = document.getElementById("progressText");
  const addExerciseBtn = document.getElementById("addExerciseBtn");
  const appTitleEl = document.getElementById("appTitle");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const inputName = document.getElementById("inputName");
  const inputSets = document.getElementById("inputSets");
  const inputReps = document.getElementById("inputReps");
  const inputNotes = document.getElementById("inputNotes");
  const modalCancel = document.getElementById("modalCancel");
  const modalSave = document.getElementById("modalSave");

  let editingExerciseId = null;

  // ---- título editable ----
  const savedTitle = localStorage.getItem(TITLE_KEY);
  if (savedTitle) appTitleEl.textContent = savedTitle;
  appTitleEl.addEventListener("blur", () => {
    const text = appTitleEl.textContent.trim() || "Mi Rutina 💪";
    appTitleEl.textContent = text;
    localStorage.setItem(TITLE_KEY, text);
  });
  appTitleEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); appTitleEl.blur(); }
  });

  // ---- render ----
  function render() {
    renderTabs();
    renderDateLabel();
    renderExercises();
  }

  function renderTabs() {
    dayTabsEl.innerHTML = "";
    const tIdx = todayIndex();
    DAY_ORDER.forEach((dayKey, idx) => {
      const btn = document.createElement("button");
      btn.className = "day-tab" + (idx === selectedIndex ? " selected" : "") + (idx === tIdx ? " today" : "");
      const label = document.createElement("span");
      label.textContent = DAY_LABELS[dayKey];
      btn.appendChild(label);

      const dot = document.createElement("span");
      const comp = dayCompletion(idx);
      dot.className = "day-dot";
      if (comp) {
        if (comp.done === comp.total) dot.classList.add("done");
        else if (comp.done > 0) dot.classList.add("partial");
      }
      btn.appendChild(dot);

      btn.addEventListener("click", () => {
        selectedIndex = idx;
        render();
      });
      dayTabsEl.appendChild(btn);
    });
  }

  function renderDateLabel() {
    const d = dateForDayIndex(selectedIndex);
    const opts = { day: "numeric", month: "long" };
    dateLabelEl.textContent = `${DAY_FULL[getDayKey(selectedIndex)]} ${d.toLocaleDateString("es-ES", opts)}`;
  }

  function renderExercises() {
    const dayKey = getDayKey(selectedIndex);
    const dateKey = getDateKey(selectedIndex);
    const list = state.routine[dayKey] || [];

    exerciseListEl.innerHTML = "";

    if (list.length === 0) {
      const rest = document.createElement("li");
      rest.className = "rest-card";
      rest.textContent = "😴 Día de descanso";
      exerciseListEl.appendChild(rest);
      progressFillEl.style.width = "0%";
      progressTextEl.textContent = "";
      return;
    }

    let doneCount = 0;

    list.forEach(ex => {
      const done = isExerciseDone(dateKey, ex.id);
      if (done) doneCount++;

      const li = document.createElement("li");
      li.className = "exercise-card" + (done ? " done" : "");

      const check = document.createElement("button");
      check.className = "exercise-check" + (done ? " checked" : "");
      check.textContent = done ? "✓" : "";
      check.addEventListener("click", () => toggleExercise(dateKey, ex.id));
      li.appendChild(check);

      const info = document.createElement("div");
      info.className = "exercise-info";

      const name = document.createElement("p");
      name.className = "exercise-name" + (done ? " done" : "");
      name.textContent = ex.name;
      info.appendChild(name);

      const meta = document.createElement("p");
      meta.className = "exercise-meta";
      const parts = [];
      if (ex.sets) parts.push(`${ex.sets} series`);
      if (ex.reps) parts.push(`${ex.reps} reps`);
      meta.textContent = parts.join(" · ");
      info.appendChild(meta);

      if (ex.notes) {
        const notes = document.createElement("p");
        notes.className = "exercise-notes";
        notes.textContent = ex.notes;
        info.appendChild(notes);
      }

      li.appendChild(info);

      const actions = document.createElement("div");
      actions.className = "exercise-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn";
      editBtn.textContent = "✏️";
      editBtn.addEventListener("click", () => openModal(dayKey, ex));
      actions.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.className = "icon-btn";
      delBtn.textContent = "🗑️";
      delBtn.addEventListener("click", () => {
        if (confirm(`¿Eliminar "${ex.name}"?`)) {
          state.routine[dayKey] = state.routine[dayKey].filter(e => e.id !== ex.id);
          saveState();
          render();
        }
      });
      actions.appendChild(delBtn);

      li.appendChild(actions);
      exerciseListEl.appendChild(li);
    });

    const pct = list.length ? Math.round((doneCount / list.length) * 100) : 0;
    progressFillEl.style.width = pct + "%";
    progressTextEl.textContent = `${doneCount}/${list.length}`;
  }

  // ---- modal agregar/editar ----
  function openModal(dayKey, exercise) {
    editingExerciseId = exercise ? exercise.id : null;
    modalTitle.textContent = exercise ? "Editar ejercicio" : "Agregar ejercicio";
    inputName.value = exercise ? exercise.name : "";
    inputSets.value = exercise ? exercise.sets : "";
    inputReps.value = exercise ? exercise.reps : "";
    inputNotes.value = exercise ? exercise.notes : "";
    modalOverlay.classList.add("open");
    modalOverlay.dataset.dayKey = dayKey;
    setTimeout(() => inputName.focus(), 50);
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    editingExerciseId = null;
  }

  addExerciseBtn.addEventListener("click", () => {
    openModal(getDayKey(selectedIndex), null);
  });

  modalCancel.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalSave.addEventListener("click", () => {
    const name = inputName.value.trim();
    if (!name) { inputName.focus(); return; }
    const dayKey = modalOverlay.dataset.dayKey;
    const sets = inputSets.value.trim();
    const reps = inputReps.value.trim();
    const notes = inputNotes.value.trim();

    if (editingExerciseId) {
      const ex = state.routine[dayKey].find(e => e.id === editingExerciseId);
      if (ex) {
        ex.name = name;
        ex.sets = sets;
        ex.reps = reps;
        ex.notes = notes;
      }
    } else {
      if (!state.routine[dayKey]) state.routine[dayKey] = [];
      state.routine[dayKey].push({ id: uid(), name, sets, reps, notes });
    }
    saveState();
    closeModal();
    render();
  });

  render();
})();
