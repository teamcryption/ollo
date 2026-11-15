/**
 * Bear canister: a tall drum with a screw lid and a latch tab. Over it, the lid turns, rises off the drum and tilts open.
 */
const { Cam, fit, proj, hull, poly, open, run, seg, spring, stepS, mk, pointer, register, disposer, solid, rings, prism, facing, put } = HL;

const corners = (x0, y0, z0, x1, y1, z1) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i & 1 ? x1 : x0, i & 2 ? y1 : y0, i & 4 ? z1 : z0]);
const rotY = (p, cx, cz, a) => { const dx = p[0] - cx, dz = p[2] - cz; return [cx + dx * Math.cos(a) + dz * Math.sin(a), p[1], cz - dx * Math.sin(a) + dz * Math.cos(a)]; };
const rotX = (p, cy, cz, a) => { const dy = p[1] - cy, dz = p[2] - cz; return [p[0], cy + dy * Math.cos(a) - dz * Math.sin(a), cz + dy * Math.sin(a) + dz * Math.cos(a)]; };
function drawBox(P, s, w) {
  const q = w.map((p) => P(p[0], p[1], p[2]));
  let n = 0, bd = -Infinity;
  w.forEach((p, i) => { const d = (p[0] + p[1]) * 0.61 + p[2] * 0.5; if (d > bd) { bd = d; n = i; } });
  s.sil.setAttribute("d", poly(hull(q)));
  s.cr.setAttribute("d", seg(q[n], q[n ^ 1]) + seg(q[n], q[n ^ 2]) + seg(q[n], q[n ^ 4]));
}
const REST = 0.12, R = 24, ZB = 36, ZL = 18;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.15);
  const REST_PTS = [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [-R, -R, ZB + ZL], [R, -R, ZB + ZL]];
  fit(C, REST_PTS.concat([[0, 0, ZB + ZL + 34]]), 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [o, i] = rings(-R, -R, R, R, R, 2);
  put(solid(g), prism(P, front, o, i, 0, ZB));
  for (const z of [10, 22]) mk("path", { class: "nf lo", d: open(run(o, front).map((q) => P(q.u, q.v, z))) }, g);
  const lid = solid(g), tab = solid(g);
  lid.sil.classList.add("hi");
  function draw(a) {
    const lift = a * 26, ang = a * 0.45, spin = a * 2.2;
    const tr = (u, v, z) => P(...rotY([u, v, z + lift], R, ZB + lift, -ang));
    const ring = (rr, z) => o.map((q) => tr(q.u * rr / R, q.v * rr / R, z));
    lid.sil.setAttribute("d", poly(hull(ring(R - 1, ZB + 1).concat(ring(R - 1, ZB + ZL)))));
    lid.cr.setAttribute("d", poly(ring(R - 3, ZB + ZL)));
    const c = Math.cos(spin), s = Math.sin(spin), tp = [];
    for (const [u, v] of [[-3, -R + 6], [3, -R + 6], [3, -2], [-3, -2]]) for (const z of [ZB + ZL, ZB + ZL + 4]) tp.push(tr(u * c - v * s, u * s + v * c, z));
    tab.sil.setAttribute("d", poly(hull(tp)));
  }
  const rq = REST_PTS.map((p) => P(p[0], p[1], p[2]));
  const box = [Math.min(...rq.map((q) => q[0])) - 8, Math.min(...rq.map((q) => q[1])) - 8, Math.max(...rq.map((q) => q[0])) + 8, Math.max(...rq.map((q) => q[1])) + 8];

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    sp.t = a ? amt : REST;
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  draw(REST); setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3]), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "bearcan",
  means: "A bear canister: the pointer turns its screw lid, which rises off the drum and tilts open on one side.",
  rules: [1, 3, 4, 5, 6],
  range: [0.5,0.85,1],
  tour: [[200, 200], [200, 98], [215, 130], null],
  mount,
});
