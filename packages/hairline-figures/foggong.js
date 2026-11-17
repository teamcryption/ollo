/**
 * Fog bell: a big bronze bell hung from a beam between two posts on a slab,
 * its clapper ball hanging under the lip. The pointer's place along the
 * frame swings the bell on its spring toward it, the clapper riding with it.
 * At rest the bell hangs a little tipped, its lip bright. The
 * slider is how far the bell may swing.
 *
 * The pattern: one part answering on a spring (lean).
 */
const {
  Cam, circ, fit, facing, hull, poly, open, run, prism, proj, rings, spring, stepS, unproj, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZP = 96, MAX = rad(34), REST = rad(-7);
const PROF = [[-6, 9], [-12, 15], [-22, 17], [-34, 19], [-46, 24], [-56, 30], [-60, 31]];
const rot = (x, y, dz, f) => [x * Math.cos(f) - dz * Math.sin(f), y, ZP + x * Math.sin(f) + dz * Math.cos(f)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-44, -58, 0], [44, 58, 0], [44, -58, 0], [-44, 58, 0], [0, 0, 108], [-50, 0, 40], [50, 0, 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-40, -56, 40, 56, 10, 2);
  put(solid(g), prism(P, front, sr, si, 0, 6));
  const post = (y) => { const [a, b] = rings(-6, y - 6, 6, y + 6, 4, 1.2); put(solid(g), prism(P, front, a, b, 6, 100)); };
  post(-46);
  const ballS = solid(g);
  const bell = solid(g), bow = mk("path", { class: "nf lo" }, bell.g), lip = mk("path", { class: "nf lo" }, bell.g);
  const [br, bi] = rings(-7, -52, 7, 52, 4, 1.5);
  put(solid(g), prism(P, front, br, bi, 100, 108));
  post(46);

  const W = (pts) => pts.map((q) => P(...q));
  const ringW = (r, dz, f, n = 32) => circ(r, n).map((q) => ({ ...q, w: rot(q.u, q.v, dz, f) }));
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const pts = [];
    for (const [dz, r] of PROF) for (const q of ringW(r, dz, f, 24)) pts.push(P(...q.w));
    pts.push(P(...rot(0, 0, 0, f)));
    bell.sil.setAttribute("d", poly(hull(pts)));
    bell.cr.setAttribute("d", "");
    bow.setAttribute("d", open(run(ringW(23, -45, f), front).map((q) => P(...q.w))));
    lip.setAttribute("d", open(run(ringW(30.5, -58, f), front).map((q) => P(...q.w))));
    const bp = [];
    for (const [dz, r] of [[-62, 2], [-65, 5], [-69, 5.5], [-73, 4], [-75, 1.5]]) for (const q of ringW(r, dz, f, 16)) bp.push(P(...q.w));
    ballS.sil.setAttribute("d", poly(hull(bp)));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function active() { lip.setAttribute("class", "nf hi"); }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.abs(y) > 90 || Math.abs(x) > 120) return leave();
    sp.t = clamp(x / 50, -1, 1) * MAX * clamp(gain, 0, 1);
    active(true);
    read.textContent = Math.round(sp.t * 180 / Math.PI) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; active(false); read.textContent = "rest"; B.wake(); }
  draw(REST);
  active(false);
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "foggong",
  means: "A fog bell hung between two posts: it swings on its beam toward the pointer, clapper riding under the lip.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[124, 180], [276, 256], [200, 236], null],
  mount,
});
