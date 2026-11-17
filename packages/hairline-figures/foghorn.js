/**
 * Foghorn: a squat plinth and post carrying a long flared horn. The pointer
 * over the figure swings the horn round on its post, mouth to the sea. At rest
 * the horn points down the shore, its mouth rim bright. The slider is the swing.
 */
const { Cam, fit, hull, poly, proj, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const rbox = (x0, y0, z0, x1, y1, z1, r) => { const a = []; for (const [cx, cy, s] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]]) for (let i = 0; i <= 4; i++) { const t = (s + i / 4) * Math.PI / 2; for (const z of [z0, z1]) a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return a; };
const cyl = (cx, cy, r, z0, z1, n = 20) => { const a = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z0], [cx + r * Math.cos(t), cy + r * Math.sin(t), z1]); } return a; };
const PZ = 46, E = 0.12;
function hornRing(a, s, r, n = 28) {
  const d = [Math.cos(a) * Math.cos(E), Math.sin(a) * Math.cos(E), Math.sin(E)], u = [-Math.sin(a), Math.cos(a), 0], w = [-Math.cos(a) * Math.sin(E), -Math.sin(a) * Math.sin(E), Math.cos(E)], o = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI, c = r * Math.cos(t), q = r * Math.sin(t); o.push([d[0] * s + c * u[0] + q * w[0], d[1] * s + c * u[1] + q * w[1], PZ + d[2] * s + c * u[2] + q * w[2]]); }
  return o;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.35);
  const A0 = (-25 * Math.PI) / 180;
  const ext = [...rbox(-22, -22, 0, 22, 22, 10, 6), ...hornRing(A0, 64, 22, 8), ...hornRing(A0 + Math.PI / 180 * 100, 64, 22, 8), ...hornRing(A0, -12, 7, 8)];
  fit(C, ext, 200, 165);
  const P = proj(C), pr = (pts) => poly(hull(pts.map((p) => P(...p))));
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: pr(rbox(-22, -22, 0, 22, 22, 10, 6)) }, g);
  mk("path", { class: "nf lo", d: poly(rbox(-20, -20, 10, 20, 20, 10, 5).filter((_, i) => i % 2 === 0).map((p) => P(...p))) }, g);
  mk("path", { class: "sil", d: pr(cyl(0, 0, 6, 10, PZ - 4)) }, g);
  mk("path", { class: "sil", d: pr(cyl(0, 0, 9, PZ - 6, PZ + 2)) }, g);
  const horn = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf lo" }, g), mouth = mk("path", { class: "nf hi" }, g);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = A0 + (t * swing * Math.PI) / 180, m = hornRing(a, 64, 22);
    horn.setAttribute("d", poly(hull([...hornRing(a, -12, 7), ...hornRing(a, 22, 9), ...m].map((p) => P(...p)))));
    band.setAttribute("d", poly(hornRing(a, 22, 9).map((p) => P(...p))));
    mouth.setAttribute("d", poly(m.map((p) => P(...p))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = ext.map((p) => P(...p)), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "sound" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx[0] && x < bx[1] && y > bx[2] && y < bx[3]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "foghorn",
  means: "A foghorn on its post: the pointer swings the flared horn round to face the sea, its mouth rim bright.",
  rules: [1, 3, 5, 6],
  range: [50, 100, 120],
  tour: [[181, 121], [150, 140], [215, 165], null],
  mount,
});
