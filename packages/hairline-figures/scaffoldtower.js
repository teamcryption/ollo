/**
 * Scaffold tower: a mobile tower on four castors, a braced lower frame and a
 * telescoping top stage, its platform and guard rails riding up out of the
 * lower posts. The nearer the pointer comes, the higher the top stage climbs.
 * At rest it stands part raised, platform bright. The slider sets the climb.
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 34, D = 22, WH = 8, LOW = 64, RISE = 40, REST = 0.3;
const CORN = [[-W, -D], [W, -D], [-W, D], [W, D]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let climb = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-W - 3, -D - 3, 0], [W + 3, D + 3, 0], [W + 3, -D - 3, 0], [-W - 3, D + 3, 0], [-W, -D, LOW + RISE + 18], [W, D, LOW + RISE + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x, y, r) => rings(x - r, y - r, x + r, y + r, r * 0.9, 0.4);
  const wheels = CORN.map(([x, y]) => { const s = solid(g); const [a, b] = rings(x - 3, y - 3, x + 3, y + 3, 2.8, 0.8); put(s, prism(P, front, a, b, 0, WH)); return s; });
  const braces = mk("path", { class: "nf lo" }, g);
  const lows = CORN.map(() => solid(g)), ups = CORN.map(() => solid(g));
  const backRail = mk("path", { class: "nf sil" }, g);
  const deck = solid(g);
  const frontRail = mk("path", { class: "nf sil" }, g);
  // the nearest corner's posts go after the deck
  lows[3].g.after(deck.g); ups[3].g.after(lows[3].g); frontRail.after(ups[3].g);
  deck.sil.classList.add("hi");
  const [dr, di] = rings(-W - 1, -D - 1, W + 1, D + 1, 2, 1.2);
  let b = "";
  for (const z of [WH + 4, WH + 32, LOW - 2]) b += seg(P(-W, -D, z), P(W, -D, z)) + seg(P(-W, -D, z), P(-W, D, z)) + seg(P(W, -D, z), P(W, D, z)) + seg(P(-W, D, z), P(W, D, z));
  b += seg(P(-W, D, WH + 4), P(W, D, WH + 32)) + seg(P(W, -D, WH + 32), P(W, D, LOW - 2)) + seg(P(-W, -D, WH + 4), P(W, -D, WH + 32));
  braces.setAttribute("d", b);
  CORN.forEach(([x, y], i) => { const [a, c] = post(x, y, 1.8); put(lows[i], prism(P, front, a, c, WH, LOW)); });

  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const zp = LOW + RISE * p, top = zp + 18;
    CORN.forEach(([x, y], i) => { const [a, c] = post(x, y, 1.3); put(ups[i], prism(P, front, a, c, LOW - 6, top)); });
    put(deck, prism(P, front, dr, di, zp - 2, zp));
    const r = (z) => [seg(P(-W, -D, z), P(W, -D, z)) + seg(P(-W, -D, z), P(-W, D, z)), seg(P(W, -D, z), P(W, D, z)) + seg(P(-W, D, z), P(W, D, z))];
    const a = r(top), m = r(zp + 9);
    backRail.setAttribute("d", a[0] + m[0]);
    frontRail.setAttribute("d", a[1] + m[1]);
  }

  const lift = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);
  const ax = P(0, 0, LOW);

  function aim(pt) {
    const d = Math.hypot(pt[0] - ax[0], (pt[1] - ax[1]) * 0.6);
    if (d > 120) return leave();
    lift.t = clamp(clamp(1.25 - d / 100, 0.15, 1) * (0.3 + 0.7 * climb / 100), 0.1, 1);
    read.textContent = "+" + Math.round(lift.t * RISE) + " cm";
    B.wake();
  }
  function leave() { lift.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { climb = v; }, destroy: bag.dispose };
}

hairline({
  name: "scaffoldtower",
  means: "A mobile scaffold tower on castors: the nearer the pointer, the higher its telescoping top stage and platform climb.",
  rules: [1, 3, 5, 8],
  range: [0, 60, 100],
  tour: [[200, 146], [200, 220], [184, 90], null],
  mount,
});
