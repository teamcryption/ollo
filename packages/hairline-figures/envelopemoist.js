/**
 * Envelope moistener: a low desk well holding a wet sponge, with a hinged
 * lid along its back edge. The pointer over it swings the lid up and back,
 * showing the sponge an envelope flap is drawn across. At rest the lid sits
 * ajar, bright. The slider is how far the lid swings.
 */
const { Cam, clamp, fit, hull, poly, proj, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const W = 60, D = 40, H = 18, T = 5;
const box = (P, x0, y0, z0, x1, y1, z1, f) => {
  const pts = [];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) pts.push(P(...(f ? f(x, y, z) : [x, y, z])));
  return poly(hull(pts));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -6, H + D + 4], [W, -6, H + D + 4]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g);
  mk("path", { d: box(P, 0, 0, 0, W, D, H), class: "sil" }, g);
  mk("path", { d: box(P, 4, 4, H - 0.5, W - 4, D - 4, H + 0.5), class: "nf lo" }, g);
  mk("path", { d: box(P, 7, 7, H, W - 7, D - 7, H + 4), class: "sil" }, g);
  const front = mk("g", {}, g);
  const lid = mk("path", { class: "sil hi" });
  const o = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const th = rad(10 + t * (swing - 10)), c = Math.cos(th), s = Math.sin(th);
    const f = (x, y, z) => { const dy = y + 1, dz = z - H; return [x, -1 + dy * c - dz * s, H + dy * s + dz * c]; };
    lid.setAttribute("d", box(P, -1, -1, H, W + 1, D + 1, H + T, f));
    (th > rad(70) ? back : front).appendChild(lid);
  }
  const B = register(stage, (_dt, now) => { draw(tval(o, now)); return !tdone(o, now); });
  bag.add(B.unregister);
  const ctr = P(W / 2, D / 2, H);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(o, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "lid " + Math.round(swing) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - ctr[0]) < 120 && Math.abs(sy - ctr[1]) < 90), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = clamp(v, 40, 120); last = NaN; if (on) read.textContent = "lid " + Math.round(swing) + "°"; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "envelopemoist",
  means: "An envelope moistener: the pointer over it swings the hinged lid up and back to show the wet sponge inside.",
  rules: [1, 3, 5, 6],
  range: [40, 100, 120],
  tour: [[194, 192], [172, 199], [215, 305], null],
  mount,
});
