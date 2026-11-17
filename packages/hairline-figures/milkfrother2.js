/**
 * Frother jug: a round powered base, the tall jug standing on it with a
 * side handle, and a flat lid with a knob, hinged at the back of the rim.
 * The pointer over it flips the lid up and back to show the whisk inside;
 * away, the lid sits just lifted, bright. The slider is how far it opens.
 *
 * The pattern: one hinged part tilting open (lid).
 */
const {
  Cam, circ, fillet, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const R = 21, BR = 26, BZ = 7, JZ = 46, LZ = 50, HX = -R - 1, HZ = 48, ANG = 88, REST = 0.06;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const LID = disc(0, 0, R + 1), KNOB = disc(0, 0, 3.6, 20);
const XF = (x, y, z, t) => {
  const a = rad(ANG * t), dx = x - HX, dz = z - HZ;
  return [HX + dx * Math.cos(a) - dz * Math.sin(a), y, HZ + dx * Math.sin(a) + dz * Math.cos(a)];
};
const HANDLE = fillet([[19, 40], [33, 40], [33, 14], [19, 14], [19, 20], [27, 20], [27, 34], [19, 34]], [0, 5, 5, 0, 0, 2, 2, 0], 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 3.08);
  const ext = [[-BR, -BR, 0], [BR, BR, 0], [-BR, BR, 0], [BR, -BR, 0], [33, 0, 40]];
  for (const q of LID) for (const t of [0, 1]) ext.push(XF(q.u, q.v, LZ + 4, t), XF(q.u, q.v, JZ, t));
  fit(C, ext, 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the base, its button, the jug with its opening and the whisk coil inside
  put(solid(g), prism(P, front, disc(0, 0, BR), disc(0, 0, BR - 2), 0, BZ));
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(16, 17, 1.8, 14), BZ)) }, g);
  const jug = solid(g);
  put(jug, prism(P, front, disc(0, 0, R), disc(0, 0, R - 1.6), BZ, JZ));
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(0, 0, 5, 20), JZ - 3)) + poly(ringAt(P, disc(0, 0, 2, 12), JZ - 3)) }, jug.g);

  // the handle: a flat loop with its thickness drawn as a second line
  const hg = mk("g", {}, g);
  mk("path", { class: "lo", d: poly(HANDLE.map(([x, z]) => P(x, -3, z))) }, hg);
  mk("path", { d: poly(HANDLE.map(([x, z]) => P(x, 3, z))) }, hg);

  // the lid and its knob, turned about the hinge at the back of the rim
  const lg = mk("g", {}, g);
  const lsil = mk("path", { class: "sil" }, lg), ltop = mk("path", { class: "nf lo" }, lg);
  const ksil = mk("path", { class: "sil" }, lg), ktop = mk("path", { class: "nf lo" }, lg);
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const ring = (rg, z) => rg.map((q) => P(...XF(q.u, q.v, z, t)));
    lsil.setAttribute("d", poly(hull(ring(LID, JZ).concat(ring(LID, LZ)))));
    ltop.setAttribute("d", poly(ring(disc(0, 0, R - 1), LZ)));
    ksil.setAttribute("d", poly(hull(ring(KNOB, LZ).concat(ring(KNOB, LZ + 4)))));
    ktop.setAttribute("d", poly(ring(KNOB, LZ + 4)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  // hit: the rest pose's screen box, which never moves
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const z of [0, LZ + 4]) for (const q of disc(0, 0, BR)) {
    const [sx, sy] = P(q.u, q.v, z);
    x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  const hit = ([sx, sy]) => sx > x0 - 4 && sx < x1 + 12 && sy > y0 - 4 && sy < y1 + 4 ? 0 : -1;

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? REST : amp, performance.now(), 0);
    lsil.classList.add("hi");
    ksil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "lid " + Math.round(ANG * amp) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "milkfrother2",
  means: "A milk frother jug on its base whose lid flips up and back on its rim hinge when the pointer comes over it, showing the whisk.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[200, 143], [245, 225], [165, 255], null],
  mount,
});
