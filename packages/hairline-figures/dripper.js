/**
 * Dripper: a terracotta watering spike in a pot of soil, a glazed collar
 * standing out of the soil with a bottle upturned in it. The pointer over the
 * pot draws the bottle up out of the spike, leaning as it comes; leaving sets
 * it back. At rest the bottle sits a little proud of the collar, bright. The
 * slider is how far it rises.
 *
 * The pattern: one part sliding out of a fixed socket; the hit is the rest box.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RP = 46, ZP = 30, REST = 3;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-RP, -RP, 0], [RP, RP, 0], [RP, -RP, 0], [-RP, RP, 0], [38, -20, 150], [-6, 20, 150]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the pot: a tapered tub with a rolled rim and soil inside
  const foot = disc(RP - 7, 64), top = disc(RP, 64), inner = disc(RP - 3, 64);
  const at = (ring, z) => ring.map((q) => P(q.u, q.v, z));
  const pot = solid(g);
  pot.sil.setAttribute("d", poly(hull(at(foot, 0).concat(at(top, ZP)))));
  pot.cr.setAttribute("d", poly(at(inner, ZP)));
  mk("path", { class: "nf lo", d: poly(at(disc(RP - 5, 48), ZP - 3)) }, g);
  for (const [x, y] of [[-22, -10], [14, -24], [24, 16], [-10, 26]]) mk("circle", { class: "dot off", r: 1.4, cx: P(x, y, ZP - 3)[0], cy: P(x, y, ZP - 3)[1] }, g);
  // the spike's collar standing out of the soil
  put(solid(g), prism(P, front, disc(9, 40), disc(7.5, 40), ZP - 3, ZP + 8));
  mk("path", { class: "nf lo", d: poly(at(disc(5, 24), ZP + 8)) }, g);
  // the bottle, upturned: neck in the collar, shoulder, body, base
  const neck = solid(g), body = solid(g);
  const bt = tween(REST);
  let last = NaN;

  function xf(u, v, z, h) {
    const a = (h / 60) * 0.35, c = Math.cos(a), s = Math.sin(a), dz = z - (ZP + 4);
    return P(u * c + dz * s, v, ZP + 4 + h + dz * c - u * s);
  }
  const ringAtX = (ring, z, h) => ring.map((q) => xf(q.u, q.v, z, h));
  function draw(h) {
    if (h === last) return;
    last = h;
    const n4 = disc(4.2, 24), b = disc(20, 48), b2 = disc(18.5, 48);
    neck.sil.setAttribute("d", poly(hull(ringAtX(n4, ZP + 2, h).concat(ringAtX(n4, ZP + 16, h)))));
    neck.cr.setAttribute("d", "");
    const pts = ringAtX(disc(5, 24), ZP + 15, h).concat(ringAtX(b, ZP + 30, h), ringAtX(b, ZP + 74, h));
    body.sil.setAttribute("d", poly(hull(pts)));
    body.cr.setAttribute("d", poly(ringAtX(b2, ZP + 74, h)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(bt, now)); return !tdone(bt, now); });
  bag.add(B.unregister);

  const box = [[-RP, -RP, 0], [RP, RP, 0], [RP, -RP, 0], [-RP, RP, 0], [0, 0, ZP + 76]].map((p) => P(...p));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const hit = ([sx, sy]) => sx > Math.min(...xs) - 8 && sx < Math.max(...xs) + 8 && sy > Math.min(...ys) - 8 && sy < Math.max(...ys) + 8;

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(bt, v ? rise : REST, performance.now(), 0);
    neck.sil.classList.add("hi"); body.sil.classList.add("hi");
    read.textContent = v ? "up " + Math.round(rise) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { rise = v; if (on) { on = null; setOn(true); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "dripper",
  means: "A terracotta watering spike in a pot with a bottle upturned in it: the pointer draws the bottle up out of the spike.",
  rules: [1, 3, 5, 8],
  range: [14, 26, 38],
  tour: [[200, 91], [175, 160], [235, 225], null],
  mount,
});
