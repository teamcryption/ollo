/**
 * Luggage carousel: an airport baggage belt, an oval of slats on a plinth
 * round a raised island, fed by a chute from the far side. Six suitcases ride
 * round it all the time the figure is in view. Hovering slows the belt, on a
 * spring on its rate, so a bag can be read, and the bag nearest the pointer
 * is bright. At rest the chute is bright. The slider is the slowed rate.
 *
 * The pattern: slow (dilate time), as Conveyor; a bag's group moves between
 * the layer behind the island and the one in front of it as it rounds an end.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, reducedMotion, rings, rrect,
  seg, spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const HX = 34, R = 17, BI = 8, BO = 26, ZB = 10, V0 = 18;
const PER = 4 * HX + 2 * Math.PI * R;
// length along the belt, width across it, height
const BAG = [[15, 10, 6], [12, 9, 8], [16, 11, 5], [11, 8, 7], [14, 10, 6], [13, 10, 9]];

/** The belt's centre line: [x, y, heading] at distance s round it. */
function at(s) {
  s = ((s % PER) + PER) % PER;
  if (s < 2 * HX) return [-HX + s, R, 0];
  s -= 2 * HX;
  if (s < Math.PI * R) { const a = Math.PI / 2 - s / R; return [HX + R * Math.cos(a), R * Math.sin(a), a - Math.PI / 2]; }
  s -= Math.PI * R;
  if (s < 2 * HX) return [HX - s, -R, Math.PI];
  s -= 2 * HX;
  const a = -Math.PI / 2 - s / R;
  return [-HX + R * Math.cos(a), R * Math.sin(a), a - Math.PI / 2];
}
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let slow = value, over = null;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-HX - BO, -BO, 0], [HX + BO, BO, 0], [HX + BO, -BO, 0], [-HX - BO, BO, 0], [-9, -50, ZB + 25], [9, -50, ZB + 25], [0, R, ZB + 10]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const stad = (h, r, b, z0, z1) => { const s = solid(g); put(s, prism(P, front, rrect(-HX - h, -r, HX + h, r, r, 14), rrect(-HX - h + b, -r + b, HX + h - b, r - b, r - b, 14), z0, z1)); return s; };

  // the chute, sloping down from the far side to the belt's edge
  const pts = [];
  for (const x of [-9, 9]) for (const [y, z] of [[-27, ZB + 2], [-50, ZB + 22]]) pts.push(P(x, y, z), P(x, y, z + 3));
  const chute = solid(g), hp = hull(pts);
  put(chute, { sil: poly(fillet(hp, hp.map(() => 1.5))), crease: open([P(-7.8, -50, ZB + 25), P(-7.8, -27.5, ZB + 5), P(7.8, -27.5, ZB + 5), P(7.8, -50, ZB + 25)]) });

  // plinth, belt, slats, then the island between the far and near layers
  stad(BO - 3, BO - 3, 1.2, 0, 6);
  stad(BO, BO, 1.4, 6, ZB);
  const slats = mk("path", { class: "nf lo" }, g);
  const layA = mk("g", {}, g);
  stad(BI, BI, 1.2, ZB, ZB + 5);
  const layB = mk("g", {}, g);

  const bags = BAG.map(([w, d, h], k) => {
    const s = solid(layA), strap = mk("path", { class: "nf lo" }, s.g);
    const [o, i] = rings(-w / 2, -d / 2, w / 2, d / 2, 2, 0.8);
    return { k, w, d, h, s, strap, o, i, u: (k * PER) / BAG.length, lay: null, x: 0, y: 0, last: NaN };
  });

  function draw(b) {
    const [x, y, a] = at(b.u);
    b.x = x; b.y = y;
    if (Math.abs(b.u - b.last) < 0.01) return;
    b.last = b.u;
    const top = ZB + b.h;
    put(b.s, prism(P, front, turn(b.o, a, x, y), turn(b.i, a, x, y), ZB, top));
    const c = Math.cos(a), s = Math.sin(a), q = b.d / 2 - 1.2;
    b.strap.setAttribute("d", seg(P(x - s * q, y + c * q, top), P(x + s * q, y - c * q, top)));
  }

  let order = "";
  function layer() {
    const sorted = [...bags].sort((p, q) => p.x + p.y - (q.x + q.y));
    const key = sorted.map((b) => b.k + (b.x - clamp(b.x, -HX, HX) + b.y > 0 ? "b" : "a")).join("");
    if (key === order) return;
    order = key;
    for (const b of sorted) (b.x - clamp(b.x, -HX, HX) + b.y > 0 ? layB : layA).append(b.s.g);
  }

  let phase = 0, drawnPhase = NaN;
  function drawSlats() {
    if (phase === drawnPhase) return;
    drawnPhase = phase;
    let d = "";
    for (let s = phase; s < PER; s += 11) {
      const [x, y, a] = at(s), nx = -Math.sin(a) * 7.5, ny = Math.cos(a) * 7.5;
      d += seg(P(x - nx, y - ny, ZB), P(x + nx, y + ny, ZB));
    }
    slats.setAttribute("d", d);
  }

  let lit;
  const rate = spring(V0, { eps: 0.05 }), still = reducedMotion();
  const B = register(stage, (dt) => {
    let m = stepS(rate, dt);
    if (!still) {
      const du = rate.x * dt;
      phase = (phase + du) % 11;
      for (const b of bags) b.u = (b.u + du) % PER;
      m = true;
    }
    for (const b of bags) draw(b);
    layer();
    drawSlats();
    pick();
    return m;
  });
  bag.add(B.unregister);

  /** The bag nearest the pointer on screen, from where it rides now. */
  function pick() {
    let best = null, bd = Infinity;
    if (over) for (const b of bags) {
      const [sx, sy] = P(b.x, b.y, ZB + b.h / 2), d = Math.hypot(sx - over[0], sy - over[1]);
      if (d < bd) { bd = d; best = b; }
    }
    if (best === lit) return;
    lit = best;
    for (const b of bags) b.s.sil.classList.toggle("hi", b === lit);
    chute.sil.classList.toggle("hi", !lit);
    read.textContent = lit ? "bag " + (lit.k + 1) : "rest";
  }

  function retarget() { rate.t = over ? slow : V0; pick(); B.wake(); }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  for (const b of bags) draw(b);
  layer();
  drawSlats();
  lit = undefined;
  pick();
  return { set: (v) => { slow = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "luggagecarousel",
  means: "Suitcases ride round an airport baggage carousel: hovering slows the belt, and the bag nearest the pointer is bright.",
  rules: [1, 5, 7, 8],
  range: [0, 4, 10],
  tour: [[174, 176], [240, 205], [290, 165], null],
  mount,
});
