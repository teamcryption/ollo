/**
 * Baggage carousel: a stadium belt round a low island, five cases standing on it at uneven gaps. The cases slide round the belt under the pointer; one case is bright.
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

const SC = 2.0, WORDS = ["rest", "run"];
const S0 = [0, 52, 118, 168, 236], HOT = 1;
const PARTS = [{}, {}, ...S0.map((_, i) => ({ hot: i === HOT }))];
const SORT = [1, 2, 3, 4, 5, 6];
const stad = (x0, y0, x1, y1, z, n = 12) => {
  const r = (y1 - y0) / 2, p = [];
  for (let i = 0; i <= n; i++) { const t = -Math.PI / 2 + (i / n) * Math.PI; p.push([x1 - r + r * Math.cos(t), y0 + r + r * Math.sin(t), z]); }
  for (let i = 0; i <= n; i++) { const t = Math.PI / 2 + (i / n) * Math.PI; p.push([x0 + r + r * Math.cos(t), y0 + r + r * Math.sin(t), z]); }
  return p;
};
const RR = 25, L = 2 * 70 + 2 * Math.PI * RR;
function at(s) {
  s = ((s % L) + L) % L;
  if (s < 70) return [35 + s, 10, 0];
  s -= 70; if (s < Math.PI * RR) { const t = -Math.PI / 2 + s / RR; return [105 + RR * Math.cos(t), 35 + RR * Math.sin(t), t + Math.PI / 2]; }
  s -= Math.PI * RR; if (s < 70) return [105 - s, 60, Math.PI];
  s -= 70; const t = Math.PI / 2 + s / RR; return [35 + RR * Math.cos(t), 35 + RR * Math.sin(t), t + Math.PI / 2];
}
function geom(a) {
  const out = [{ p: [...stad(0, 0, 140, 70, 0), ...stad(0, 0, 140, 70, 12)], f: stad(0, 0, 140, 70, 12) }];
  out.push({ p: [...stad(26, 24, 114, 46, 12), ...stad(26, 24, 114, 46, 17)], f: stad(26, 24, 114, 46, 17) });
  S0.forEach((s0) => { const [x, y, th] = at(s0 + a * 95); out.push(rz(B(x - 10, y - 4.5, 12, x + 10, y + 4.5, 26), x, y, th)); });
  return out;
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
  name: "luggagebelt",
  means: "A baggage carousel with cases on its belt: under the pointer the belt runs and the cases slide round the loop.",
  rules: [1, 3, 4, 5, 6],
  range: [0.4, 0.9, 1],
  tour: [[200,159],[115,127],[285,212],null],
  mount,
});
