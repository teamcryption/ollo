/**
 * Finish tape: a ribbon stretched between two posts. The pointer breaks the tape and its halves swing away from the middle. At rest it is whole, the tape bright.
 *
 * The pattern: one part swinging on a hinge, picked by the rest silhouette.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const STILL = [{"b":[0,0,0,6,6,70]},{"b":[100,0,0,106,6,70]},{"ball":[3,3,73,4]},{"ball":[103,3,73,4]}];
const MOVE = [{"b":[6,2,50,53,3,60],"pv":[3,3,0],"ax":"z","s":-1,"hi":1},{"b":[53,2,50,100,3,60],"pv":[103,3,0],"ax":"z","s":1,"hi":1}];
const REST = 3, S = 2.15;
const D = Math.PI / 180;

function rot(p, m, a) {
  if (!m.pv) return p;
  const [px, py, pz] = m.pv, q = [p[0] - px, p[1] - py, p[2] - pz], c = Math.cos(a * m.s), n = Math.sin(a * m.s);
  if (m.ax === "x") return [p[0], py + q[1] * c - q[2] * n, pz + q[1] * n + q[2] * c];
  if (m.ax === "y") return [px + q[0] * c - q[2] * n, p[1], pz + q[0] * n + q[2] * c];
  return [px + q[0] * c - q[1] * n, py + q[0] * n + q[1] * c, p[2]];
}
function ring(c, r, ax, n = 22) {
  const o = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI, u = r * Math.cos(t), v = r * Math.sin(t);
    o.push(ax === "x" ? [c[0], c[1] + u, c[2] + v] : ax === "y" ? [c[0] + u, c[1], c[2] + v] : [c[0] + u, c[1] + v, c[2]]);
  }
  return o;
}
function pts(m) {
  if (m.b) {
    const [a, b, c, d, e, f] = m.b;
    return { all: [[a, b, c], [d, b, c], [d, e, c], [a, e, c], [a, b, f], [d, b, f], [d, e, f], [a, e, f]], face: [[a, b, f], [d, b, f], [d, e, f], [a, e, f]] };
  }
  if (m.cyl) {
    const [x, y, z, r, h, ax] = m.cyl, e = ax === "x" ? [x + h, y, z] : ax === "y" ? [x, y + h, z] : [x, y, z + h];
    const near = ring(e, r, ax);
    return { all: ring([x, y, z], r, ax).concat(near), face: near };
  }
  const [x, y, z, r] = m.ball, all = [];
  for (const k of [-0.8, -0.4, 0, 0.4, 0.8]) all.push(...ring([x, y, z + r * k], r * Math.sqrt(1 - k * k), "z"));
  return { all, face: ring([x, y, z], r, "x") };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, S);
  const box = [];
  for (const m of STILL) box.push(...pts(m).all);
  for (const m of MOVE) for (const a of [REST, 40, 90]) box.push(...pts(m).all.map((p) => rot(p, m, a * D)));
  fit(C, box, 200, 168);
  const P = proj(C), g = mk("g", {}, svg);
  const pp = (l) => l.map((p) => P(p[0], p[1], p[2]));
  const flat = [];
  for (const m of STILL) {
    const q = pts(m);
    flat.push(...pp(q.all));
    mk("path", { d: poly(hull(pp(q.all))) }, g);
    mk("path", { d: poly(pp(q.face)), class: "nf lo" }, g);
  }
  const parts = MOVE.map((m) => ({ m, q: pts(m), sil: mk("path", { class: m.hi ? "sil" : "" }, g), face: mk("path", { class: "nf lo" }, g) }));
  for (const it of parts) flat.push(...pp(it.q.all.map((p) => rot(p, it.m, REST * D))));
  const xs = flat.map((p) => p[0]), ys = flat.map((p) => p[1]);
  const bb = [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6];
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    for (const it of parts) {
      it.sil.setAttribute("d", poly(hull(pp(it.q.all.map((p) => rot(p, it.m, a * D))))));
      it.face.setAttribute("d", poly(pp(it.q.face.map((p) => rot(p, it.m, a * D)))));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? open : REST, performance.now(), 0);
    for (const it of parts) it.sil.classList.toggle("hi", !!it.m.hi);
    read.textContent = a ? Math.round(open) + "°" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => sx > bb[0] && sx < bb[2] && sy > bb[1] && sy < bb[3];
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "finishline",
  means: "Finish line tape between two posts: the pointer breaks it and the two halves swing back on their posts.",
  rules: [1, 3, 4, 5],
  range: [40,70,90],
  tour: [[90,198],[132,111],[242,153],null],
  mount,
});
