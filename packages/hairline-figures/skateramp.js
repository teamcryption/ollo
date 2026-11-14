/**
 * Skate ramp: a quarter pipe built in five sections side by side, each a
 * curved transition rising to a steel coping. The pointer is where the ramp
 * swells: sections near it grow taller and steeper on their own springs, the
 * far ones settle low, and the coping nearest it is bright. At rest the ramp
 * rises gently toward one end, one coping bright. The slider is the swell.
 *
 * The pattern: a continuous falloff (terrain's spring per section); the hit
 * is each section's rest centre on screen, which never moves.
 */
const { Cam, fit, proj, poly, open, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const N = 5, SW = 18, R = 30, DECK = 8, STEPS = 12;
const REST = [20, 24, 28, 33, 26], FAV = 3, LOW = 16, HIGH = 46;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.85);
  const x0 = -(N * SW) / 2;
  const ext = [];
  for (const x of [x0, x0 + N * SW]) for (const y of [-R - DECK, 6]) for (const z of [0, HIGH]) ext.push([x, y, z]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  let amt = value;

  const curve = (h) => {
    const pts = [];
    for (let k = 0; k <= STEPS; k++) { const t = (k / STEPS) * Math.PI / 2; pts.push([-R * Math.sin(t), h * (1 - Math.cos(t))]); }
    pts.push([-R - DECK, h]);
    return pts;
  };
  const secs = Array.from({ length: N }, (_, i) => {
    const a = x0 + i * SW, b = a + SW, grp = mk("g", {}, g);
    return {
      i, a, b, sp: spring(REST[i]), drawn: NaN, sx: P((a + b) / 2, -R / 2, REST[i] / 2)[0],
      face: mk("path", { class: "sil" }, grp), lines: mk("path", { class: "nf lo" }, grp),
      side: mk("path", { class: "sil" }, grp), cope: mk("path", { class: "nf sil" }, grp),
    };
  });

  function draw(s) {
    const h = s.sp.x;
    if (Math.abs(h - s.drawn) < 1e-3) return;
    s.drawn = h;
    const cv = curve(h);
    const A = cv.map(([y, z]) => P(s.a, y, z)), Bp = cv.map(([y, z]) => P(s.b, y, z));
    s.face.setAttribute("d", poly(A.concat(Bp.slice().reverse())));
    let d = "";
    for (const k of [4, 8]) d += open([A[k], Bp[k]]);
    s.lines.setAttribute("d", d);
    s.side.setAttribute("d", poly(Bp.concat([P(s.b, -R - DECK, 0), P(s.b, 0, 0)])));
    s.cope.setAttribute("d", open([P(s.a, -R, h + 1.2), P(s.b, -R, h + 1.2)]));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of secs) { if (stepS(s.sp, dt)) m = true; draw(s); }
    return m;
  });
  bag.add(B.unregister);

  let u = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const s of secs) {
      if (u === null) { s.sp.t = REST[s.i]; continue; }
      const d = Math.abs(u - s.i);
      if (d < bd) { bd = d; near = s.i; }
      const f = d < 0.5 ? 1 : d < 1.8 ? 0.42 : 0.1;
      s.sp.t = clamp(LOW + (HIGH - LOW) * f * amt, LOW, HIGH);
    }
    for (const s of secs) s.cope.classList.toggle("hi", u === null ? s.i === FAV : s.i === near);
    read.textContent = u === null ? "rest" : "bay " + (near + 1);
    B.wake();
  }

  const span = secs[N - 1].sx - secs[0].sx;
  bag.add(pointer(stage, {
    move: (p) => {
      const f = ((p[0] - secs[0].sx) / span) * (N - 1);
      u = f < -1 || f > N || p[1] < 30 || p[1] > 295 ? null : clamp(f, 0, N - 1);
      retarget();
    },
    leave: () => { u = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "skateramp",
  means: "A quarter pipe in five sections: the ramp swells tall and steep under the pointer and the far sections settle low.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[125, 163], [252, 226], [198, 199], null],
  mount,
});
