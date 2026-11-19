/**
 * Monster truck: a pickup body riding high on four giant tyres, joined to the
 * axles by long suspension struts. The pointer's place across the frame lifts
 * the whole body up on its struts, high over the wheels, as on a bounce. At
 * rest the body sits a little up, its cab bright. The slider is how high the
 * suspension lifts.
 *
 * The pattern: one part sliding on a fixed track (lift).
 */
const { Cam, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 132, W = 84, R = 26, TW = 18, X1 = 28, X2 = 106, ZF = 46, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[X1 - R, 0, 0], [X2 + R, W, 0], [X2 + R, 0, 0], [X1 - R, W, 0], [0, 6, ZF + 50 + 18], [96, 12, ZF + 50 + 42], [L, W - 6, ZF + 50]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ring = (x, y, r) => {
    const pts = [];
    for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; pts.push(P(x + r * Math.cos(t), y, R + r * Math.sin(t))); }
    return pts;
  };
  const tyre = (x, y0, y1) => {
    mk("path", { d: poly(hull(ring(x, y0, R).concat(ring(x, y1, R)))) }, g);
    mk("path", { d: poly(ring(x, y1, R - 7)) + poly(ring(x, y1, 6)), class: "nf lo" }, g);
  };
  for (const x of [X1, X2]) tyre(x, 0, TW);
  const struts = mk("path", { class: "nf" }, g);
  const body = mk("g", {}, g);
  const low = solid(body), cab = solid(body), lines = mk("path", { class: "nf lo" }, body);
  cab.sil.classList.add("hi");
  for (const x of [X1, X2]) tyre(x, W - TW, W);
  const [br, bi] = rings(0, 8, L, W - 8, 6, 1.6);
  const foot = rrect(54, 10, 100, W - 10, 5, 6), top = rrect(62, 16, 94, W - 16, 4, 6);
  const lift = spring(REST);
  let last = NaN;

  function draw(h) {
    if (h === last) return;
    last = h;
    const z = ZF + h;
    let s = "";
    for (const x of [X1, X2]) {
      s += seg(P(x, TW, R), P(x, W - TW, R));
      for (const y of [TW + 6, W - TW - 6]) s += seg(P(x - 6, y, R), P(x - 2, y, z)) + seg(P(x + 6, y, R), P(x + 2, y, z));
    }
    struts.setAttribute("d", s);
    put(low, prism(P, front, br, bi, z, z + 18));
    cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, z + 16).concat(ringAt(P, top, z + 42)))));
    cab.cr.setAttribute("d", "");
    lines.setAttribute("d", seg(P(4, W - 8, z + 18), P(52, W - 8, z + 18)) + seg(P(58, W - 10, z + 21), P(70, W - 16, z + 38)) + seg(P(98, W - 10, z + 21), P(92, W - 16, z + 38)) + seg(P(78, W - 10, z + 20), P(78, W - 16, z + 40)));
  }
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);
  function aim(h, r) { lift.t = h; read.textContent = r ? "rest" : "+" + Math.round(h); B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 60) / 240, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "monstertruck",
  means: "A monster truck on four giant tyres: the pointer lifts the whole body high on its long suspension struts, as on a bounce.",
  rules: [1, 3, 5, 6],
  range: [24, 38, 50],
  tour: [[167, 89], [216, 98], [263, 66], null],
  mount,
});
