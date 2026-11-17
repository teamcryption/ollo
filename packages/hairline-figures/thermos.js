/**
 * Flask: a vacuum flask standing on the ground, its cup screwed on as a lid.
 * The pointer over the flask takes the cup off: it lifts, swings out and
 * lands upright beside the flask, showing the stopper. At rest the cup sits
 * a little loose on top, bright. The slider is how far it is set down.
 */
const {
  Cam, circ, fit, facing, lerp, prism, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 18.5, H = 54, CR = 20, CH = 20, AWAY = 41;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let far = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-CR, -CR, 0], [AWAY + CR, CR, 0], [CR, CR, 0], [0, 0, H + 6 + CH + 14], [AWAY, 0, CH]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 1.6), 0, H));
  put(solid(g), prism(P, front, disc(0, 0, R + 0.6), disc(0, 0, R - 1), H - 12, H - 9));
  put(solid(g), prism(P, front, disc(0, 0, 8), disc(0, 0, 6.5), H, H + 6));
  put(solid(g), prism(P, front, disc(0, 0, 3), null, H + 6, H + 8));
  const cup = solid(g);
  cup.sil.classList.add("hi");
  const lip = solid(g);
  const t = tween(0.12);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const x = lerp(0, AWAY * far, v), z0 = (H + 1 + v * 2) * (1 - v) + Math.sin(v * Math.PI) * 18;
    // the cup sits upside-down as a lid, and stands upright once set down: same hull either way
    put(cup, prism(P, front, disc(x, 0, CR), disc(x, 0, CR - 1.6), z0, z0 + CH));
    put(lip, prism(P, front, disc(x, 0, CR + 0.5), disc(x, 0, CR - 0.8), z0 + (v > 0.5 ? CH - 3 : 0), z0 + (v > 0.5 ? CH : 3)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const a = P(-R, R, 0), b = P(R, -R, 0), top = P(0, 0, H + CH + 4), bot = P(0, 0, 0);
  const hit = ([sx, sy]) => sx > Math.min(a[0], b[0]) - 6 && sx < Math.max(a[0], b[0]) + 6 && sy > top[1] - 14 && sy < bot[1] + 12;
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0.12, performance.now(), 0);
    read.textContent = o ? "cup off" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { far = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "thermos",
  means: "A vacuum flask with its cup on as a lid: the pointer takes the cup off and sets it down beside the flask.",
  rules: [1, 4, 5, 8],
  range: [0.7, 1, 1],
  tour: [[156, 200], [156, 135], [150, 100], null],
  mount,
});
