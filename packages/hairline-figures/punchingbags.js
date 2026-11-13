/**
 * Punching bags: a gym beam on two footed posts with three heavy bags hanging
 * from it, each on a chain that splits at a swivel into three straps. The
 * pointer is a punch: the bags near it swing away from it, each on its own
 * springs, and the one under it swings back hardest and bright. At rest the
 * bags hang a little askew, the middle one bright. The slider is the reach,
 * in bag spacings.
 *
 * The pattern: a continuous field along one row; the hit is the pointer's
 * screen x against the bags' resting centres, which never move.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, proj, rings, run, prism, seg, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 3, GAP = 42, ZB = 104, CH = 16, BL = 46, R = 10, AMAX = 20;
const X0 = -34, X1 = (N - 1) * GAP + 34;
const REST = [[5, -3], [-3, 2], [7, 4]], FAV = 1, D = Math.PI / 180;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * GAP, over = null;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[X0 - 9, -14, 0], [X1 + 9, 14, 0], [X0 - 9, 14, 0], [X1 + 9, -14, 0], [X0, 0, ZB + 8], [X1, 0, ZB + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };

  // the frame: feet, posts, then the chains behind the beam, the beam, the bags
  for (const x of [X0, X1]) block(x - 9, -14, x + 9, 14, 3, 1.2, 0, 3);
  for (const x of [X0, X1]) block(x - 4, -4, x + 4, 4, 2, 0.8, 3, ZB);
  const chains = mk("g", {}, g);
  block(X0 - 6, -5, X1 + 6, 5, 2.4, 1, ZB, ZB + 8);
  const [ring, inner] = [circ(R, 40), circ(R - 1.4, 40)];

  const bags = [];
  for (let i = 0; i < N; i++) {
    const bx = i * GAP;
    const b = { i, bx, rest: REST[i].map((a) => a * D), drawn: "" };
    b.ax = spring(b.rest[0], { eps: 0.002 });
    b.ay = spring(b.rest[1], { eps: 0.002 });
    b.chain = mk("path", { class: "nf sil", d: "" }, chains);
    b.el = solid(g);
    b.band = mk("path", { class: "nf lo", d: "" }, b.el.g);
    b.swivel = flatDot(chains, C, 1.4, "dot off");
    b.cx = P(bx, 0, ZB - CH - BL / 2)[0];
    bags.push(b);
  }

  function draw(b) {
    const ax = b.ax.x, ay = b.ay.x, key = ax.toFixed(4) + ay.toFixed(4);
    if (key === b.drawn) return;
    b.drawn = key;
    const at = (l) => [b.bx + l * Math.sin(ax), l * Math.sin(ay), ZB - l * Math.cos(ax) * Math.cos(ay)];
    const ringAt = (rg, l) => { const [x, y, z] = at(l); return rg.map((q) => P(q.u + x, q.v + y, z)); };
    const top = at(CH), sw = at(7), piv = P(b.bx, 0, ZB);
    let d = seg(piv, P(...sw));
    for (const a of [90, 210, 330]) d += seg(P(...sw), P(top[0] + R * 0.8 * Math.cos(a * D), top[1] + R * 0.8 * Math.sin(a * D), top[2]));
    b.chain.setAttribute("d", d);
    place(b.swivel, P(...sw));
    b.el.sil.setAttribute("d", poly(hull(ringAt(ring, CH).concat(ringAt(ring, CH + BL)))));
    b.el.cr.setAttribute("d", open(ringAt(run(inner, front), CH)));
    b.band.setAttribute("d", open(ringAt(run(ring, front), CH + BL - 9)) + open(ringAt(run(ring, front), CH + 8)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of bags) { if (stepS(b.ax, dt)) m = true; if (stepS(b.ay, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null;
    if (over !== null) {
      const k = clamp(Math.round(over / GAP), 0, N - 1);
      if (Math.abs(over - k * GAP) < GAP / 2) hit = bags[k];
    }
    for (const b of bags) {
      if (over === null) { b.ax.t = b.rest[0]; b.ay.t = b.rest[1]; }
      else if (b === hit) { b.ax.t = clamp((b.bx - over) / GAP, -0.5, 0.5) * AMAX * D; b.ay.t = -AMAX * D; }
      else { b.ax.t = Math.sign(b.bx - over) * AMAX * 0.8 * D * falloff(Math.abs(b.bx - over) / RAD); b.ay.t = b.rest[1] * 0.5; }
      b.el.sil.classList.toggle("hi", over !== null ? b === hit : b.i === FAV);
    }
    read.textContent = hit ? "bag " + (hit.i + 1) : "rest";
    B.wake();
  }

  const yTop = P(0, 0, ZB + 12)[1], yBot = P(0, 0, 0)[1] + 12;
  bag.add(pointer(stage, {
    move: (p) => {
      const x = ((p[0] - bags[0].cx) / (bags[N - 1].cx - bags[0].cx)) * (N - 1) * GAP;
      over = p[1] > yTop && p[1] < yBot && x > X0 && x < X1 ? x : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * GAP; if (over !== null) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "punchingbags",
  means: "Three punching bags on a gym beam: the bags near the pointer swing away from it, the one under it hardest.",
  rules: [1, 3, 5, 9],
  range: [1, 1.5, 3],
  tour: [[147, 126], [200, 152], [253, 179], null],
  mount,
});
