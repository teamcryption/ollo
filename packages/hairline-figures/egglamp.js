/**
 * Egg candler: a round lamp housing with a cup collar on top, one big egg
 * standing in the cup with the lamp shining through it, so its air cell and
 * yolk show as dim lines. The pointer turns the egg in the cup, tilting it
 * toward its side on a spring. At rest the egg leans a little and the cup
 * collar is bright. The slider is how far the egg may tilt.
 *
 * The pattern: one part turning toward the pointer (officechairs).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HR = 32, HZ = 40, CR = 15, CZ = 6, EH = 74, ER = 25, REST = 18;
const disc = (r, n = 40) => circ(r, n);
const Q = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = 25 + value / 2;
  const C = Cam(45, 0.5, 2.15);
  const top = HZ + CZ;
  fit(C, [[-HR - 4, -HR - 4, 0], [HR + 4, HR + 4, 0], [HR + 4, -HR - 4, 0], [-HR - 4, HR + 4, 0], [0, 0, top + EH], [60 * Q, -60 * Q, top + 30], [-60 * Q, 60 * Q, top + 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-HR - 4, -HR - 4, HR + 4, HR + 4, HR + 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  put(solid(g), prism(P, front, disc(HR), disc(HR - 2.2), 3, HZ));
  const collar = solid(g);
  put(collar, prism(P, front, disc(CR + 3, 32), disc(CR, 32), HZ, top));
  collar.sil.classList.add("hi");

  const egg = mk("path", { class: "sil" }, g), cell = mk("path", { class: "nf lo" }, g), yolk = mk("path", { class: "nf lo" }, g);
  const tilt = spring(REST);
  let last = NaN;
  // a point at axial s (-1 low tip .. 1 blunt top) and ring angle w, for tilt t (deg) toward screen right
  function frame(t) {
    const a = (t * Math.PI) / 180, sn = Math.sin(a), cs = Math.cos(a);
    const ax = [sn * Q, -sn * Q, cs], e1 = [cs * Q, -cs * Q, -sn], e2 = [Q, Q, 0];
    const piv = [0, 0, top - 2], c0 = EH / 2 - 8;
    return (s, w, rr) => {
      const al = c0 + (s * EH) / 2, r = rr ?? ER * Math.sqrt(Math.max(0, 1 - s * s)) * (1 + 0.14 * s);
      const cw = Math.cos(w) * r, sw = Math.sin(w) * r;
      return P(piv[0] + ax[0] * al + e1[0] * cw + e2[0] * sw, piv[1] + ax[1] * al + e1[1] * cw + e2[1] * sw, piv[2] + ax[2] * al + e1[2] * cw + e2[2] * sw);
    };
  }
  function draw(t) {
    const tr = Math.round(t * 10) / 10;
    if (tr === last) return;
    last = tr;
    const F = frame(tr), pts = [];
    for (let i = 0; i <= 16; i++) { const s = -1 + (2 * i) / 16; for (let j = 0; j < 24; j++) pts.push(F(s, (j / 24) * 2 * Math.PI)); }
    egg.setAttribute("d", poly(hull(pts)));
    const ring = [];
    for (let j = 0; j < 28; j++) ring.push(F(0.66, (j / 28) * 2 * Math.PI));
    cell.setAttribute("d", poly(ring));
    const yp = [];
    for (let j = 0; j < 20; j++) { const w = (j / 20) * 2 * Math.PI; for (const s of [-0.12, -0.02, 0.08]) yp.push(F(s, w, 8 * Math.sqrt(1 - ((s + 0.02) / 0.14) ** 2 * 0.5))); }
    yolk.setAttribute("d", poly(hull(yp)));
  }

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  const mid = P(0, 0, top + EH / 3);
  let on = false;
  function move([sx, sy]) {
    const inside = Math.abs(sx - mid[0]) < 120 && sy > mid[1] - 110 && sy < mid[1] + 130;
    if (inside) {
      const t = clamp((sx - mid[0]) / 90, -1, 1) * maxT;
      tilt.t = t;
      read.textContent = (t >= 0 ? "+" : "") + Math.round(t) + "°";
    }
    setOn(inside);
    B.wake();
  }
  function setOn(v) {
    if (!v) { tilt.t = REST; read.textContent = "rest"; }
    if (v === on) return;
    on = v;
    egg.classList.toggle("hi", v);
    collar.sil.classList.toggle("hi", !v);
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { setOn(false); B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = 25 + v / 2; }, destroy: bag.dispose };
}

hairline({
  name: "egglamp",
  means: "An egg on a candling lamp, its air cell and yolk lit through the shell: the pointer turns the egg in its cup toward its side.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[124, 109], [230, 83], [276, 109], null],
  mount,
});
