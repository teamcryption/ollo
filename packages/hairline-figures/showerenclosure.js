/**
 * Shower enclosure: a square shower tray with a riser and head in the back
 * corner, a fixed glass side panel and a glass door on a pivot hinge at the
 * front corner, with a long pull handle. At rest the door stands a little
 * ajar, bright. Over it the door swings out on its pivot. The slider is how
 * far it swings.
 */
const { Cam, circ, fit, hull, poly, proj, rrect, ringAt, rings, prism, facing, seg, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 40, H = 78, Z0 = 4, REST = 14, DW = 38;
const toR = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [W + 37, W + 7, 0], [0, W + 2, 0], [W + 2, 0, 0], [3, 3, H + 4], [W + 37, W + 7, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function slab(ring, inner, Tf, w0, w1) {
    const a = ring.map((q) => P(...Tf(q.u, q.v, w0))), b = ring.map((q) => P(...Tf(q.u, q.v, w1)));
    return { sil: poly(hull(a.concat(b))), crease: poly(inner.map((q) => P(...Tf(q.u, q.v, w1)))) };
  }
  // the tray
  const [tr, ti] = rings(0, 0, W + 2, W + 2, 4, 1.6);
  put(solid(g), prism(P, front, tr, ti, 0, Z0));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(18, 18, 24, 24, 3, 4), Z0)) }, g);
  // the riser in the back corner, its arm and the round head
  mk("path", { class: "nf", d: seg(P(3, 3, Z0), P(3, 3, H - 2)) + seg(P(3, 3, H - 2), P(11, 11, H - 2)) }, g);
  const hd = circ(5, 24).map((q) => ({ ...q, u: q.u + 12, v: q.v + 12 }));
  put(solid(g), { sil: poly(hull(ringAt(P, hd, H - 5).concat(ringAt(P, hd, H - 3)))), crease: poly(ringAt(P, circ(3.6, 24).map((q) => ({ ...q, u: q.u + 12, v: q.v + 12 })), H - 5)) });
  // the fixed glass side panel, standing on the tray's near-left edge
  const pr = rrect(0, Z0, W, H, 2, 4), pi = rrect(2.5, Z0 + 2.5, W - 2.5, H - 2.5, 1, 4);
  const side = solid(g);
  side.sil.classList.add("nf");
  put(side, slab(pr, pi, (u, v, w) => [u, W + w, v], 0, 1.2));
  // the door: a glass plate on a pivot at the front corner, with its handle
  const door = solid(g);
  door.sil.classList.add("nf", "hi");
  const handle = mk("path", { class: "nf" }, door.g);
  const dr = rrect(0, Z0 + 0.5, DW, H, 2, 4), di = rrect(2.5, Z0 + 3, DW - 2.5, H - 2.5, 1, 4);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(toR(a)), c = Math.cos(toR(a));
    const Tf = (u, v, w) => [W + u * s + w * c, W - u * c + w * s, v];
    put(door, slab(dr, di, Tf, 0, 1.2));
    handle.setAttribute("d", seg(P(...Tf(DW - 5, 30, 3.5)), P(...Tf(DW - 5, 54, 3.5))) + seg(P(...Tf(DW - 5, 30, 1.2)), P(...Tf(DW - 5, 30, 3.5))) + seg(P(...Tf(DW - 5, 54, 1.2)), P(...Tf(DW - 5, 54, 3.5))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, W / 2, H / 2);
  let on = false;
  function setOn(v) {
    on = v;
    tset(ang, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "door" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 140 && Math.abs(y - mid[1]) < 130; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "showerenclosure",
  means: "A shower enclosure on a square tray: over it, the glass door swings out on its pivot hinge beside the fixed side panel.",
  rules: [1, 3, 5, 8],
  range: [40, 80, 100],
  tour: [[235, 164], [262, 100], [150, 120], null],
  mount,
});
