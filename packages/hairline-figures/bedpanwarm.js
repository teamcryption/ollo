/**
 * Bedpanwarm: a foot warmer, a square wooden box with a pierced lid and a
 * bail handle on it, an ember pan sitting inside. The pointer over the box
 * swings the lid up on its back hinge to show the pan of embers; leaving
 * lowers it again. At rest the lid sits ajar, bright. The slider is how far
 * the lid opens.
 *
 * The pattern: one hinged part on a fixed base; the hit is the rest box.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, H = 34, T = 4, REST = 10;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [-6, -1, H + W + 2], [-6, W + 1, H + W + 2], [W, W, H + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, W, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { class: "nf", d: poly(rrect(4, 4, W - 4, W - 4, 4, 4).map((q) => P(q.u, q.v, H))) }, g);
  // the ember pan inside, its rim and a few embers
  mk("path", { class: "nf lo", d: poly(disc(W / 2, W / 2, 20, 40).map((q) => P(q.u, q.v, H - 10))) }, g);
  for (const [x, y] of [[26, 30], [36, 26], [34, 38], [42, 34]]) mk("circle", { class: "dot off", r: 1.6, cx: P(x, y, H - 10)[0], cy: P(x, y, H - 10)[1] }, g);
  // the lid: a plate hinged on its far x edge, pierced, with a bail handle
  const lid = solid(g), holes = mk("path", { class: "nf lo" }, g), bail = mk("path", { class: "nf" }, g);
  const plate = rrect(-1, -1, W + 1, W + 1, 6, 4), inner = rrect(1, 1, W - 1, W - 1, 4, 4);
  const pts9 = [];
  for (const u of [18, 32, 46]) for (const v of [18, 32, 46]) if (!(u === 32 && v === 32)) pts9.push(disc(u, v, 2.4, 10));
  const ang = tween(REST);
  let last = NaN;

  function xf(u, v, z, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return P(u * c - z * s, v, H + u * s + z * c);
  }
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, at = (ring, z) => ring.map((q) => xf(q.u, q.v, z, a));
    lid.sil.setAttribute("d", poly(hull(at(plate, 0).concat(at(plate, T)))));
    lid.cr.setAttribute("d", poly(at(inner, T)));
    holes.setAttribute("d", pts9.map((h) => poly(at(h, T))).join(""));
    const b = rrect(28, 14, 36, 50, 4, 3);
    bail.setAttribute("d", poly(hull(at(b, T).concat(at(b, T + 5)))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const box = [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [0, 0, H + 10], [W, 0, H + 10], [0, W, H + 10]].map((p) => P(...p));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const hit = ([sx, sy]) => sx > Math.min(...xs) - 8 && sx < Math.max(...xs) + 8 && sy > Math.min(...ys) - 8 && sy < Math.max(...ys) + 8;

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? amax : REST, performance.now(), 0);
    lid.sil.classList.add("hi");
    read.textContent = v ? "open " + Math.round(amax) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { amax = v; if (on) { on = null; setOn(true); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "bedpanwarm",
  means: "A foot warmer box with a pierced lid: the pointer swings the lid up on its back hinge to show the pan of embers inside.",
  rules: [1, 3, 5, 8],
  range: [45, 70, 86],
  tour: [[219, 199], [165, 235], [255, 245], null],
  mount,
});
