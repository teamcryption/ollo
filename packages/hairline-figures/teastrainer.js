/**
 * Tea strainer: a round mesh bowl on a long flat handle, hung by the hook at
 * the handle's end. The pointer over it swings the bowl up and out about the
 * hook. At rest it hangs a little off true, the rim bright. The slider is how
 * far it swings.
 *
 * The pattern: one part swinging about a fixed pivot.
 */
const { Cam, circ, fit, hull, poly, proj, rad, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

const disc = (x, y, r, n = 32) => circ(r, n).map((q) => [q.u + x, q.v + y]);
const HX = -60, HZ = 30, R = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[-66, -24, 0], [24, 24, 0], [24, -24, 0], [-66, 24, 0], [-60, 0, 36], [10, 0, 70], [-14, 0, 96]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  mk("path", { d: poly(hull(disc(HX, 0, 4, 16).map(([x, y]) => P(x, y, 0)).concat(disc(HX, 0, 4, 16).map(([x, y]) => P(x, y, HZ + 4))))), class: "sil" }, g);
  const handle = solid(g), bowl = solid(g), rim = mk("path", { class: "nf sil hi" }, g);
  const lerp = (x, y, t) => x + (y - x) * t;

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(lerp(-6, 40 * amp, t)), ca = Math.cos(a), sa = Math.sin(a);
    const W = ([x, y], z) => { const dx = x - HX, dz = z - HZ; return P(HX + dx * ca - dz * sa, y, HZ + dx * sa + dz * ca); };
    const pts = [];
    for (let i = 0; i <= 6; i++) { const u = (i / 6) * (Math.PI / 2); pts.push(...disc(0, 0, R * Math.cos(u), 28).map((p) => W(p, HZ - R * 0.8 * Math.sin(u)))); }
    bowl.sil.setAttribute("d", poly(hull(pts)));
    bowl.cr.setAttribute("d", poly(disc(0, 0, R - 3, 32).map((p) => W(p, HZ - 2))));
    rim.setAttribute("d", poly(disc(0, 0, R, 36).map((p) => W(p, HZ))));
    const hp = [[HX, -2.5], [-R + 2, -3.5], [-R + 2, 3.5], [HX, 2.5]];
    handle.sil.setAttribute("d", poly(hull(hp.map((p) => W(p, HZ)).concat(hp.map((p) => W(p, HZ + 1.6))))));
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(-20, 0, HZ);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "swing" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 150 && Math.abs(sy - mid[1]) < 110), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "teastrainer",
  means: "A tea strainer hung by the hook on its handle: the pointer swings the mesh bowl up and out about the hook.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1],
  tour: [[247, 190], [110, 199], [300, 214], null],
  mount,
});
