/**
 * Air purifier: a tall rounded tower with a round outlet grille on top and a
 * front panel hinged at its foot. The pointer over the purifier swings the
 * panel down and out, showing the pleated filter behind it; leaving closes
 * it. At rest the panel stands a little ajar, bright. The slider is how far
 * the panel opens.
 */
const {
  Cam, circ, fit, hull, open, poly, proj, rad, rings, clamp, seg, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 30.5, H0 = 8, REST = 7, V = [0.61, 0.61, 0.5];
const hinge = (a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return ([u, v, w]) => [X0 + w * c + v * s, u, H0 - w * s + v * c]; };
function tsolid(P, [ring, inner], z0, z1, T) {
  const at = (z) => ring.map((q) => P(...T([q.u, q.v, z])));
  const a = T([0, 0, z0]), b = T([0, 0, z1]);
  const up = (b[0] - a[0]) * V[0] + (b[1] - a[1]) * V[1] + (b[2] - a[2]) * V[2] >= 0;
  return { sil: poly(hull(at(z0).concat(at(z1)))), crease: poly(inner.map((q) => P(...T([q.u, q.v, up ? z1 : z0])))), up };
}
const disc = (x, y, r) => circ(r, 32).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const ID = (p) => p;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.5);
  const ext = [[0, 0, 0], [30, 44, 0], [0, 44, 0], [30, 0, 0], [0, 0, 92], [30, 44, 92]];
  for (const u of [3, 41]) for (const v of [0, 78]) ext.push(hinge(80)([u, v, 3]));
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  put(solid(g), tsolid(P, rings(0, 0, 30, 44, 7, 2), 0, 92, ID));
  mk("path", { d: poly(disc(15, 22, 11).map((q) => P(q.u, q.v, 92))), class: "nf lo" }, g);
  mk("path", { d: poly(disc(15, 22, 6).map((q) => P(q.u, q.v, 92))), class: "nf lo" }, g);
  let d = "";
  for (let y = 7; y <= 37; y += 3) d += seg(P(30, y, 12), P(30, y, 80));
  mk("path", { d: poly([P(30, 4, 10), P(30, 40, 10), P(30, 40, 82), P(30, 4, 82)]), class: "nf lo" }, g);
  mk("path", { d, class: "nf lo" }, g);

  const panel = solid(g), slots = mk("path", { class: "nf lo" }, g);
  panel.sil.classList.add("hi");
  const ring = rings(3, 0, 41, 78, 6, 2);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a;
    const T = hinge(a), p = tsolid(P, ring, 0, 3, T);
    put(panel, p);
    let s = "";
    if (p.up) for (let v = 52; v <= 68; v += 4) s += seg(P(...T([10, v, 3])), P(...T([34, v, 3])));
    slots.setAttribute("d", s);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, on ? max : REST, performance.now(), 0);
    read.textContent = on ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    setOn(clamp(x, -6, 90) === x && clamp(y, -6, 50) === y);
  }
  bag.add(pointer(stage, { move, leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "airpurifier",
  means: "A tower air purifier: the pointer swings its front panel down on a foot hinge to show the pleated filter; leaving closes it.",
  rules: [1, 3, 5, 8],
  range: [30, 60, 80],
  tour: [[134, 253], [160, 268], [146, 222], null],
  mount,
});
