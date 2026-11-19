/**
 * Muffle furnace: a lab box furnace with a squat chamber, a vent on top and a
 * thick front door hinged along its foot. The pointer over the furnace drops
 * the door forward and down to open the chamber. At rest the door stands
 * ajar, bright. The slider is how far the door drops.
 *
 * The pattern: one part swinging on a hinge.
 */
const { Cam, circ, fit, hull, poly, prism, proj, facing, rings, ringAt, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 60, D = 48, H = 58, HZ = 8, DH = 42, T = 4, REST = 14;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drop = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, H + 8], [W, 0, 0], [0, D + DH + T, 0], [W, D + DH + T, 0], [0, D, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [vr, vi] = [disc(W * 0.3, D * 0.3, 5), disc(W * 0.3, D * 0.3, 3.6)];
  put(solid(g), prism(P, front, ...rings(0, 0, W, D, 5, 2), 0, H));
  put(solid(g), prism(P, front, vr, vi, H, H + 8));
  // the chamber mouth on the front face, and two knobs under the door
  const face = (x, z) => P(x, D, z);
  mk("path", { d: poly([face(13, 13), face(W - 13, 13), face(W - 13, HZ + DH - 6), face(13, HZ + DH - 6)]), class: "nf lo" }, g);
  mk("path", { d: poly([face(16, 13), face(W - 16, 13), face(W - 19, 19), face(19, 19)]), class: "nf lo" }, g);
  [W * 0.32, W * 0.68].forEach((x) => { const k = mk("circle", { r: 1.6, class: "dot off" }, g); const p = face(x, 4); k.setAttribute("cx", p[0]); k.setAttribute("cy", p[1]); });

  const doorG = mk("g", {}, g);
  const handle = mk("path", { d: "", class: "nf" }, doorG);
  const door = solid(doorG);
  door.sil.classList.add("hi");
  const [dr, di] = rings(7, 0, W - 7, DH, 3, 1.8);
  const z = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), s = Math.sin(a), c = Math.cos(a);
    const at = (u, v, w) => P(u, D + v * s + w * c, HZ + v * c - w * s);
    const out = deg < 50;
    const A = dr.map((q) => at(q.u, q.v, 0)), B = dr.map((q) => at(q.u, q.v, T));
    put(door, { sil: poly(hull(A.concat(B))), crease: poly(di.map((q) => at(q.u, q.v, out ? T : 0))) });
    const hv = DH - 6, h0 = W / 2 - 11, h1 = W / 2 + 11;
    handle.setAttribute("d", "M" + [at(h0, hv, T), at(h0, hv, T + 4), at(h1, hv, T + 4), at(h1, hv, T)].map((p) => p.join(",")).join("L"));
    if (out) doorG.appendChild(handle); else doorG.insertBefore(handle, door.g);
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(W / 2, D / 2 + 10, H / 2);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(z, on ? drop : REST, performance.now(), 0);
    read.textContent = on ? "door " + Math.round(drop) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.2) < 125), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { drop = v; if (act) { read.textContent = "door " + Math.round(v); tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "mufflefurnace",
  means: "A muffle furnace: the pointer over it drops the heavy front door forward on its foot hinge to open the chamber.",
  rules: [1, 5, 6],
  range: [40, 88, 95],
  tour: [[195, 157], [232, 112], [165, 228], null],
  mount,
});
