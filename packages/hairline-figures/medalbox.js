/**
 * Medal case: a hinged case holding one medal on its cushion. The pointer
 * over the case swings the lid open on its back hinge and the medal rises
 * off the cushion. At rest the lid stands ajar, bright. The slider is how
 * far the lid swings.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 80, D = 60, H = 22, T = 9, MR = 14;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, -30, 0], [W, D, 0], [W, -30, 0], [0, D, 0], [0, -24, H + D], [W, -24, H + D]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g);
  const lidS = mk("path", { class: "sil" }, lidG), lidC = mk("path", { class: "nf lo" }, lidG), lidM = mk("path", { class: "nf lo" }, lidG);
  const box = mk("g", {}, g);
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(box), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly(ringAt(P, rings(4, 4, W - 4, D - 4, 4, 1)[0], H)), class: "nf lo" }, box);
  const medG = mk("g", {}, g);
  const rib = mk("path", { class: "nf" }, medG), med = mk("path", { class: "sil" }, medG), medC = mk("path", { class: "nf lo" }, medG);

  const lidRing = rrect(0, 0, W, D, 6, 4), lidIn = rrect(3, 3, W - 3, D - 3, 4, 4);
  const at = (q, a, h) => { const c = Math.cos(a), s = Math.sin(a); return P(q.u, q.v * c - h * s, H + q.v * s + h * c); };
  const area = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; } return s; };
  const sign0 = Math.sign(area(lidIn.map((q) => at(q, 0, T))));
  const tw = tween(22), mz = tween(0);
  let lastA = NaN, lastZ = NaN, behind = null;

  function draw(deg, lift) {
    if (deg === lastA && lift === lastZ) return;
    lastA = deg; lastZ = lift;
    const a = (deg * Math.PI) / 180;
    lidS.setAttribute("d", poly(hull(lidRing.map((q) => at(q, a, 0)).concat(lidRing.map((q) => at(q, a, T))))));
    const top = lidIn.map((q) => at(q, a, T));
    const face = Math.sign(area(top)) === sign0 ? top : lidIn.map((q) => at(q, a, 0));
    lidC.setAttribute("d", poly(face));
    const cush = rrect(14, 12, W - 14, D - 12, 8, 4);
    lidM.setAttribute("d", face === top ? "" : poly(cush.map((q) => at(q, a, 0))));
    const b = deg > 70;
    if (b !== behind) { behind = b; if (b) g.insertBefore(lidG, box); else medG.after(lidG); }
    const z0 = H - 2 + lift, cx = W / 2, cy = D / 2 + 4;
    med.setAttribute("d", poly(hull(ringAt(P, disc(cx, cy, MR), z0).concat(ringAt(P, disc(cx, cy, MR), z0 + 2.4)))));
    medC.setAttribute("d", poly(ringAt(P, disc(cx, cy, MR - 4), z0 + 2.4)));
    const r = [[cx - 8, cy - 26, z0 + 0.4], [cx + 8, cy - 26, z0 + 0.4], [cx + 4, cy - 10, z0 + 1], [cx - 4, cy - 10, z0 + 1]].map((p) => P(...p));
    rib.setAttribute("d", poly(r));
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(tw, now), tval(mz, now));
    return !tdone(tw, now) || !tdone(mz, now);
  });
  bag.add(B.unregister);

  const mid = P(W / 2, D / 2, H);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now();
    tset(tw, on ? open : 22, now, 0);
    tset(mz, on ? 12 : 0, now, on ? 120 : 0);
    lidS.classList.toggle("hi", !on);
    med.classList.toggle("hi", on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 90;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "medalbox",
  means: "A medal case: the pointer swings its lid open on the hinge and the medal rises off its cushion.",
  rules: [1, 3, 5, 6],
  range: [70, 110, 120],
  tour: [[177, 214], [140, 200], [240, 205], null],
  mount,
});
