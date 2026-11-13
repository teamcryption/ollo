/**
 * Traffic cones: six cones on square feet, each with a reflective band, set
 * round a small roadwork barrier on a patch of road. The pointer startles
 * them: the cones near it hop up, each on its own spring, the one under it
 * highest and bright. At rest the cones stand loosely round the barrier, one
 * just off the ground and bright. The slider is the reach.
 *
 * The pattern: a continuous field (terrain) over scattered parts; the hit is
 * on a fixed plane through the cones' middles, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HOP = 18, HZ = 9, CH = 19, FAV = 3;
// cone feet, numbered left to right on screen
const AT = [[-16, 20], [-34, -2], [12, 22], [-10, -22], [32, 4], [14, -20]];
const REST = [0, 0, 0, 3.5, 0, 0];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const falloff = (u) => (u <= 0 ? 1 : u <= 0.42 ? 1 - (u / 0.42) * 0.69 : u <= 1 ? 0.31 - ((u - 0.42) / 0.58) * 0.31 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-42, -30, -2], [40, 30, -2], [40, -30, -2], [-42, 30, -2], [-10, -22, CH + HOP], [14, -20, CH + HOP], [-34, -2, CH + HOP]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the road patch, with a lane line across it
  const road = block(-42, -30, 40, 30, 4, 1.6, -2, 0);
  mk("path", { class: "nf lo", d: open([P(-38, 12, 0), P(-26, 12, 0)]) + open([P(-14, 12, 0), P(-2, 12, 0)]) + open([P(10, 12, 0), P(22, 12, 0)]) }, road.g);

  // cones and barrier, painted far to near by x + y
  const parts = AT.map(([x, y], k) => ({ k, x, y, key: x + y }));
  parts.push({ bar: true, key: 0 });
  parts.sort((a, b) => a.key - b.key);
  const cones = [];
  for (const p of parts) {
    if (p.bar) {
      for (const x of [-15, 15]) block(x - 2.2, -6, x + 2.2, 6, 1, 0.6, 0, 2);
      for (const x of [-15, 15]) block(x - 1, -1, x + 1, 1, 0.5, 0.3, 2, 11);
      const board = block(-21, -1.4, 21, 1.4, 1.2, 0.6, 10, 17);
      let d = "";
      for (let u = -16; u <= 16; u += 8) d += open([P(u - 2.5, 1.4, 10.8), P(u + 2.5, 1.4, 16.2)]);
      mk("path", { class: "nf lo", d }, board.g);
      continue;
    }
    p.foot = solid(g);
    p.body = mk("path", { class: "sil" }, p.foot.g);
    p.band = mk("path", { class: "nf lo" }, p.foot.g);
    p.sp = spring(REST[p.k], { eps: 0.02 });
    p.drawn = NaN;
    cones.push(p);
  }
  cones.sort((a, b) => a.k - b.k);

  function draw(c) {
    const h = clamp(c.sp.x, -2, HOP + 2);
    if (h === c.drawn) return;
    c.drawn = h;
    const [o, i] = rings(c.x - 6, c.y - 6, c.x + 6, c.y + 6, 1.6, 0.8);
    put(c.foot, prism(P, front, o, i, h, h + 1.6));
    const z0 = h + 1.6, rr = (z) => 5 - ((z - z0) / (CH - 1.6)) * 3.9;
    c.body.setAttribute("d", poly(hull(ringAt(P, disc(c.x, c.y, 5), z0).concat(ringAt(P, disc(c.x, c.y, 1.1, 16), h + CH)))));
    const arc = (z) => open(ringAt(P, run(disc(c.x, c.y, rr(z), 40), front), z));
    c.band.setAttribute("d", arc(h + 8) + arc(h + 12));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cones) { if (stepS(c.sp, dt)) m = true; draw(c); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null, bd = 7.5;
    if (over) for (const c of cones) { const d = Math.hypot(c.x - over[0], c.y - over[1]); if (d < bd) { bd = d; hit = c; } }
    for (const c of cones) {
      c.sp.t = !over ? REST[c.k] : c === hit ? HOP : HOP * 0.8 * falloff(Math.hypot(c.x - over[0], c.y - over[1]) / RAD);
      c.body.classList.toggle("hi", over ? c === hit : c.k === FAV);
    }
    read.textContent = hit ? "cone " + (hit.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], HZ);
      over = x > -46 && x < 44 && y > -34 && y < 34 ? [x, y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "trafficcones",
  means: "Six traffic cones round a roadwork barrier: the cones near the pointer hop up, the one under it highest.",
  rules: [1, 3, 5, 9],
  range: [16, 36, 50],
  tour: [[141, 129], [225, 133], [255, 198], null],
  mount,
});
