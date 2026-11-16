/**
 * Retort stand: a heavy base, a tall rod, and a boss clamp holding a round
 * flask by its neck. The pointer slides the clamp up or down the rod to the
 * height it points at, read beside the rod; the flask rides with it and
 * leans a little as it goes. At rest the flask hangs at mid height, bright.
 * The slider is how far the flask leans.
 *
 * The pattern: one part slid along a guide (slide).
 */
const { Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const H = 124, LO = 48, HI = 112, REST = 76, AX = 34, FR = 17;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lean = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -20, 0], [56, 20, 0], [56, -20, 0], [-14, 20, 0], [0, 0, H], [AX, 0, HI + 12], [AX, 0, LO - 40]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -20, 56, 20, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  put(solid(g), prism(P, front, disc(0, 0, 2.4, 16), disc(0, 0, 1.6, 16), 5, H));
  const cg = mk("g", {}, g);
  const boss = solid(cg), arm = mk("path", { class: "nf" }, cg), jaw = solid(cg);
  const neck = mk("path", { class: "sil" }, cg), bulb = mk("path", { class: "sil" }, cg), lip = mk("path", { class: "nf lo" }, cg);
  const h = spring(REST, { k: 80, c: 16 });
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const tilt = ((z - REST) / (HI - LO)) * lean * 0.5;
    put(boss, prism(P, front, ...rings(-5, -5, 5, 5, 1.5, 1), z - 5, z + 5));
    arm.setAttribute("d", seg(P(5, 0, z + 1.5), P(AX - 4, 0, z + 1.5)) + seg(P(5, 0, z - 1.5), P(AX - 4, 0, z - 1.5)));
    put(jaw, prism(P, front, ...rings(AX - 7, -7, AX + 7, 7, 3, 1), z - 3, z + 3));
    const nb = z - 8, cx = AX + Math.sin(tilt) * 26, cz = nb - FR * 0.85;
    neck.setAttribute("d", poly(hull(ringAt(P, disc(AX, 0, 4.5, 20), z + 10).concat(ringAt(P, disc(AX + Math.sin(tilt) * 8, 0, 4.5, 20), nb)))));
    const pts = [];
    for (let i = -4; i <= 4; i++) { const t = i / 4.2; pts.push(...ringAt(P, disc(cx, 0, FR * Math.sqrt(1 - t * t)), cz + FR * t)); }
    bulb.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(ringAt(P, disc(cx, 0, FR * 0.8, 32), cz - 6)));
    neck.parentNode.appendChild(bulb); neck.parentNode.appendChild(lip); neck.parentNode.appendChild(jaw.g); 
  }
  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(h.x); return m; });
  bag.add(B.unregister);

  const rod = P(0, 0, 0)[0];
  function aim(p) {
    let t = REST;
    if (p && Math.abs(p[0] - rod) < 110) {
      let best = REST, bd = Infinity;
      for (let z = LO - 30; z <= HI + 30; z += 1) { const d = Math.abs(P(AX / 2, 0, z)[1] - p[1]); if (d < bd) { bd = d; best = z; } }
      if (bd < 4) t = clamp(best, LO, HI);
    }
    h.t = t;
    bulb.classList.toggle("hi", true);
    read.textContent = p && t !== REST ? "h" + Math.round(t) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lean = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "beakerstand",
  means: "A retort stand: the clamp slides up or down the rod to the height of the pointer, carrying its round flask.",
  rules: [1, 3, 5, 6],
  range: [0, 0.5, 1],
  tour: [[194, 166], [194, 60], [194, 56], null],
  mount,
});
