/**
 * Paraglider: an arched ram-air canopy of cells, its lines fanning down to a
 * pilot standing in the harness. The pointer over the glider swings the
 * canopy up from behind the pilot to overhead, as at launch. At rest the
 * canopy is half raised behind, bright. The slider is how far it swings up.
 *
 * The pattern: one part swinging about a pivot.
 */
const { Cam, fit, hull, poly, open, seg, proj, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const R = 74, HZ = 24, N = 10, SPAN = 58, LE = 13, TE = -15, REST = 58;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.0);
  // canopy samples before the swing, relative to the hang point
  const arc = (x, r) => { const o = []; for (let i = 0; i <= N; i++) { const f = rad(-SPAN + (2 * SPAN * i) / N); o.push([x, r * Math.sin(f), r * Math.cos(f)]); } return o; };
  const lead = arc(LE, R), trail = arc(TE, R), lip = arc(LE - 1, R - 4), att = arc(0, R - 3);
  const pitch = (p, d) => { const a = rad(d), c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[2] * s, p[1], HZ + p[0] * s + p[2] * c]; };
  const all = lead.concat(trail);
  const fp = all.map((p) => pitch(p, REST)).concat(all.map((p) => pitch(p, REST - 72)), [[0, -8, 0], [0, 8, 0], [10, 0, 0]]);
  fit(C, fp, 200, 164);
  const P = proj(C);
  const g = mk("g", {}, svg);
  mk("path", { d: open([P(-16, 0, 0), P(22, 0, 0)]), class: "dash nf" }, g);
  const lines = mk("path", { class: "nf lo" }, g);
  const can = mk("path", { class: "sil hi" }, g), ribs = mk("path", { class: "nf lo" }, g);
  // the pilot: harness body and helmet, standing at the hang point
  const blob = (z0, z1, r) => { const o = []; for (let j = 0; j < 12; j++) { const a = (j / 12) * Math.PI * 2; o.push(P(r * Math.cos(a), r * Math.sin(a), z0), P(r * Math.cos(a), r * Math.sin(a), z1)); } return poly(hull(o)); };
  mk("path", { d: blob(0, 19, 5), class: "sil" }, g);
  mk("path", { d: blob(21, 27, 3.6), class: "sil" }, g);
  mk("path", { d: seg(P(5, -5, HZ - 6), P(5, 5, HZ - 6)), class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const Q = (p) => P(...pitch(p, d));
    const L = lead.map(Q), T = trail.map(Q);
    can.setAttribute("d", poly(L.concat(T.slice().reverse())));
    let r = open(lip.map(Q));
    for (let i = 1; i < N; i++) r += seg(L[i], T[i]);
    ribs.setAttribute("d", r);
    const h1 = P(2, -4, HZ - 4), h2 = P(2, 4, HZ - 4);
    let l = "";
    att.forEach((p, i) => { if (i % 2 === 0) l += seg(i < N / 2 ? h1 : h2, Q(p)); });
    lines.setAttribute("d", l);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = all.map((p) => P(...pitch(p, REST))).concat([P(0, 0, 0)]), xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const bx = [Math.min(...xs) - 10, Math.max(...xs) + 10, Math.min(...ys) - 10, Math.max(...ys) + 14];
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? REST - max : REST, performance.now(), 0);
    read.textContent = a ? "up " + Math.round(max) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "paraglider",
  means: "A paraglider canopy on its lines over the pilot: the pointer swings the arched wing up from behind to overhead.",
  rules: [1, 3, 5, 6],
  range: [40, 56, 72],
  tour: [[143, 95], [242, 111], [73, 196], null],
  mount,
});
