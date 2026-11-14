/**
 * Spirit level: a long aluminium level balanced on a block, a vial set in its
 * top with one bubble. The pointer is where the hand presses: the beam tilts on
 * its own spring toward that end, and the bubble runs up the vial to the high
 * end. At rest the level sits a little off true, the vial bright. The slider is
 * how far the beam can tip.
 *
 * The pattern: a continuous tilt (a spring on one angle); the hit is the
 * ground plane, which never moves.
 */
const {
  Cam, fit, proj, unproj, facing, rrect, rings, prism, ringAt, run, hull, poly, open,
  clamp, rad, spring, stepS, disposer, mk, solid, put, place, pointer, register,
} = HL;

const L = 66, W = 7, H = 9, PIV = 20, MAX = 11, REST = 2.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.65);
  const ext = [];
  for (const s of [-1, 1]) for (const u of [-L, L]) for (const v of [-W, W]) {
    const z = PIV + u * Math.sin(rad(MAX * 1.5 * s));
    ext.push([u, v, z], [u, v, z + H], [u, v, 0]);
  }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  put(solid(g), prism(P, front, ...rings(-18, -14, 18, 14, 3, 1.4), 0, 2));
  put(solid(g), prism(P, front, ...rings(-5, -9, 5, 9, 2, 1), 2, PIV - 1));

  const foot = rrect(-L, -W, L, W, 2.4, 4), inner = rrect(-L + 1.2, -W + 1.2, L - 1.2, W - 1.2, 1.4, 4);
  const vial = rrect(-16, -2.6, 16, 2.6, 2.6, 6);
  const beam = solid(g);
  const win = mk("path", { class: "nf hi" }, g);
  const ticks = mk("path", { class: "nf lo" }, g);
  const bub = mk("ellipse", { class: "dot", rx: 3.2, ry: 1.7 }, g);

  const sp = spring(REST);
  let drawn = NaN;
  const at = (ring, z0, s) => ring.map((q) => { const p = P(q.u * Math.cos(Math.asin(s)), q.v, z0 + q.u * s); return p; });

  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const s = Math.sin(rad(sp.x)), c = Math.cos(rad(sp.x));
    const bot = at(foot, PIV, s), top = at(foot, PIV + H, s);
    const keep = run(inner, front);
    put(beam, { sil: poly(hull(bot.concat(top))), crease: open(at(keep, PIV + H, s)) });
    win.setAttribute("d", poly(at(vial, PIV + H + 0.01, s)));
    const tk = [-5, 5].map((u) => [P(u * c, -2.6, PIV + H + u * s), P(u * c, 2.6, PIV + H + u * s)]);
    ticks.setAttribute("d", tk.map(([a, b]) => "M" + a + "L" + b).join(""));
    const bu = clamp((sp.x / MAX) * 12, -12, 12);
    place(bub, P(bu * c, 0, PIV + H + bu * s + 0.3));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(over) {
    const lim = clamp(MAX * value, 3, MAX * 1.5);
    sp.t = over == null ? REST : clamp((over / L) * lim, -lim, lim);
    beam.sil.classList.toggle("hi", over != null);
    win.classList.toggle("hi", over == null);
    read.textContent = over == null ? "rest" : (sp.t >= 0 ? "+" : "") + sp.t.toFixed(1) + "°";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], PIV);
      set(Math.abs(x) > L + 18 || Math.abs(y) > 34 ? null : clamp(x, -L, L));
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  draw();
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "plumbline",
  means: "A spirit level balanced on a block: it tilts toward the end the pointer presses, and the bubble runs to the high end.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.5],
  tour: [[312, 231], [88, 119], [256, 203], null],
  mount,
});
