/**
 * Microplate reader: a tall rounded instrument with a status screen on top
 * and a slot in its right face, a carrier tray holding a 96-well style plate.
 * The pointer over the reader slides the tray out sideways through the slot,
 * plate and wells riding on it. At rest the tray peeks out, bright. The
 * slider is how far the tray travels.
 *
 * The pattern: one part sliding out of its body.
 */
const { Cam, circ, fit, poly, prism, proj, facing, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 54, D = 62, H = 46, L = 46, TZ = 12, REST = 7;
const disc = (x, y, r, n = 10) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, H], [0, D, 0], [W, 0, 0], [W + L + 2, D, 0], [W + L + 2, 4, 0], [0, 0, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(0, 0, W, D, 7, 2), 0, H));
  const fx = (y, z) => P(W, y, z);
  mk("path", { d: poly([fx(8, TZ - 2), fx(D - 8, TZ - 2), fx(D - 8, TZ + 9), fx(8, TZ + 9)]) + poly(ringAt(P, rings(10, 12, 30, D - 12, 2, 1)[0], H)), class: "nf lo" }, g);
  const btn = mk("ellipse", { class: "dot off" }, g);
  const bp = P(W, D - 14, H - 10);
  btn.setAttribute("cx", bp[0]); btn.setAttribute("cy", bp[1]); btn.setAttribute("rx", 2.4); btn.setAttribute("ry", 2.4);

  const dg = mk("g", {}, g);
  const tray = solid(dg), plate = solid(dg);
  const wells = mk("path", { d: "", class: "nf lo" }, dg);
  tray.sil.classList.add("hi");
  const z = tween(REST);
  let last = NaN;
  function draw(out) {
    if (out === last) return;
    last = out;
    const x1 = W + out, x0 = Math.max(W, x1 - L);
    put(tray, x1 - x0 > 1.5 ? prism(P, front, ...rings(x0, 10, x1, D - 10, 2, 1), TZ, TZ + 3) : { sil: "", crease: "" });
    const p0 = Math.max(W, x1 - L + 4), p1 = x1 - 4;
    put(plate, p1 - p0 > 1.5 ? prism(P, front, ...rings(p0, 14, p1, D - 14, 2, 1.2), TZ + 3, TZ + 8) : { sil: "", crease: "" });
    let d = "";
    for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) {
      const x = x1 - L + 9 + i * 7.4, y = 19.5 + j * 4.6;
      if (x - 2 > W && x + 2 < p1) d += poly(ringAt(P, disc(x, y, 1.7), TZ + 8));
    }
    wells.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(W / 2 + 14, D / 2, H / 2);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(z, on ? travel : REST, performance.now(), 0);
    read.textContent = on ? "tray " + Math.round(travel) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.3) < 125), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; if (act) { read.textContent = "tray " + Math.round(v); tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "platereader",
  means: "A microplate reader: the pointer over it slides the tray out of the side slot, carrying the well plate into view.",
  rules: [1, 3, 5, 6],
  range: [20, 44, 46],
  tour: [[160, 94], [240, 200], [196, 160], null],
  mount,
});
