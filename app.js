(function () {
  "use strict";

  const { findMachine, machineSvg } = window.RutinaMachines;

  const STORAGE_KEY = "rutinaAmor:v1";
  const TITLE_KEY = "rutinaAmor:title";
  // Subir este número reemplaza la rutina guardada por la nueva defaultRoutine (los checks y pesos se conservan por id).
  const ROUTINE_VERSION = 7;
  const PROGRAM_WEEKS = 6;
  const TRAINING_DAYS = ["martes", "miercoles", "viernes"];
  const DAY_MS = 24 * 60 * 60 * 1000;

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

  function ex(id, name, sets, reps, notes, warmup) {
    return { id, name, sets, reps, notes: notes || "", warmup: !!warmup };
  }

  function absWarmup(day) {
    return [
      ex(day + "-plancha", "Plancha", 3, "30 seg", "", true),
      ex(day + "-crunch", "Crunch abdominal", 2, "15", "", true),
      ex(day + "-elevacion", "Elevación de piernas", 2, "12", "", true)
    ];
  }

  function defaultRoutine() {
    return {
      lunes: [],
      martes: [
        ...absWarmup("mar"),
        ex("mar-prensa", "Prensa de piernas", 4, "12", "Pies al ancho de hombros"),
        ex("mar-extension", "Extensión de cuádriceps", 3, "12"),
        ex("mar-femoral", "Curl femoral", 3, "12", "Acostada o sentada"),
        ex("mar-hipthrust", "Hip thrust en máquina", 4, "12", "Apretar glúteos arriba"),
        ex("mar-abductora", "Abductora", 3, "15"),
        ex("mar-aductora", "Aductora", 3, "15"),
        ex("mar-pantorrillas", "Pantorrillas en máquina", 3, "15")
      ],
      miercoles: [
        ...absWarmup("mie"),
        ex("mie-jalon", "Jalón al pecho", 3, "12", "Polea alta, agarre ancho"),
        ex("mie-remo", "Remo sentado en máquina", 3, "12"),
        ex("mie-pecho", "Press de pecho en máquina", 3, "12"),
        ex("mie-hombros", "Press de hombros en máquina", 3, "12"),
        ex("mie-biceps", "Curl de bíceps en polea", 3, "12"),
        ex("mie-triceps", "Tríceps en polea", 3, "12", "Con soga o barra"),
        ex("mie-laterales", "Elevaciones laterales", 3, "12", "Con mancuernas")
      ],
      jueves: [],
      viernes: [
        ...absWarmup("vie"),
        ex("vie-smith", "Sentadilla en Smith", 3, "12", "O prensa si no hay Smith"),
        ex("vie-patada", "Patada de glúteo en polea", 3, "12 por pierna"),
        ex("vie-jalon", "Jalón al pecho", 3, "12"),
        ex("vie-remo", "Remo sentado en máquina", 3, "12"),
        ex("vie-martillo", "Curl martillo", 3, "12", "Con mancuernas")
      ],
      sabado: [],
      domingo: []
    };
  }

  // ---- fechas ----
  function mondayOf(d) {
    const date = new Date(d);
    date.setDate(date.getDate() - (date.getDay() + 6) % 7);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function addDays(d, n) {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function parseISO(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function shortDate(d) {
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  }

  // ---- estado ----
  function loadState() {
    let s = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) s = JSON.parse(raw);
    } catch (e) {}
    if (!s || typeof s !== "object") s = {};
    if (!s.completions) s.completions = {};
    if (!s.routine || s.routineVersion !== ROUTINE_VERSION) {
      s.routine = defaultRoutine();
      s.routineVersion = ROUTINE_VERSION;
    }
    if (!s.weights) s.weights = {};
    if (!s.programStart) s.programStart = isoDate(mondayOf(new Date()));
    return s;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  const state = loadState();
  saveState();

  function weekOfDate(d) {
    return Math.round((mondayOf(d) - parseISO(state.programStart)) / (7 * DAY_MS)) + 1;
  }

  function dateFor(week, idx) {
    return addDays(parseISO(state.programStart), (week - 1) * 7 + idx);
  }

  const todayKey = isoDate(new Date());
  const todayIdx = (new Date().getDay() + 6) % 7;
  const thisWeek = weekOfDate(new Date());

  let selectedWeek = Math.min(Math.max(thisWeek, 1), PROGRAM_WEEKS);
  let selectedIndex = selectedWeek === thisWeek ? todayIdx : DAY_ORDER.indexOf(TRAINING_DAYS[0]);

  function isDone(dateKey, exId) {
    return !!(state.completions[dateKey] && state.completions[dateKey][exId]);
  }

  function toggleExercise(dayKey, dateKey, exId) {
    const day = state.completions[dateKey] || (state.completions[dateKey] = {});
    const nowDone = !day[exId];
    if (nowDone) day[exId] = true; else delete day[exId];
    if (Object.keys(day).length === 0) delete state.completions[dateKey];
    saveState();
    render();
    if (nowDone && state.routine[dayKey].every(e => isDone(dateKey, e.id))) celebrate();
  }

  const celebrateEl = document.getElementById("celebrate");
  const heartsEl = document.getElementById("hearts");

  function celebrate() {
    heartsEl.innerHTML = "";
    const emojis = ["❤️", "💕", "💖", "💗", "💜"];
    for (let i = 0; i < 18; i++) {
      const h = document.createElement("span");
      h.textContent = emojis[i % emojis.length];
      h.style.left = Math.random() * 95 + "%";
      h.style.fontSize = 1.2 + Math.random() * 1.6 + "rem";
      h.style.animationDuration = 3 + Math.random() * 3 + "s";
      h.style.animationDelay = Math.random() * 1.5 + "s";
      heartsEl.appendChild(h);
    }
    celebrateEl.classList.add("open");
  }

  document.getElementById("celebrateClose").addEventListener("click", () => celebrateEl.classList.remove("open"));

  function getWeight(dateKey, exId) {
    return (state.weights[dateKey] && state.weights[dateKey][exId]) || "";
  }

  function setWeight(dateKey, exId, value) {
    const v = value.trim();
    if (v) {
      (state.weights[dateKey] || (state.weights[dateKey] = {}))[exId] = v;
    } else if (state.weights[dateKey]) {
      delete state.weights[dateKey][exId];
      if (Object.keys(state.weights[dateKey]).length === 0) delete state.weights[dateKey];
    }
    saveState();
  }

  function sameName(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }

  // Historial por nombre, así "Jalón al pecho" del miércoles y del viernes comparten registro.
  function weightHistory(name) {
    const names = {};
    DAY_ORDER.forEach(d => (state.routine[d] || []).forEach(e => { names[e.id] = e.name; }));
    const out = [];
    Object.keys(state.weights).sort().forEach(date => {
      Object.entries(state.weights[date]).forEach(([id, kg]) => {
        if (names[id] && sameName(names[id], name)) out.push({ date, kg });
      });
    });
    return out;
  }

  function sessionStatus(week, idx) {
    const list = state.routine[DAY_ORDER[idx]] || [];
    if (list.length === 0) return null;
    const dateKey = isoDate(dateFor(week, idx));
    const done = list.filter(e => isDone(dateKey, e.id)).length;
    return { done, total: list.length };
  }

  function statusClass(st) {
    if (!st || st.done === 0) return "";
    return st.done === st.total ? "done" : "partial";
  }

  // ---- DOM ----
  const $ = id => document.getElementById(id);
  const appTitleEl = $("appTitle");
  const weekLabelEl = $("weekLabel");
  const weekRangeEl = $("weekRange");
  const prevWeekBtn = $("prevWeek");
  const nextWeekBtn = $("nextWeek");
  const programGridEl = $("programGrid");
  const programTextEl = $("programText");
  const dayTabsEl = $("dayTabs");
  const dateLabelEl = $("dateLabel");
  const progressWrapEl = $("progressWrap");
  const progressFillEl = $("progressFill");
  const progressTextEl = $("progressText");
  const exerciseListEl = $("exerciseList");
  const addExerciseBtn = $("addExerciseBtn");

  const modalOverlay = $("modalOverlay");
  const modalTitle = $("modalTitle");
  const inputName = $("inputName");
  const inputSets = $("inputSets");
  const inputReps = $("inputReps");
  const inputNotes = $("inputNotes");

  const detailOverlay = $("detailOverlay");
  const detailArt = $("detailArt");
  const detailName = $("detailName");
  const detailMeta = $("detailMeta");
  const detailTip = $("detailTip");
  const detailNotes = $("detailNotes");
  const detailHistory = $("detailHistory");

  let editing = null;   // { dayKey, id|null }
  let detailing = null; // { dayKey, ex }

  // ---- título editable ----
  const savedTitle = localStorage.getItem(TITLE_KEY);
  if (savedTitle) appTitleEl.textContent = savedTitle;
  appTitleEl.addEventListener("blur", () => {
    const text = appTitleEl.textContent.trim() || "Mi Rutina 💪";
    appTitleEl.textContent = text;
    localStorage.setItem(TITLE_KEY, text);
  });
  appTitleEl.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); appTitleEl.blur(); }
  });

  // ---- render ----
  function render() {
    renderWeekNav();
    renderProgram();
    renderTabs();
    renderDay();
  }

  function renderWeekNav() {
    weekLabelEl.textContent = `Semana ${selectedWeek} de ${PROGRAM_WEEKS}`;
    weekRangeEl.textContent = `${shortDate(dateFor(selectedWeek, 0))} – ${shortDate(dateFor(selectedWeek, 6))}`;
    prevWeekBtn.disabled = selectedWeek <= 1;
    nextWeekBtn.disabled = selectedWeek >= PROGRAM_WEEKS;
  }

  function renderProgram() {
    programGridEl.innerHTML = "";
    let completed = 0;
    let total = 0;
    for (let w = 1; w <= PROGRAM_WEEKS; w++) {
      const col = document.createElement("button");
      col.className = "program-week" + (w === selectedWeek ? " selected" : "") + (w === thisWeek ? " current" : "");
      col.setAttribute("aria-label", `Semana ${w}`);
      const label = document.createElement("span");
      label.className = "program-week-label";
      label.textContent = "S" + w;
      col.appendChild(label);
      const dots = document.createElement("span");
      dots.className = "program-dots";
      DAY_ORDER.forEach((_, idx) => {
        const st = sessionStatus(w, idx);
        if (!st) return;
        total++;
        if (st.done === st.total) completed++;
        const dot = document.createElement("span");
        dot.className = "day-dot " + statusClass(st);
        dots.appendChild(dot);
      });
      col.appendChild(dots);
      col.addEventListener("click", () => selectWeek(w));
      programGridEl.appendChild(col);
    }
    programTextEl.textContent = `${completed} de ${total} entrenamientos completos`;
  }

  function renderTabs() {
    dayTabsEl.innerHTML = "";
    DAY_ORDER.forEach((dayKey, idx) => {
      const d = dateFor(selectedWeek, idx);
      const btn = document.createElement("button");
      btn.className = "day-tab" + (idx === selectedIndex ? " selected" : "") + (isoDate(d) === todayKey ? " today" : "");
      const label = document.createElement("span");
      label.textContent = DAY_LABELS[dayKey];
      btn.appendChild(label);
      const num = document.createElement("span");
      num.className = "day-num";
      num.textContent = d.getDate();
      btn.appendChild(num);
      const dot = document.createElement("span");
      dot.className = "day-dot " + statusClass(sessionStatus(selectedWeek, idx));
      btn.appendChild(dot);
      btn.addEventListener("click", () => { selectedIndex = idx; render(); });
      dayTabsEl.appendChild(btn);
    });
  }

  function renderDay() {
    const dayKey = DAY_ORDER[selectedIndex];
    const d = dateFor(selectedWeek, selectedIndex);
    const dateKey = isoDate(d);
    const list = state.routine[dayKey] || [];

    dateLabelEl.textContent = `${DAY_FULL[dayKey]} ${d.toLocaleDateString("es-ES", { day: "numeric", month: "long" })}`;
    exerciseListEl.innerHTML = "";
    addExerciseBtn.hidden = !TRAINING_DAYS.includes(dayKey);

    if (list.length === 0) {
      progressWrapEl.hidden = true;
      const rest = document.createElement("li");
      rest.className = "rest-card";
      rest.textContent = "😴 Día de descanso";
      exerciseListEl.appendChild(rest);
      return;
    }
    progressWrapEl.hidden = false;

    let doneCount = 0;
    let lastSection = null;
    list.forEach(e => {
      const section = e.warmup ? "Calentamiento" : "Rutina";
      if (section !== lastSection) {
        const h = document.createElement("li");
        h.className = "section-title";
        h.textContent = section;
        exerciseListEl.appendChild(h);
        lastSection = section;
      }
      const done = isDone(dateKey, e.id);
      if (done) doneCount++;
      exerciseListEl.appendChild(exerciseCard(dayKey, dateKey, e, done));
    });

    progressFillEl.style.width = Math.round((doneCount / list.length) * 100) + "%";
    progressTextEl.textContent = `${doneCount}/${list.length}`;
  }

  function exerciseCard(dayKey, dateKey, e, done) {
    const machine = findMachine(e.name);
    const li = document.createElement("li");
    li.className = "exercise-card" + (done ? " done" : "");

    const check = document.createElement("button");
    check.className = "exercise-check" + (done ? " checked" : "");
    check.textContent = done ? "✓" : "";
    check.setAttribute("aria-label", done ? "Desmarcar" : "Marcar como hecho");
    check.addEventListener("click", () => toggleExercise(dayKey, dateKey, e.id));
    li.appendChild(check);

    const thumb = document.createElement("button");
    thumb.className = "exercise-thumb";
    thumb.innerHTML = machineSvg(machine);
    thumb.setAttribute("aria-label", "Ver cómo se hace");
    thumb.addEventListener("click", () => openDetail(dayKey, e));
    li.appendChild(thumb);

    const info = document.createElement("div");
    info.className = "exercise-info";

    const name = document.createElement("button");
    name.className = "exercise-name";
    name.textContent = e.name;
    name.addEventListener("click", () => openDetail(dayKey, e));
    info.appendChild(name);

    const meta = document.createElement("p");
    meta.className = "exercise-meta";
    meta.textContent = metaText(e);
    info.appendChild(meta);

    if (e.notes) {
      const notes = document.createElement("p");
      notes.className = "exercise-notes";
      notes.textContent = e.notes;
      info.appendChild(notes);
    }

    if (!machine.bodyweight) info.appendChild(weightRow(dateKey, e));

    li.appendChild(info);
    return li;
  }

  function metaText(e) {
    const parts = [];
    if (e.sets) parts.push(`${e.sets} series`);
    if (e.reps) parts.push(/^\d+$/.test(String(e.reps).trim()) ? `${e.reps} reps` : e.reps);
    return parts.join(" · ");
  }

  function weightRow(dateKey, e) {
    const row = document.createElement("div");
    row.className = "weight-row";

    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";
    input.className = "weight-input";
    input.placeholder = "Peso";
    input.value = getWeight(dateKey, e.id);
    input.addEventListener("input", () => setWeight(dateKey, e.id, input.value));
    input.addEventListener("change", () => renderProgram());
    row.appendChild(input);

    const unit = document.createElement("span");
    unit.className = "weight-unit";
    unit.textContent = "kg";
    row.appendChild(unit);

    const prev = weightHistory(e.name).filter(h => h.date < dateKey).pop();
    if (prev) {
      const hint = document.createElement("span");
      hint.className = "weight-prev";
      hint.textContent = `Anterior: ${prev.kg} kg`;
      row.appendChild(hint);
    }
    return row;
  }

  function selectWeek(w) {
    selectedWeek = w;
    render();
  }

  prevWeekBtn.addEventListener("click", () => selectWeek(selectedWeek - 1));
  nextWeekBtn.addEventListener("click", () => selectWeek(selectedWeek + 1));

  // ---- detalle ----
  function openDetail(dayKey, e) {
    detailing = { dayKey, ex: e };
    const machine = findMachine(e.name);
    detailArt.innerHTML = machineSvg(machine);
    detailName.textContent = e.name;
    detailMeta.textContent = metaText(e);
    detailTip.textContent = machine.tip;
    detailTip.hidden = !machine.tip;
    detailNotes.textContent = e.notes;
    detailNotes.hidden = !e.notes;

    detailHistory.innerHTML = "";
    const history = machine.bodyweight ? [] : weightHistory(e.name);
    if (history.length) {
      const title = document.createElement("p");
      title.className = "history-title";
      title.textContent = "Pesos anotados";
      detailHistory.appendChild(title);
      history.slice(-8).reverse().forEach(h => {
        const row = document.createElement("div");
        row.className = "history-row";
        const dt = document.createElement("span");
        dt.textContent = parseISO(h.date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
        const kg = document.createElement("strong");
        kg.textContent = `${h.kg} kg`;
        row.append(dt, kg);
        detailHistory.appendChild(row);
      });
    }
    detailOverlay.classList.add("open");
  }

  function closeDetail() {
    detailOverlay.classList.remove("open");
    detailing = null;
  }

  $("detailClose").addEventListener("click", closeDetail);
  detailOverlay.addEventListener("click", e => { if (e.target === detailOverlay) closeDetail(); });

  $("detailEdit").addEventListener("click", () => {
    const { dayKey, ex: e } = detailing;
    closeDetail();
    openModal(dayKey, e);
  });

  $("detailDelete").addEventListener("click", () => {
    const { dayKey, ex: e } = detailing;
    if (!confirm(`¿Eliminar "${e.name}"?`)) return;
    state.routine[dayKey] = state.routine[dayKey].filter(x => x.id !== e.id);
    saveState();
    closeDetail();
    render();
  });

  // ---- modal agregar/editar ----
  function openModal(dayKey, e) {
    editing = { dayKey, id: e ? e.id : null };
    modalTitle.textContent = e ? "Editar ejercicio" : "Agregar ejercicio";
    inputName.value = e ? e.name : "";
    inputSets.value = e ? e.sets : "";
    inputReps.value = e ? e.reps : "";
    inputNotes.value = e ? e.notes : "";
    modalOverlay.classList.add("open");
    setTimeout(() => inputName.focus(), 50);
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    editing = null;
  }

  addExerciseBtn.addEventListener("click", () => openModal(DAY_ORDER[selectedIndex], null));
  $("modalCancel").addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });

  $("modalSave").addEventListener("click", () => {
    const name = inputName.value.trim();
    if (!name) { inputName.focus(); return; }
    const fields = {
      name,
      sets: inputSets.value.trim(),
      reps: inputReps.value.trim(),
      notes: inputNotes.value.trim()
    };
    const list = state.routine[editing.dayKey] || (state.routine[editing.dayKey] = []);
    if (editing.id) {
      Object.assign(list.find(x => x.id === editing.id), fields);
    } else {
      list.push({ id: uid(), warmup: false, ...fields });
    }
    saveState();
    closeModal();
    render();
  });

  render();

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
})();
