/**
 * Battle ropes: two heavy ropes run from a floor anchor to their grips, each
 * lying in a low wave. The pointer picks a rope by where it falls on the
 * floor, and a crest travels along that rope to sit under the pointer; the
 * other rope settles. At rest the near rope holds one crest, bright. The
 * slider is the crest's height.
 */
const {
  Cam, clamp, fit, prism, proj, facing, rings, poly, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 100, YS = [0, 16], RT = 2.4, N = 48, FAV = 1, REST = [[38, 3], [64, 7]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-10, -6, 0], [L + 8, YS[1] + 6, 0], [-10, -6, 16], [60, YS[1], 20]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  { const [r, i] = rings(-10, -6, 0, YS[1] + 6, 2.5, 1.2); put(solid(g), prism(P, front, r, i, 0, 16)); }

  const ropes = YS.map((y, k) => {
    const el = mk("path", { class: "sil" }, g), grip = solid(g);
    const [r, i] = rings(L, y - 2, L + 8, y + 2, 1.8, 0.7);
    put(grip, prism(P, front, r, i, 0.4, 4.4));
    return { k, y, el, grip, c: spring(REST[k][0]), a: spring(REST[k][1]), last: "" };
  });

  function draw(r) {
    const c = r.c.x, a = r.a.x, key = c.toFixed(2) + "," + a.toFixed(2);
    if (key === r.last) return;
    r.last = key;
    const top = [], bot = [];
    for (let j = 0; j <= N; j++) {
      const x = (L * j) / N, u = (x - c) / 12;
      const z = clamp(8 - (6 * x) / L + a * Math.exp(-u * u) * Math.cos(u * 1.6), RT, 40);
      const [sx, sy] = P(x, r.y, z);
      top.push([sx, sy - RT * C.S * 0.9]); bot.push([sx, sy + RT * C.S * 0.9]);
    }
    r.el.setAttribute("d", poly(top.concat(bot.reverse())));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const r of ropes) { if (stepS(r.c, dt)) moving = true; if (stepS(r.a, dt)) moving = true; draw(r); }
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function aim(a, wx) {
    ropes.forEach((r, k) => {
      if (a < 0) { r.c.t = REST[k][0]; r.a.t = REST[k][1]; }
      else if (k === a) { r.c.t = clamp(wx, 14, L - 12); r.a.t = clamp(amp, 0, 12); }
      else { r.a.t = 1.5; }
    });
    if (a !== act) {
      act = a;
      ropes.forEach((r, k) => r.el.classList.toggle("hi", k === (a < 0 ? FAV : a)));
      read.textContent = a < 0 ? "rest" : a === 0 ? "rope L" : "rope R";
    }
    B.wake();
  }
  /** The rope nearest the pointer's spot on the floor, which never moves. */
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    let best = -1, bd = Infinity;
    ropes.forEach((r, k) => { const d = Math.abs(wy - r.y); if (d < bd) { bd = d; best = k; } });
    aim(bd < 10 && wx > 0 && wx < L + 8 ? best : -1, wx);
  }
  aim(-1, 0);
  ropes.forEach(draw);
  bag.add(pointer(stage, { move, leave: () => aim(-1, 0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "battlerope",
  means: "Two battle ropes from a floor anchor: a crest runs along the rope under the pointer to sit beneath it, the other settles.",
  rules: [1, 3, 5, 8],
  range: [4, 9, 12],
  tour: [[146, 172], [205, 201], [278, 248], null],
  mount,
});
