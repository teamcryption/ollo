/**
 * Shower seat: a fold-down seat on a wall plate. At rest the seat hangs a
 * little open, bright. Over the figure it swings down on its hinge to sit
 * level. The slider is how far it folds down.
 */
const { Cam, fit, hull, poly, proj, rrect, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const H = 46, D = 36, W = 22, T = 3, REST = 18;
const toR = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[0, -W - 4, 0], [0, W + 4, H + D + 6], [D + 4, W, H], [D + 4, -W, H], [0, 0, 0]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  function slab(ring, inner, Tf, w, face) {
    const a = ring.map((q) => P(...Tf(q.u, q.v, 0))), b = ring.map((q) => P(...Tf(q.u, q.v, w)));
    return { sil: poly(hull(a.concat(b))), crease: poly(inner.map((q) => P(...Tf(q.u, q.v, face ? w : 0)))) };
  }
  // the wall plate, standing on the wall
  const wr = rrect(0, -W - 4, H + 12, W + 4, 4, 6), wi = rrect(1.5, -W - 2.5, H + 10.5, W + 2.5, 3, 6);
  put(solid(g), slab(wr, wi, (u, v, w) => [w, v, u + 4], 2.5, true));
  // the hinge bar
  const hr = rrect(-1.6, -W, 1.6, W, 1.5, 4);
  put(solid(g), slab(hr, hr, (u, v, w) => [2.5 + w, v, H + u], 2.4, true));
  // the support legs and the seat
  const legs = mk("path", { class: "nf lo" }, g);
  const seat = solid(g);
  seat.sil.classList.add("hi");
  const sr = rrect(0, -W, D, W, 6, 6), si = rrect(2, -W + 2, D - 2, W - 2, 4.5, 6);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const th = toR(a), c = Math.cos(th), s = Math.sin(th);
    const Tf = (u, v, w) => [4 + u * s - w * c, v, H + u * c + w * s];
    const face = -c + 1.4 * s > 0;
    put(seat, slab(sr, si, Tf, T, face));
    const tip = (v) => P(...Tf(D * 0.7, v, 0)), foot = (v) => P(2.5, v, H - 22);
    legs.setAttribute("d", [-W + 4, W - 4].map((v) => "M" + foot(v).join(",") + "L" + tip(v).join(",")).join(""));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(D / 2, 0, H);
  let on = false;
  function setOn(v) {
    on = v;
    tset(ang, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "down" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 130 && Math.abs(y - mid[1]) < 120; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "showerchair",
  means: "A fold-down shower seat on its wall plate: over it, the seat swings down on its hinge to sit level.",
  rules: [1, 3, 5, 8],
  range: [40, 85, 95],
  tour: [[205, 168], [250, 195], [175, 150], null],
  mount,
});
