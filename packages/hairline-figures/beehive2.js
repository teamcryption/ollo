/**
 * Bee smoker: a tin canister with a cone lid and spout, and a pair of bellows
 * hinged at its foot. The pointer is the hand: the nearer it comes to the
 * bellows, the further their outer board swings shut and the more smoke rings
 * leave the spout, on one spring. At rest the bellows stand open and the
 * spout's rim is bright.
 *
 * The pattern: a continuous squeeze (one spring), read on the ground plane,
 * which never moves.
 */
const {
  Cam, circ, facing, fillet, fit, hull, poly, open, prism, proj, rings, ringAt, run, unproj, spring, stepS, clamp, rad, lerp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 11, H = 34, BX = 13.5, BW = 9, Z0 = 5, BH = 27;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 4.0);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, 0], [R, -R, 0], [-R, -R, 66], [BX + 20, BW, 0], [BX + 20, -BW, Z0 + BH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const shape = (pts, r = 1.2) => { const h = hull(pts.map((q) => P(...q))); return poly(fillet(h, h.map(() => r), 3)); };
  const taper = (parent, foot, top, inner, z0, z1) => {
    const s = solid(parent);
    s.sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))));
    s.cr.setAttribute("d", open(ringAt(P, run(inner, front), z1)));
    return s;
  };

  // canister, its rim band, the cone lid and the spout
  put(solid(g), prism(P, front, circ(R, 40), circ(R - 1.2, 40), 0, H));
  put(solid(g), prism(P, front, circ(R + 0.8, 40), circ(R - 0.4, 40), H - 1, H + 2));
  taper(g, circ(R + 0.4, 40), circ(4.6, 28), circ(3.6, 28), H + 2, H + 13);
  const spout = solid(g);
  put(spout, prism(P, front, circ(3, 24), circ(2, 24), H + 13, H + 17));

  // bellows: fixed inner board, leather, swinging outer board
  const innerB = [];
  for (const x of [BX, BX + 1.6]) for (const y of [-BW, BW]) for (const z of [Z0, Z0 + BH]) innerB.push([x, y, z]);
  mk("path", { class: "sil", d: shape(innerB) }, g);
  const leather = mk("path", { class: "sil" }, g);
  const pleats = mk("path", { class: "nf lo" }, g);
  const outer = solid(g);
  const smoke = [0, 1, 2].map(() => mk("ellipse", { class: "nf lo", rx: 0, ry: 0 }, g));

  const sp = spring(0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const t = clamp(sp.x, 0, 1);
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const ph = rad(lerp(34, 7, t)), c = Math.cos(ph), s = Math.sin(ph);
    const at = (h, y, d) => [BX + 3.2 + h * s + d * c, y, Z0 + h * c - d * s];
    const ob = [];
    for (const h of [0, BH]) for (const y of [-BW, BW]) for (const d of [0, 1.8]) ob.push(at(h, y, d));
    outer.sil.setAttribute("d", shape(ob));
    outer.cr.setAttribute("d", open([at(BH - 1.5, -BW + 1, 1.8), at(BH - 1.5, BW - 1, 1.8)].map((q) => P(...q))));
    const lb = [];
    for (const y of [-BW + 0.5, BW - 0.5]) { lb.push([BX + 1.6, y, Z0 + 1], [BX + 1.6, y, Z0 + BH - 1], at(1, y, 0), at(BH - 1, y, 0)); }
    leather.setAttribute("d", shape(lb, 0.8));
    let d = "";
    const zig = [];
    for (let i = 0; i <= 8; i++) {
      const f = i / 8, h = 1 + f * (BH - 2), k = i % 2 ? 0.75 : 0.25;
      const pin = [BX + 1.6, BW - 0.5, Z0 + h], pout = at(h, BW - 0.5, 0);
      zig.push(P(lerp(pin[0], pout[0], k), BW - 0.5, lerp(pin[2], pout[2], k)));
    }
    d += open(zig);
    pleats.setAttribute("d", d);
    smoke.forEach((e, i) => {
      const rise = t * (3 + i * 5), r = t * (2.5 + i * 1.6), [sx, sy] = P(0, 0, H + 18 + rise);
      e.setAttribute("cx", sx.toFixed(2)); e.setAttribute("cy", sy.toFixed(2));
      e.setAttribute("rx", (r * 4).toFixed(2)); e.setAttribute("ry", ((r * 4) * 0.5).toFixed(2));
    });
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function mark(on) {
    spout.sil.classList.toggle("hi", !on);
    outer.sil.classList.toggle("hi", on);
  }
  const rest = () => { sp.t = 0; mark(false); read.textContent = "rest"; B.wake(); };
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), dd = Math.hypot(x - (BX + 20), y);
      if (dd > 70) return rest();
      sp.t = clamp(1.15 - dd / 50, 0, 1);
      mark(true);
      read.textContent = "puff " + Math.round(sp.t * 100);
      B.wake();
    },
    leave: rest,
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  rest();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "beehive2",
  means: "A bee smoker: the nearer the pointer to the bellows, the further they squeeze shut and the more smoke leaves the spout.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[256, 252], [318, 305], [256, 308], null],
  mount,
});
