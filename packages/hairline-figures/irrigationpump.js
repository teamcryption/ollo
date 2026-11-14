/**
 * Irrigation pump: a hand pump on a stone pad over a well, with a spout and a
 * bucket under it. The pointer's height works the handle: lower the pointer
 * and the handle swings down, the plunger rod rises, and a drop runs from the
 * spout into the bucket. At rest the handle stands raised, bright. The slider
 * is the handle's travel.
 *
 * The pattern: one part following the pointer (lever).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const PX = -8, PZ = 60, ARM = 40, TAIL = 10, REST = 28;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-32, -32, 0], [32, 32, 0], [PX - ARM, 0, PZ + ARM * Math.sin(rad(REST)) + 4], [PX - ARM, 0, PZ - ARM * Math.sin(rad(40))], [30, 0, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const cyl = (x, y, r, z0, z1, b = 1.4) => put(solid(g), prism(P, front, disc(x, y, r), disc(x, y, r - b), z0, z1));
  const bar = (a, b, r) => poly(hull([a, b].flatMap(([x, y, z]) => ringAt(P, disc(x, y, r, 12), z - r).concat(ringAt(P, disc(x, y, r, 12), z + r)))));

  const [pr, pi] = rings(-30, -30, 30, 30, 7, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 6));
  cyl(0, 0, 8, 6, 52, 1.6);
  cyl(0, 0, 10, 52, 56, 1.6);
  // fulcrum post on the cap
  const [fr, fi] = rings(PX - 3, -2.5, PX + 3, 2.5, 1.5, 0.8);
  put(solid(g), prism(P, front, fr, fi, 56, PZ));
  const rod = mk("path", { class: "nf" }, g);
  const handle = mk("path", { class: "sil" }, g);
  const grip = mk("path", { class: "nf" }, g);
  // spout, then the bucket under it
  const [sr, si] = rings(7, -3.2, 24, 3.2, 2.5, 0.9);
  put(solid(g), prism(P, front, sr, si, 40, 46));
  cyl(26, 0, 9, 6, 20, 1.4);
  const drop = mk("circle", { r: 2.2, class: "dot off" }, g);

  const sp = spring(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const th = rad(REST - t * swing), c = Math.cos(th), s = Math.sin(th);
    const end = [PX - ARM * c, 0, PZ + ARM * s], tail = [PX + TAIL * c, 0, PZ - TAIL * s];
    handle.setAttribute("d", bar(end, tail, 2.2));
    grip.setAttribute("d", bar([PX - (ARM - 2) * c, 0, PZ + (ARM - 2) * s], [PX - (ARM - 10) * c, 0, PZ + (ARM - 10) * s], 3));
    rod.setAttribute("d", bar([tail[0], 0, 54], tail, 1.2));
    place(drop, P(23, 0, clamp(39 - t * 22, 20, 39)));
    drop.setAttribute("class", t > 0.08 ? "dot m" : "dot off");
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const top = P(PX - ARM * Math.cos(rad(REST)), 0, PZ + ARM * Math.sin(rad(REST)))[1];
  function move([, sy]) {
    const t = clamp((sy - top) / 90, 0, 1);
    sp.t = t;
    read.textContent = Math.round(t * 100) + "%";
    B.wake();
  }
  function leave() { sp.t = 0; read.textContent = "rest"; B.wake(); }
  handle.classList.add("hi");
  draw(0);
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "irrigationpump",
  means: "A hand pump over a well: lower the pointer and the handle swings down, the rod rises and a drop runs into the bucket.",
  rules: [1, 3, 5, 8],
  range: [30, 60, 75],
  tour: [[155, 74], [150, 112], [149, 147], null],
  mount,
});
