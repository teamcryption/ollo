/**
 * Bathtub: a rounded tub on four short feet with a tap on its back rim. The
 * pointer's position along the tub is how far the tap is turned: the handle
 * swings round and the water line climbs the inner wall to meet it. At rest
 * the tub stands half full, its water line bright. The slider is the ceiling.
 *
 * The pattern: one continuous value read from the pointer (spring).
 */
const {
  Cam, circ, clamp, fit, facing, lerp, open, poly, prism, proj, rings, ringAt, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 120, W = 56, H = 34, FZ = 5, REST = 0.45;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let cap = value / 100;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [14, W / 2, FZ + H + 22], [L, W, FZ + H]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // feet, far ones first
  for (const [x, y] of [[12, 10], [L - 12, 10], [12, W - 10], [L - 12, W - 10]]) put(solid(g), prism(P, front, disc(x, y, 4), disc(x, y, 3), 0, FZ + 1));
  const [or, oi] = rings(0, 0, L, W, 24, 2);
  put(solid(g), prism(P, front, or, oi, FZ, FZ + H));
  // the opening, then the water line on its far inner wall
  const open0 = rrect(7, 7, L - 7, W - 7, 18, 8);
  mk("path", { d: poly(ringAt(P, open0, FZ + H)), class: "nf lo" }, g);
  const water = mk("path", { class: "nf" }, g);
  const back = open0.filter((q) => !front(q));
  // tap: a post on the back rim, a spout, a turning handle
  const tx = 14, ty = W / 2, tz = FZ + H;
  put(solid(g), prism(P, front, disc(tx, ty, 3.5), disc(tx, ty, 2.5), tz, tz + 14));
  mk("path", { d: open([P(tx, ty, tz + 12), P(tx + 12, ty, tz + 12), P(tx + 12, ty, tz + 8)]), class: "nf" }, g);
  const handle = mk("path", { class: "nf" }, g);

  const lvl = spring(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const z = lerp(FZ + 6, FZ + H - 3, v);
    water.setAttribute("d", open(ringAt(P, back.length ? back : open0, z)));
    const a = lerp(-0.4, 2.2, v), hz = tz + 15;
    handle.setAttribute("d", open([P(tx - 7 * Math.cos(a), ty - 7 * Math.sin(a), hz), P(tx + 7 * Math.cos(a), ty + 7 * Math.sin(a), hz)]));
  }
  const B = register(stage, (dt) => { const m = stepS(lvl, dt); draw(clamp(lvl.x, 0, 1)); return m; });
  bag.add(B.unregister);

  let on = null;
  function setOn(t) {
    const now = t === null ? null : Math.round(t * 100);
    lvl.t = t === null ? REST : t;
    water.classList.toggle("hi", true);
    read.textContent = t === null ? "rest" : "fill " + now + "%";
    on = t;
    B.wake();
  }
  setOn(null);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, FZ);
      if (x < -10 || x > L + 10 || y < -10 || y > W + 10) return setOn(null);
      setOn(clamp(x / L, 0.05, 1) * cap);
    },
    leave: () => setOn(null),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { cap = v / 100; if (on !== null) setOn(Math.min(on, cap)); }, destroy: bag.dispose };
}

hairline({
  name: "bathtub",
  means: "A tub with a tap on its rim: the pointer along the tub turns the handle and the water line climbs the inner wall.",
  rules: [1, 3, 4, 5, 8],
  range: [40, 100, 100],
  tour: [[130, 163], [200, 198], [267, 231], null],
  mount,
});
