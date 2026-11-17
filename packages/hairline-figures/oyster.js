/**
 * Oyster knife: a short stout blade with a guard and a fat handle, its tip
 * worked into the hinge of a closed oyster. The pointer over it twists the
 * knife, and the top shell pops open about the hinge. At rest the shell is
 * just ajar, the blade bright. The slider is how far the shell opens.
 *
 * The pattern: one part tilting about a fixed hinge.
 */
const { Cam, fit, hull, poly, proj, rad, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

// a teardrop plan, narrow at the hinge (-x)
const shell = (a, b, n = 34) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI, x = a * Math.cos(t); o.push([x, b * Math.sin(t) * (0.45 + 0.55 * (x + a) / (2 * a))]); } return o; };
const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const HX = -34, HZ = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-80, -10, 0], [36, -26, 0], [36, 26, 0], [-34, 18, 0], [-10, 0, 52], [-80, 0, 30]], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const lerp = (x, y, t) => x + (y - x) * t;

  // the knife: handle and guard behind the hinge, blade into it
  const kg = mk("g", {}, g);
  const handle = solid(kg), guard = solid(kg), blade = solid(kg);
  blade.sil.classList.add("hi");
  // the oyster: cupped lower shell, then the lid
  const low = solid(g), lid = solid(g);
  const sh = shell(36, 26), shIn = shell(32, 22);
  low.sil.setAttribute("d", poly(hull(shell(26, 18).map(([x, y]) => P(x, y, 0)).concat(sh.map(([x, y]) => P(x, y, HZ))))));
  low.cr.setAttribute("d", poly(shIn.map(([x, y]) => P(x, y, HZ))));

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(lerp(5, 46 * amp, t)), ca = Math.cos(a), sa = Math.sin(a);
    const L = ([x, y], z) => { const dx = x - HX, dz = z - HZ; return P(HX + dx * ca - dz * sa, y, HZ + dx * sa + dz * ca); };
    lid.sil.setAttribute("d", poly(hull(sh.map((p) => L(p, HZ)).concat(shell(30, 20).map((p) => L(p, HZ + 6))))));
    lid.cr.setAttribute("d", poly(shell(25, 15).map((p) => L(p, HZ + 5.6))));
    // the knife rolls about its own axis (x) as it twists the hinge
    const r = rad(lerp(0, 70, t)), cr = Math.cos(r), sr = Math.sin(r);
    const K = ([x, y], z) => { const dz = z - HZ; return P(x, y * cr - dz * sr, HZ + y * sr + dz * cr); };
    const S = (pl, z0, z1) => poly(hull(pl.map((p) => K(p, z0)).concat(pl.map((p) => K(p, z1)))));
    blade.sil.setAttribute("d", S([[-50, -5], [-24, -3.5], [-18, 0], [-24, 3.5], [-50, 5]], HZ - 0.8, HZ + 0.8));
    guard.sil.setAttribute("d", S(box(-54, -10, -50, 10), HZ - 4, HZ + 4));
    handle.sil.setAttribute("d", S(box(-82, -6, -54, 6), HZ - 5, HZ + 5));
    handle.cr.setAttribute("d", poly([K([-80, 0], HZ + 5), K([-56, 0], HZ + 5)]));
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
    read.textContent = v ? "shuck" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 150 && Math.abs(sy - mid[1]) < 100), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "oyster",
  means: "An oyster knife worked into a shell's hinge: the pointer twists the blade and the top shell pops open.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1],
  tour: [[217, 190], [110, 150], [262, 214], null],
  mount,
});
