/**
 * Paper trimmer: a guillotine trimmer, a gridded base with a sheet on it and
 * a long blade arm hinged at the back corner with a handle at its far end.
 * The pointer along the base swings the arm open: further toward the front,
 * the wider it opens. At rest the arm is just lifted, bright.
 */
const { Cam, clamp, fit, hull, poly, proj, seg, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 40, D = 50, BH = 3, AX = W, AW = 8, AH = 5, AL = 56, REST = 14, MAXA = 72;

function box(P, f, x0, x1, y0, y1, z0, z1) {
  const c = [];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) c.push(P(...f([x, y, z])));
  return { sil: poly(hull(c)), cr: seg(c[7], c[3]) + seg(c[7], c[5]) + seg(c[7], c[6]) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.5);
  const r = (MAXA * Math.PI) / 180;
  fit(C, [[0, 0, 0], [AX + AW + 2, D + 4, 0], [0, D, 0], [AX + AW, 0, 0], [AX, AL * Math.cos(r), BH + AL * Math.sin(r) + 8], [AX + AW, -6, BH + 6]], 200, 165);
  const P = proj(C), id = (p) => p;
  const g = mk("g", {}, svg);

  const base = box(P, id, 0, AX + AW, -4, D, 0, BH);
  mk("path", { class: "sil", d: base.sil }, g);
  mk("path", { class: "nf lo", d: base.cr }, g);
  let grid = "";
  for (const x of [10, 20, 30]) grid += seg(P(x, 0, BH), P(x, D - 4, BH));
  for (const y of [12, 24, 36]) grid += seg(P(2, y, BH), P(AX - 2, y, BH));
  grid += poly([P(6, 8, BH), P(AX - 1, 8, BH), P(AX - 1, 40, BH), P(6, 40, BH)]);
  mk("path", { class: "nf lo", d: grid }, g);

  const arm = mk("g", {}, g);
  const aSil = mk("path", { class: "sil" }, arm), aCr = mk("path", { class: "nf lo" }, arm);
  const hSil = mk("path", { class: "sil" }, arm), hCr = mk("path", { class: "nf lo" }, arm);
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const f = ([x, y, z]) => [x, y * c - (z - BH) * s, BH + y * s + (z - BH) * c];
    const b = box(P, f, AX, AX + AW, -4, AL, BH, BH + AH), h = box(P, f, AX - 1, AX + AW + 1, AL - 10, AL - 2, BH + AH, BH + AH + 6);
    aSil.setAttribute("d", b.sil);
    aCr.setAttribute("d", b.cr + seg(P(...f([AX + 1, 0, BH])), P(...f([AX + 1, AL - 2, BH]))));
    hSil.setAttribute("d", h.sil);
    hCr.setAttribute("d", h.cr);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BH);
    if (x < -4 || x > AX + AW + 6 || y < -8 || y > D + 6) return -1;
    return clamp((y + 4) / (D + 6), 0, 1);
  }
  let cur = -2;
  function setT(t) {
    const deg = t < 0 ? REST : Math.round(REST + 10 + (MAXA - REST - 10) * Math.pow(t, 1 / (0.5 + reach)));
    if (deg === cur) return;
    cur = deg;
    tset(ang, deg, performance.now(), 0);
    aSil.classList.add("hi");
    read.textContent = t < 0 ? "rest" : deg + "°";
    B.wake();
  }
  setT(-1);
  bag.add(pointer(stage, { move: (p) => setT(hit(p)), leave: () => setT(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "cutmat",
  means: "A guillotine paper trimmer: the blade arm swings open from its back hinge, wider the further forward the pointer goes.",
  rules: [1, 3, 5, 6],
  range: [0.2, 0.5, 1],
  tour: [[195, 153], [146, 228], [170, 265], null],
  mount,
});
