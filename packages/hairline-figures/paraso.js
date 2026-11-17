/**
 * Paraso: a lace parasol standing on its ferrule, a crook handle low on the
 * shaft and a scalloped canopy on eight ribs. The nearer the pointer comes
 * to the shaft, the wider the canopy opens, on a spring; leaving lets it
 * fall back half furled. The canopy's rim is bright at rest. The slider is
 * how wide the ribs may open.
 *
 * The pattern: a continuous reach (a spring on one angle), read on the
 * ground plane, which never moves.
 */
const {
  Cam, clamp, fit, hull, poly, open, proj, seg, unproj, spring, stepS, rad, lerp,
  disposer, mk, pointer, register,
} = HL;

const TOP = 128, LR = 72, NR = 8, CLOSED = 10, REST = 0.42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 1.86);
  fit(C, [[-LR, -LR, TOP - 20], [LR, LR, TOP - 20], [LR, -LR, TOP - 20], [-LR, LR, TOP - 20], [0, 0, 0], [0, 0, TOP + 8]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shaft = mk("path", { class: "nf sil" }, g);
  shaft.setAttribute("d", seg(P(0, 0, 0), P(0, 0, TOP + 8)));
  const crook = [];
  for (let i = 0; i <= 10; i++) { const t = rad(180 * i / 10); crook.push(P(-6 * Math.SQRT1_2 * (1 - Math.cos(t)), 6 * Math.SQRT1_2 * (1 - Math.cos(t)), 30 - 6 * Math.sin(t))); }
  mk("path", { d: open([P(0, 0, 34)].concat(crook)), class: "nf sil" }, g);
  const canopy = mk("path", { class: "sil hi" }, g);
  const lace = mk("path", { class: "nf lo" }, g);
  const ribs = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST);
  let last = NaN;

  function draw() {
    const o = sp.x;
    if (o === last) return;
    last = o;
    const th = rad(lerp(CLOSED, maxT, o)), apex = P(0, 0, TOP);
    const tip = (phi, l = LR) => P(l * Math.sin(th) * Math.cos(phi), l * Math.sin(th) * Math.sin(phi), TOP - l * Math.cos(th));
    const edge = [], inner = [];
    for (let i = 0; i < NR; i++) {
      for (let j = 0; j < 6; j++) {
        const f = j / 6, phi = rad(360 * (i + f) / NR), sag = Math.sin(Math.PI * f) * 0.08;
        edge.push(tip(phi, LR * (1 - sag)));
        inner.push(tip(phi, LR * (0.88 - sag)));
      }
    }
    canopy.setAttribute("d", poly([apex].concat(edge)).length ? poly(hull([apex].concat(edge))) : "");
    const fr = (k) => { const phi = rad(360 * k / NR); return Math.cos(phi) + Math.sin(phi) > -0.3; };
    lace.setAttribute("d", open(inner.filter((_, k) => fr(k / 6))));
    let d = "";
    for (let i = 0; i < NR; i++) if (fr(i)) d += seg(apex, tip(rad(360 * i / NR)));
    ribs.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function reach(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
    const o = clamp(1.15 - r / 110, 0.12, 1);
    sp.t = o;
    read.textContent = Math.round(o * 100) + "%";
    B.wake();
  }
  reach(null);
  bag.add(pointer(stage, { move: reach, leave: () => reach(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "paraso",
  means: "A lace parasol standing on its tip: the nearer the pointer comes to the shaft, the wider its scalloped canopy opens on the ribs.",
  rules: [1, 3, 5, 8],
  range: [50, 70, 80],
  tour: [[330, 230], [200, 294], [90, 250], null],
  mount,
});
