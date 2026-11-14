/**
 * Tram stop: a platform kerb with a shelter, its back wall, bench and roof,
 * and a tall pole carrying a flag sign. The sign swings round its pole to
 * face the pointer, as if turning to the rider walking up. At rest it hangs
 * at a slant, bright. The slider caps how far it may swing.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, rrect, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 104, PY = 22, Z0 = 4, REST = -0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let cap = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -4, 0], [124, -4, 96], [124, 40, 0], [-6, 40, 54], [PX - 40, PY + 40, 98], [PX + 40, PY - 40, 98], [PX, PY - 40, 98]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-6, -4, 124, 40, 4, 1.6, 0, Z0);
  box(2, 0, 82, 3, 1.2, 0.8, Z0, 50);
  box(10, 6, 74, 14, 2, 1, 14, 16);
  box(-2, -4, 86, 32, 3, 1.4, 50, 53);
  const dots = mk("path", { class: "lo nf" }, g);
  let dd = "";
  for (let x = 4; x < 120; x += 8) dd += open([P(x, 36, Z0), P(x + 3, 36, Z0)]);
  dots.setAttribute("d", dd);
  const pole = solid(mk("g", {}, g)), blade = solid(mk("g", {}, g));
  const [pr, pi] = rings(PX - 1.6, PY - 1.6, PX + 1.6, PY + 1.6, 1.6, 0.6);
  put(pole, prism(P, front, pr, pi, Z0, 98));
  const base = rrect(2, -1.5, 40, 1.5, 1.5, 4), inner = rrect(3, -0.8, 39, 0.8, 0.8, 4);
  const turn = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: PX + q.u * c - q.v * s, v: PY + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    put(blade, prism(P, front, turn(base, a), turn(inner, a), 56, 96));
    const near = Math.cos(a) + Math.sin(a) > 0;
    if (near) pole.g.after(blade.g); else blade.g.after(pole.g);
    blade.sil.classList.add("hi");
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    let a = Math.atan2(y - PY, x - PX);
    while (a - REST > Math.PI) a -= 2 * Math.PI;
    while (a - REST < -Math.PI) a += 2 * Math.PI;
    const lim = (cap * Math.PI) / 180;
    sp.t = clamp(a, REST - lim, REST + lim);
    read.textContent = Math.round((((sp.t * 180) / Math.PI) % 360 + 360) % 360) + "°";
    B.wake();
  }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { cap = v; }, destroy: bag.dispose };
}

hairline({
  name: "tramstop",
  means: "A tram stop shelter with a flag sign on a tall pole: the sign swings round its pole to face the pointer.",
  rules: [1, 3, 5, 8],
  range: [30, 150, 180],
  tour: [[79, 188], [103, 225], [314, 256], null],
  mount,
});
