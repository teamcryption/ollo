/**
 * Traffic cone arm: a small truck bed with a post and a boom; a traffic cone hangs on a short cable from the boom tip. The boom tilts up and lifts the cone, bright at rest.
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

const SC = 2.1, WORDS = ["rest", "lift"];
const PARTS = [{}, {}, {}, { l: 1 }, { hot: 1 }, { hot: 1 }, { hot: 1 }, { hot: 1 }];
function geom(a) {
  const o = ry({ p: [[80, 0, 52]], f: null }, 0, 56, (-14 + 52 * a) * R).p[0], [x, y, z] = o, b = z - 34;
  return [B(-22, -16, 0, 26, 16, 14), B(-5, -5, 14, 5, 5, 58), ry(B(-10, -3.5, 52, 86, 3.5, 60), 0, 56, (-14 + 52 * a) * R), { l: [o, [x, y, z - 6]] },
    B(x - 11, y - 11, b - 2, x + 11, y + 11, b), cyl(x, y, b, 9, b + 10, 6.5), cyl(x, y, b + 10, 6.5, b + 19, 4.2), cyl(x, y, b + 19, 4.2, b + 28, 0.6)];
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
  name: "trafficcone",
  means: "A cone-lifting arm on a truck bed: under the pointer the boom tilts up and swings the hanging traffic cone off the road.",
  rules: [1, 3, 4, 5, 6],
  range: [0.4, 0.9, 1],
  tour: [[244,189],[155,181],[125,175],null],
  mount,
});
