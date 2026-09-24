(function () {
  "use strict";

  // Clases: m = estructura, mf = acolchado, w = pesas, c = cable, p = persona, ph = cabeza, f = piso.
  function tower(x) {
    return `<rect class="m" x="${x}" y="8" width="18" height="76" rx="2"/>` +
      `<rect class="w" x="${x + 3}" y="58" width="12" height="6"/>` +
      `<rect class="w" x="${x + 3}" y="65" width="12" height="6"/>` +
      `<rect class="w" x="${x + 3}" y="72" width="12" height="6"/>`;
  }

  const MACHINES = {
    prensa: {
      tip: "Espalda bien apoyada. Bajá la plataforma hasta que las rodillas queden cerca de 90° y empujá con los talones, sin trabar las rodillas al estirar.",
      art: `
        <path class="m" d="M14 84 L14 76 L106 76 L106 84"/>
        <path class="m" d="M40 76 L100 16"/>
        <circle class="w" cx="94" cy="22" r="7"/>
        <path class="m mt" d="M75 25 L91 41"/>
        <line class="m" x1="40" y1="70" x2="40" y2="76"/>
        <path class="mf" d="M17 47 L23 44 L35 67 L50 67 L50 72 L31 72 Z"/>
        <path class="p" d="M25 54 L38 66"/>
        <path class="p" d="M22 49 L34 65 L52 40 L81 31"/>
        <circle class="ph" cx="19" cy="41" r="5"/>`
    },
    extension: {
      tip: "Sentada con la espalda apoyada y el rodillo sobre los tobillos. Estirá las piernas hasta arriba, apretá 1 segundo y bajá lento.",
      art: `
        ${tower(6)}
        <path class="c" d="M15 8 L15 4 L70 4 L70 56"/>
        <path class="mf" d="M34 22 L40 22 L43 56 L37 56 Z"/>
        <rect class="mf" x="38" y="56" width="32" height="5" rx="2"/>
        <line class="m" x1="54" y1="61" x2="54" y2="84"/>
        <line class="m" x1="70" y1="58" x2="92" y2="67"/>
        <circle class="mf" cx="93" cy="68" r="4"/>
        <path class="p" d="M44 33 L52 52"/>
        <path class="p" d="M43 27 L46 54 L70 54 L91 62"/>
        <circle class="ph" cx="42" cy="20" r="5"/>`
    },
    femoral: {
      tip: "Acostada boca abajo con el rodillo detrás de los tobillos. Llevá los talones hacia la cola y bajá despacio sin despegar la cadera.",
      art: `
        ${tower(98)}
        <rect class="mf" x="16" y="52" width="66" height="6" rx="2"/>
        <line class="m" x1="26" y1="58" x2="26" y2="84"/>
        <line class="m" x1="72" y1="58" x2="72" y2="84"/>
        <line class="m" x1="86" y1="56" x2="86" y2="30"/>
        <circle class="mf" cx="86" cy="27" r="4"/>
        <path class="c" d="M88 27 L98 20"/>
        <path class="p" d="M26 48 L20 58"/>
        <path class="p" d="M24 48 L60 48 L82 48 L90 26"/>
        <circle class="ph" cx="17" cy="45" r="5"/>`
    },
    hipthrust: {
      tip: "Parte alta de la espalda apoyada y el rodillo sobre la cadera. Subí la cadera apretando glúteos hasta quedar recta, y bajá controlado.",
      art: `
        <rect class="mf" x="14" y="46" width="22" height="8" rx="3"/>
        <line class="m" x1="18" y1="54" x2="18" y2="84"/>
        <line class="m" x1="32" y1="54" x2="32" y2="84"/>
        <line class="m" x1="102" y1="84" x2="102" y2="30"/>
        <line class="m" x1="102" y1="30" x2="60" y2="37"/>
        <circle class="w" cx="102" cy="30" r="8"/>
        <path class="p" d="M28 44 L58 42 L80 44 L84 82"/>
        <rect class="mf" x="50" y="33" width="18" height="6" rx="3"/>
        <circle class="ph" cx="19" cy="40" r="5"/>`
    },
    abductora: {
      tip: "Rodillos del lado de afuera de las rodillas. Abrí las piernas hacia afuera, aguantá 1 segundo y cerrá lento sin que choquen las pesas.",
      art: `
        <rect class="mf" x="44" y="12" width="32" height="38" rx="4"/>
        <rect class="mf" x="40" y="50" width="40" height="6" rx="2"/>
        <line class="m" x1="60" y1="56" x2="60" y2="84"/>
        <path class="m" d="M26 80 L40 80 M80 80 L94 80"/>
        <rect class="mf" x="26" y="52" width="6" height="16" rx="2"/>
        <rect class="mf" x="88" y="52" width="6" height="16" rx="2"/>
        <path class="p" d="M46 48 L60 32 L74 48"/>
        <path class="p" d="M60 28 L60 50"/>
        <path class="p" d="M56 52 L36 60 L32 80 M64 52 L84 60 L88 80"/>
        <circle class="ph" cx="60" cy="22" r="5"/>`
    },
    aductora: {
      tip: "Rodillos del lado de adentro de las rodillas. Cerrá las piernas apretando, aguantá 1 segundo y abrí despacio.",
      art: `
        <rect class="mf" x="44" y="12" width="32" height="38" rx="4"/>
        <rect class="mf" x="40" y="50" width="40" height="6" rx="2"/>
        <line class="m" x1="60" y1="56" x2="60" y2="84"/>
        <path class="m" d="M32 80 L46 80 M74 80 L88 80"/>
        <path class="p" d="M46 48 L60 32 L74 48"/>
        <path class="p" d="M60 28 L60 50"/>
        <path class="p" d="M56 52 L42 60 L38 80 M64 52 L78 60 L82 80"/>
        <rect class="mf" x="47" y="54" width="6" height="16" rx="2"/>
        <rect class="mf" x="67" y="54" width="6" height="16" rx="2"/>
        <circle class="ph" cx="60" cy="22" r="5"/>`
    },
    pantorrillas: {
      tip: "Hombros bajo las almohadillas y puntas de los pies en el escalón. Subí en puntas de pie lo más alto posible y bajá los talones lento.",
      art: `
        ${tower(84)}
        <line class="m" x1="60" y1="25" x2="84" y2="25"/>
        <rect class="mf" x="40" y="21" width="22" height="6" rx="3"/>
        <rect class="mf" x="48" y="78" width="20" height="6" rx="1"/>
        <path class="p" d="M50 32 L58 26"/>
        <path class="p" d="M50 28 L50 54 L50 72 L58 78"/>
        <circle class="ph" cx="50" cy="15" r="5"/>`
    },
    jalon: {
      tip: "Agarrá la barra bien abierta. Bajala hasta arriba del pecho sacando pecho y juntando los omóplatos; subí controlado.",
      art: `
        ${tower(96)}
        <line class="m" x1="60" y1="6" x2="100" y2="6"/>
        <line class="c" x1="60" y1="8" x2="60" y2="40"/>
        <circle class="m" cx="60" cy="8" r="3"/>
        <rect class="mf" x="44" y="62" width="32" height="5" rx="2"/>
        <line class="m" x1="60" y1="67" x2="60" y2="84"/>
        <path class="m mt" d="M24 36 L30 40 L90 40 L96 36"/>
        <path class="p" d="M60 36 L60 62"/>
        <path class="p" d="M54 64 L50 82 M66 64 L70 82"/>
        <path class="p" d="M33 40 L40 52 L54 38 M87 40 L80 52 L66 38"/>
        <circle class="ph" cx="60" cy="30" r="5"/>`
    },
    remo: {
      tip: "Pecho apoyado en la almohadilla. Tirá de las manijas llevando los codos hacia atrás y juntando los omóplatos; volvé despacio.",
      art: `
        ${tower(90)}
        <rect class="mf" x="30" y="58" width="24" height="5" rx="2"/>
        <line class="m" x1="42" y1="63" x2="42" y2="84"/>
        <rect class="mf" x="55" y="26" width="5" height="22" rx="2"/>
        <line class="m" x1="58" y1="48" x2="74" y2="84"/>
        <line class="m" x1="52" y1="40" x2="90" y2="30"/>
        <path class="m" d="M64 82 L78 82"/>
        <path class="p" d="M46 58 L66 58 L70 80"/>
        <path class="p" d="M48 24 L46 58"/>
        <path class="p" d="M48 30 L34 38 L52 40"/>
        <circle class="ph" cx="48" cy="17" r="5"/>`
    },
    pecho: {
      tip: "Espalda apoyada y manijas a la altura del pecho. Empujá hacia adelante sin trabar los codos y volvé lento.",
      art: `
        ${tower(4)}
        <line class="m" x1="26" y1="84" x2="26" y2="8"/>
        <line class="m" x1="26" y1="8" x2="58" y2="8"/>
        <line class="m" x1="58" y1="8" x2="74" y2="28"/>
        <line class="m mt" x1="74" y1="26" x2="74" y2="38"/>
        <rect class="mf" x="30" y="18" width="6" height="40" rx="2"/>
        <rect class="mf" x="30" y="58" width="26" height="5" rx="2"/>
        <line class="m" x1="42" y1="63" x2="42" y2="84"/>
        <path class="p" d="M42 58 L64 58 L66 82"/>
        <path class="p" d="M40 24 L42 58"/>
        <path class="p" d="M41 30 L56 36 L72 32"/>
        <circle class="ph" cx="40" cy="16" r="5"/>`
    },
    hombros: {
      tip: "Espalda apoyada y manijas a la altura de los hombros. Empujá hacia arriba sin arquear la espalda y bajá hasta la altura de las orejas.",
      art: `
        ${tower(8)}
        <line class="m" x1="32" y1="84" x2="32" y2="6"/>
        <line class="m" x1="32" y1="8" x2="66" y2="8"/>
        <line class="m mt" x1="66" y1="3" x2="66" y2="13"/>
        <rect class="mf" x="40" y="14" width="6" height="44" rx="2"/>
        <rect class="mf" x="40" y="58" width="26" height="5" rx="2"/>
        <line class="m" x1="52" y1="63" x2="52" y2="84"/>
        <path class="p" d="M52 58 L74 58 L76 82"/>
        <path class="p" d="M51 28 L52 58"/>
        <path class="p" d="M52 32 L66 28 L65 10"/>
        <circle class="ph" cx="51" cy="21" r="5"/>`
    },
    biceps: {
      tip: "Parada frente a la polea baja, codos pegados al cuerpo. Subí la barra doblando los codos y bajá lento sin balancearte.",
      art: `
        ${tower(90)}
        <circle class="m" cx="90" cy="78" r="3"/>
        <line class="c" x1="88" y1="78" x2="64" y2="34"/>
        <path class="p" d="M50 22 L50 52 L46 82 M50 52 L56 82"/>
        <path class="p" d="M50 28 L52 46 L64 34"/>
        <circle class="m" cx="64" cy="34" r="2.5"/>
        <circle class="ph" cx="50" cy="15" r="5"/>`
    },
    triceps: {
      tip: "Parada frente a la polea alta, codos quietos al costado del cuerpo. Empujá la soga hacia abajo hasta estirar los brazos y subí lento.",
      art: `
        ${tower(90)}
        <circle class="m" cx="90" cy="12" r="3"/>
        <line class="c" x1="88" y1="12" x2="62" y2="56"/>
        <path class="p" d="M50 22 L50 52 L46 82 M50 52 L56 82"/>
        <path class="p" d="M50 28 L53 44 L62 56"/>
        <path class="c" d="M59 60 L62 56 L66 60"/>
        <circle class="ph" cx="50" cy="15" r="5"/>`
    },
    abdominales: {
      tip: "Sentada con los pies trabados y las manos en las manijas. Enrollate hacia adelante apretando la panza y volvé despacio.",
      art: `
        ${tower(8)}
        <line class="m" x1="32" y1="84" x2="32" y2="10"/>
        <line class="m" x1="32" y1="12" x2="58" y2="28"/>
        <rect class="mf" x="36" y="58" width="26" height="5" rx="2"/>
        <line class="m" x1="48" y1="63" x2="48" y2="84"/>
        <circle class="mf" cx="72" cy="78" r="4"/>
        <path class="p" d="M46 58 L68 60 L70 82"/>
        <path class="p" d="M46 58 Q46 38 58 32"/>
        <path class="p" d="M58 32 L58 28"/>
        <circle class="ph" cx="65" cy="33" r="5"/>`
    },
    martillo: {
      tip: "Parada con una mancuerna en cada mano y las palmas mirando hacia el cuerpo. Subí doblando los codos sin despegarlos del costado y bajá lento.",
      art: `
        <path class="p" d="M50 22 L50 52 L46 82 M50 52 L56 82"/>
        <path class="p" d="M50 28 L52 46 L62 34"/>
        <line class="m" x1="63" y1="29" x2="63" y2="41"/>
        <rect class="w" x="59" y="23" width="8" height="6" rx="1.5"/>
        <rect class="w" x="59" y="40" width="8" height="6" rx="1.5"/>
        <circle class="ph" cx="50" cy="15" r="5"/>`
    },
    laterales: {
      tip: "Parada con una mancuerna en cada mano y los codos apenas doblados. Subí los brazos hacia los costados hasta la altura de los hombros y bajá lento.",
      art: `
        <path class="p" d="M60 24 L60 54 L52 82 M60 54 L68 82"/>
        <path class="p" d="M32 34 L54 30 L66 30 L88 34"/>
        <rect class="w" x="26" y="28" width="6" height="13" rx="2"/>
        <rect class="w" x="88" y="28" width="6" height="13" rx="2"/>
        <circle class="ph" cx="60" cy="18" r="5"/>`
    },
    cinta: {
      bodyweight: true,
      tip: "10 minutos a ritmo cómodo para entrar en calor. Podés subir un poco la inclinación o la velocidad a medida que avanza.",
      art: `
        <rect class="mf" x="12" y="72" width="84" height="8" rx="4"/>
        <line class="m" x1="90" y1="72" x2="98" y2="32"/>
        <rect class="mf" x="88" y="22" width="20" height="10" rx="2"/>
        <line class="m" x1="94" y1="40" x2="72" y2="42"/>
        <path class="p" d="M58 20 L56 46"/>
        <path class="p" d="M56 46 L64 58 L60 72 M56 46 L50 58 L42 70"/>
        <path class="p" d="M58 26 L66 36 L72 32 M58 26 L50 36 L46 30"/>
        <circle class="ph" cx="58" cy="13" r="5"/>`
    },
    smith: {
      tip: "Barra apoyada en la parte alta de la espalda, pies un poco adelante. Bajá como sentándote en una silla y subí empujando con los talones.",
      art: `
        <line class="m" x1="26" y1="4" x2="26" y2="84"/>
        <line class="m" x1="94" y1="4" x2="94" y2="84"/>
        <line class="m" x1="26" y1="4" x2="94" y2="4"/>
        <line class="m mt" x1="8" y1="32" x2="112" y2="32"/>
        <rect class="w" x="10" y="23" width="6" height="18" rx="1"/>
        <rect class="w" x="104" y="23" width="6" height="18" rx="1"/>
        <path class="p" d="M60 30 L60 54"/>
        <path class="p" d="M56 55 L40 62 L44 82 M64 55 L80 62 L76 82"/>
        <path class="p" d="M54 35 L44 42 L42 32 M66 35 L76 42 L78 32"/>
        <circle class="ph" cx="60" cy="23" r="5"/>`
    },
    patada: {
      tip: "Tobillera enganchada a la polea baja y manos en la máquina. Llevá la pierna estirada hacia atrás apretando el glúteo y volvé lento.",
      art: `
        ${tower(90)}
        <circle class="m" cx="90" cy="78" r="3"/>
        <line class="c" x1="88" y1="78" x2="22" y2="52"/>
        <path class="p" d="M50 50 L70 34 L88 40"/>
        <path class="p" d="M50 50 L52 66 L52 82"/>
        <path class="p" d="M50 50 L34 58 L20 50"/>
        <circle class="ph" cx="76" cy="28" r="5"/>`
    },
    plancha: {
      bodyweight: true,
      tip: "Antebrazos apoyados con los codos debajo de los hombros. Cuerpo en línea recta de cabeza a talones, apretando panza y cola.",
      art: `
        <rect class="mf" x="8" y="78" width="104" height="5" rx="2"/>
        <path class="p" d="M30 58 L30 76 L16 76"/>
        <path class="p" d="M30 58 L100 76"/>
        <circle class="ph" cx="22" cy="54" r="5"/>`
    },
    crunch: {
      bodyweight: true,
      tip: "Acostada boca arriba con las rodillas dobladas. Subí los hombros del piso apretando la panza, sin tirar del cuello, y bajá despacio.",
      art: `
        <rect class="mf" x="8" y="78" width="104" height="5" rx="2"/>
        <path class="p" d="M62 75 L78 58 L90 76"/>
        <path class="p" d="M62 75 Q50 74 42 64"/>
        <path class="p" d="M44 66 L54 62"/>
        <circle class="ph" cx="36" cy="59" r="5"/>`
    },
    elevacion: {
      bodyweight: true,
      tip: "Acostada boca arriba con las manos al costado. Subí las piernas estiradas hasta arriba y bajalas lento sin tocar el piso.",
      art: `
        <rect class="mf" x="8" y="78" width="104" height="5" rx="2"/>
        <path class="p" d="M26 75 L62 75 L74 28"/>
        <path class="p" d="M32 76 L50 77"/>
        <circle class="ph" cx="19" cy="73" r="5"/>`
    },
    generico: {
      tip: "",
      art: `
        <line class="m mt" x1="34" y1="45" x2="86" y2="45"/>
        <rect class="w" x="24" y="30" width="10" height="30" rx="2"/>
        <rect class="w" x="86" y="30" width="10" height="30" rx="2"/>
        <rect class="w" x="16" y="36" width="8" height="18" rx="2"/>
        <rect class="w" x="96" y="36" width="8" height="18" rx="2"/>`
    }
  };

  const KEYWORDS = [
    ["crunch", "crunch"],
    ["lateral", "laterales"],
    ["martillo", "martillo"],
    ["elevacion de piernas", "elevacion"],
    ["prensa", "prensa"],
    ["extension de cuadriceps", "extension"],
    ["cuadriceps", "extension"],
    ["femoral", "femoral"],
    ["hip thrust", "hipthrust"],
    ["abductora", "abductora"],
    ["aductora", "aductora"],
    ["pantorrilla", "pantorrillas"],
    ["gemelo", "pantorrillas"],
    ["jalon", "jalon"],
    ["remo", "remo"],
    ["press de pecho", "pecho"],
    ["press de hombro", "hombros"],
    ["hombro", "hombros"],
    ["biceps", "biceps"],
    ["triceps", "triceps"],
    ["abdominal", "abdominales"],
    ["cinta", "cinta"],
    ["eliptica", "cinta"],
    ["smith", "smith"],
    ["sentadilla", "smith"],
    ["patada", "patada"],
    ["plancha", "plancha"],
    ["pecho", "pecho"]
  ];

  function normalize(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  }

  function findMachine(name) {
    const n = normalize(name || "");
    const hit = KEYWORDS.find(([kw]) => n.includes(kw));
    return MACHINES[hit ? hit[1] : "generico"];
  }

  function machineSvg(machine) {
    return `<svg class="machine-svg" viewBox="0 0 120 90" aria-hidden="true">` +
      `<line class="f" x1="2" y1="84.5" x2="118" y2="84.5"/>${machine.art}</svg>`;
  }

  window.RutinaMachines = { findMachine, machineSvg };
})();
