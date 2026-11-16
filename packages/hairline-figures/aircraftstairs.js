/**
 * Jet bridge: a terminal block with a rotunda; the tunnel and its cab swing out on the rotunda toward the aircraft door. At rest the cab is bright, angled in.
 *
 * The pattern: one part answering the pointer (swing).
 */
const { Cam, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const R = Math.PI / 180;
const B = (x0, y0, z0, x1, y1, z1) => {
  const p = [];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) p.push([x, y, z]);
  return { p, f: [p[1], p[3], p[7], p[5]] };
};
const map = (o, fn) => ({ p: o.p.map(fn), f: o.f && o.f.map(fn) });
const rz = (o, ox, oy, a) => map(o, ([x, y, z]) => [ox + (x - ox) * Math.cos(a) - (y - oy) * Math.sin(a), oy + (x - ox) * Math.sin(a) + (y - oy) * Math.cos(a), z]);
const ry = (o, ox, oz, a) => map(o, ([x, y, z]) => [ox + (x - ox) * Math.cos(a) - (z - oz) * Math.sin(a), y, oz + (x - ox) * Math.sin(a) + (z - oz) * Math.cos(a)]);
const cyl = (x, y, z0, r0, z1, r1 = r0, n = 24) => {
  const p = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; p.push([x + r0 * Math.cos(t), y + r0 * Math.sin(t), z0], [x + r1 * Math.cos(t), y + r1 * Math.sin(t), z1]); }
  return { p, f: null };
};

const SC = 2.3, WORDS = ["rest", "docked"];
const PARTS = [{}, {}, {}, {}, {}, { hot: 1 }];
function geom(a) {
  const ang = (28 - 62 * a) * R;
  return [B(-34, -30, 0, -6, 30, 30), cyl(0, 0, 0, 10, 34), rz(B(4, -7, 20, 86, 7, 32), 0, 0, ang), rz(B(66, -5, 0, 72, 5, 20), 0, 0, ang), rz(B(60, -9, -2, 78, 9, 2), 0, 0, ang), rz(B(86, -12, 17, 102, 12, 35), 0, 0, ang)];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value, on = false, last = NaN;
  const C = Cam(45, 0.5, SC);
  fit(C, [...geom(0), ...geom(1)].flatMap((o) => o.p || o.l), 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const els = PARTS.map((pt) => {
    const grp = mk("g", {}, g);
    return { grp, s: mk("path", { class: pt.l ? "nf" : "sil" }, grp), f: mk("path", { class: "nf lo" }, grp) };
  });
  PARTS.forEach((pt, i) => pt.hot && els[i].s.classList.add("hi"));
  function draw(a) {
    const gs = geom(a), keys = [];
    gs.forEach((o, i) => {
      if (o.l) { els[i].s.setAttribute("d", seg(P(...o.l[0]), P(...o.l[1]))); keys.push(-1e9); return; }
      const q = o.p.map((w) => P(...w));
      els[i].s.setAttribute("d", poly(hull(q)));
      els[i].f.setAttribute("d", o.f ? poly(o.f.map((w) => P(...w))) : "");
      keys.push(q.reduce((s, w) => s + w[1], 0) / q.length);
    });
    if (typeof SORT !== "undefined") SORT.slice().sort((x, y) => keys[x] - keys[y]).forEach((i) => g.appendChild(els[i].grp));
  }
  const rest = geom(0).flatMap((o) => o.p || o.l).map((w) => P(...w));
  const xs = rest.map((w) => w[0]), ys = rest.map((w) => w[1]);
  const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  const inside = ([x, y]) => x > box[0] && x < box[2] && y > box[1] && y < box[3];
  const t = tween(0, 900);
  const Bk = register(stage, (_dt, now) => {
    const a = tval(t, now);
    if (a !== last) { last = a; draw(a); }
    return !tdone(t, now);
  });
  bag.add(Bk.unregister);
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(t, v ? amp : 0, performance.now(), 0);
    read.textContent = WORDS[v ? 1 : 0];
    Bk.wake();
  }
  draw(0);
  read.textContent = WORDS[0];
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (on) { tset(t, amp, performance.now(), 0); Bk.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "aircraftstairs",
  means: "A jet bridge on its rotunda: under the pointer the tunnel swings out toward the aircraft, and the cab leads it.",
  rules: [1, 3, 4, 5, 6],
  range: [0.4, 0.9, 1],
  tour: [[181,195],[85,115],[216,235],null],
  mount,
});
