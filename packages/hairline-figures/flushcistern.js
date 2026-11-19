/**
 * High-level cistern: a tank high on two wall brackets, its flush pipe running
 * down to the toilet bowl, and a lever on the tank's end with a long pull
 * chain and a weighted handle. At rest the chain hangs a little aslant, its
 * handle bright. Over it the handle is pulled: the lever tips down and the
 * chain swings out. The slider is how far it swings.
 */
const { Cam, circ, fit, hull, poly, proj, rrect, rings, ringAt, prism, facing, fillet, seg, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const TZ = 96, TH = 18, TY = 44, PV = [14, 41, TZ + 13], LL = 13, CL = 48, NL = 9, REST = 7;
const toR = (d) => (d * Math.PI) / 180;
const at = (cx, cy, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [38, 34, 0], [0, TY, TZ + TH], [40, 4, 40], [40, 60, 40], [14, 0, TZ], [0, 0, TZ + TH], [14, TY, TZ + TH], [36, 30, 0], [4, 25, 0]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the bowl: a tapered pedestal with a seat ring
  const foot = rrect(4, 9, 26, 25, 7, 12), top = rrect(0, 4, 36, 30, 12, 14);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, 28)))), crease: poly(ringAt(P, rrect(1.5, 5.5, 34.5, 28.5, 10.5, 14), 28)) });
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(9, 9, 33, 25, 8, 14), 28)) }, g);
  // the flush pipe, down the wall and into the back of the bowl
  mk("path", { class: "nf", d: seg(P(2, 15, TZ), P(2, 15, 34)) + seg(P(2, 19, TZ), P(2, 19, 34)) + seg(P(2, 15, 34), P(6, 15, 28)) + seg(P(2, 19, 34), P(6, 19, 28)) }, g);
  // the brackets and the tank
  for (const y of [6, TY - 6]) {
    const [r, i] = rings(0, y - 1.5, 12, y + 1.5, 1, 0.5);
    put(solid(g), prism(P, front, r, i, TZ - 6, TZ));
  }
  const [tr, ti] = rings(0, 0, 14, TY, 3, 1.4);
  put(solid(g), prism(P, front, tr, ti, TZ, TZ + TH));
  // the lever, the chain and the handle
  const lever = solid(g), chain = mk("path", { class: "nf" }, g), handle = solid(g);
  handle.sil.classList.add("hi");
  const sw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const k = (a - REST) / 50, lt = toR(-28 * k);
    const tip = [PV[0] + LL * Math.cos(lt), PV[1], PV[2] + LL * Math.sin(lt)];
    const [lr, li] = rings(-1, -1.2, LL + 1, 1.2, 1, 0.5);
    const lp = (q, z) => P(PV[0] + q.u * Math.cos(lt), PV[1] + q.v, PV[2] + q.u * Math.sin(lt) + z);
    put(lever, { sil: poly(hull(lr.map((q) => lp(q, -1)).concat(lr.map((q) => lp(q, 1))))), crease: poly(li.map((q) => lp(q, 1))) });
    const s = Math.sin(toR(a)) * 0.707, c = Math.cos(toR(a));
    const pt = (d) => [tip[0] + d * s, tip[1] - d * s, tip[2] - d * c];
    let d = "";
    for (let i = 0; i < NL; i++) {
      const A = P(...pt((i / NL) * CL)), Bp = P(...pt(((i + 1) / NL) * CL));
      const dx = Bp[0] - A[0], dy = Bp[1] - A[1], m = Math.hypot(dx, dy) || 1, nx = (-dy / m) * 1.6, ny = (dx / m) * 1.6;
      d += poly(fillet([[A[0] + nx, A[1] + ny], [Bp[0] + nx, Bp[1] + ny], [Bp[0] - nx, Bp[1] - ny], [A[0] - nx, A[1] - ny]], [1.5, 1.5, 1.5, 1.5], 3));
    }
    chain.setAttribute("d", d);
    const e = pt(CL);
    const ring = (dz, r) => ringAt(P, at(e[0], e[1], r), e[2] - dz);
    put(handle, { sil: poly(hull(ring(0, 1.6).concat(ring(4, 3.4), ring(14, 3.8), ring(16, 3)))), crease: poly(ring(4, 2.2)) });
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);
  const mid = P(18, 30, 60);
  let on = false;
  function setOn(v) {
    on = v;
    tset(sw, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "pull" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 140 && Math.abs(y - mid[1]) < 140; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "flushcistern",
  means: "A high-level cistern with a pull chain: over it, the handle is pulled, the lever tips down and the chain swings out.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 50],
  tour: [[182, 179], [225, 140], [207, 60], null],
  mount,
});
