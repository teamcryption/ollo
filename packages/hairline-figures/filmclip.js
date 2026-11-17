/**
 * Film dryer: a weighted clip hanging a long strip of film from a drying
 * line strung between two posts. The pointer's place along the line swings
 * the strip on its clip; leaving lets it settle to a slight lean. The
 * slider is the swing.
 */
const { Cam, fit, hull, poly, open, proj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const Z0 = 120, W = 13, LEN = 92, MAX = 30, REST = 7;
const ball = (x, y, z, r) => { const o = []; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r; o.push([x + c, y + s, z], [x + c, y, z + s], [x, y + c, z + s]); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-52, -8, 0], [52, 8, 0], [0, 0, Z0 + 6], [-LEN * 0.55, 0, Z0 - LEN * 0.85], [LEN * 0.55, 0, Z0 - LEN * 0.85]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const rodPath = (pts) => poly(hull(pts.map(([x, y, z]) => P(x, y, z))));
  for (const x of [-50, 50]) {
    mk("path", { d: rodPath(ball(x, 0, 0, 6).concat(ball(x, 0, 2, 6))), class: "sil" }, g);
    mk("path", { d: rodPath(ball(x, 0, 2, 1.8).concat(ball(x, 0, Z0 + 2, 1.8))), class: "sil" }, g);
  }
  mk("path", { d: rodPath(ball(-50, 0, Z0 + 2, 1.2).concat(ball(50, 0, Z0 + 2, 1.2))), class: "sil" }, g);
  const strip = mk("path", { class: "sil" }, g), lines = mk("path", { class: "nf lo" }, g), clip = mk("path", { class: "sil hi" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw(deg) {
    const k = Math.round(deg * 50) / 50;
    if (k === last) return;
    last = k;
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
    const at = (u, d, y = 0) => P(u * c + d * s, y, Z0 - d * c + u * s);
    strip.setAttribute("d", poly([at(-W / 2, 8), at(W / 2, 8), at(W / 2, LEN), at(-W / 2, LEN)]));
    let d = "";
    for (let j = 1; j < 5; j++) { const t = 8 + (j * (LEN - 8)) / 5; d += open([at(-W / 2, t), at(W / 2, t)]) + " "; }
    for (const u of [-W / 2 + 2, W / 2 - 2]) d += open([at(u, 10), at(u, LEN - 2)]) + " ";
    lines.setAttribute("d", d);
    const cp = [];
    for (const u of [-W / 2 - 1, W / 2 + 1]) for (const dd of [0, 11]) for (const y of [-3, 3]) cp.push(at(u, dd, y));
    clip.setAttribute("d", poly(hull(cp)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const L = P(-52, 0, 0)[0], R = P(52, 0, 0)[0], top = P(0, 0, Z0 + 10)[1] - 20, bot = P(52, 8, 0)[1] + 10, cx = P(0, 0, Z0 - 40)[0];
  function move([sx, sy]) {
    if (sx < L || sx > R || sy < top || sy > bot) return leave();
    const f = clamp((sx - cx) / 70, -1, 1);
    sp.t = -f * MAX * reach;
    read.textContent = f < 0 ? "swing L" : "swing R";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "filmclip",
  means: "A film strip hanging from its clip on a drying line: the pointer's place along the line swings the strip on its clip.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[254, 211], [150, 190], [205, 140], null],
  mount,
});
