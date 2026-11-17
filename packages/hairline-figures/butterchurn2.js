/**
 * Butter curler: a block of butter with a curler drawn across its top, a
 * hooked blade on a slanted handle. The pointer's place along the block
 * pulls the curler there; the shaving rolls up in front of the hook, the
 * curl growing with the distance pulled, and a scraped track stays behind.
 * At rest the curler is part way along, its curl bright. The slider is how
 * thick the curl rolls.
 *
 * The pattern: one part following the pointer (spring), hit on a fixed plane.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rings, prism, facing, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -40, X1 = 40, Y0 = -18, Y1 = 18, TOP = 22, START = 34, END = -30, REST = 8, W = 8;
const disc = (r, n = 20) => Array.from({ length: n }, (_, i) => [r * Math.cos((i / n) * 2 * Math.PI), r * Math.sin((i / n) * 2 * Math.PI)]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let thick = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[X0, Y0, 0], [X1, Y1, 0], [X1, Y0, 0], [X0, Y1, 0], [END - 14, 0, TOP + 20], [START + 44, 0, TOP + 34]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(X0, Y0, X1, Y1, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, TOP));

  const track = mk("path", { class: "nf lo" }, g), curl = mk("path", { class: "sil hi" }, g), turn = mk("path", { class: "nf lo" }, g);
  const blade = mk("path", { class: "sil" }, g), handle = mk("path", { class: "sil" }, g);
  const cx = spring(REST);
  let last = NaN;
  // a round section in the x–z plane, given width along y
  const roll = (x, z, r, w) => hull(disc(r, 24).flatMap(([a, b]) => [P(x + a, -w, z + b), P(x + a, w, z + b)]));
  function draw(c) {
    if (c === last) return;
    last = c;
    const pulled = clamp((START - c) / (START - END), 0, 1), r = 2 + thick * pulled;
    track.setAttribute("d", poly([P(c, -W, TOP), P(START, -W, TOP), P(START, W, TOP), P(c, W, TOP)]));
    curl.setAttribute("d", poly(roll(c - r - 1, TOP + r, r, W - 1)));
    const ring = disc(r * 0.55, 16).map(([a, b]) => P(c - r - 1 + a, W - 1, TOP + r + b));
    turn.setAttribute("d", poly(ring));
    // the hook: a curved blade standing on the butter, opening toward the curl
    const hook = [];
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI * 0.9; for (const y of [-W, W]) hook.push(P(c + 3 - 4 * Math.cos(t), y, TOP + 5 * Math.sin(t) + 4 * (i / 8))); }
    blade.setAttribute("d", poly(hull(hook)));
    const cap = (x, z) => disc(3.2, 12).flatMap(([a, b]) => [P(x + a, b, z - 2.5), P(x + a, b, z + 2.5)]);
    handle.setAttribute("d", poly(hull(cap(c + 6, TOP + 9).concat(cap(c + 42, TOP + 31)))));
  }

  const B = register(stage, (dt) => { const m = stepS(cx, dt); draw(cx.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP);
    if (x < X0 - 6 || x > X1 + 6 || y < Y0 - 10 || y > Y1 + 10) return leave();
    cx.t = clamp(x, END, START);
    const f = (START - cx.t) / (START - END);
    read.textContent = "curl " + Math.round(f * 100);
    B.wake();
  }
  function leave() { cx.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { thick = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "butterchurn2",
  means: "A butter curler pulled across a block of butter: the shaving rolls into a curl that grows the further the pointer pulls it.",
  rules: [1, 3, 5, 8],
  range: [5, 9, 12],
  tour: [[126, 134], [175, 165], [215, 200], null],
  mount,
});
