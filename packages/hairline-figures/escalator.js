/**
 * Escalator: a run of steps climbing between two landings, a glass
 * balustrade on each side and a skirt below. The pointer sets the steps
 * running up the incline; the slider is how far they travel. At rest one
 * step is bright, near the foot.
 *
 * The pattern: one part answering the pointer (the step chain).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 120, H = 62, W = 30, PI = 10, FL = 14, N = 12, SPAN = N * PI;
const zt = (x) => (x <= FL ? H : x >= L - FL ? 0 : H * (L - FL - x) / (L - 2 * FL));
const mod = (a, n) => ((a % n) + n) % n;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 1.75);
  const ext = [[-16, 0, H + 26], [L + 16, W, -14], [L + 16, 0, 26], [-16, W, H - 14], [-16, 0, H - 14], [L + 16, W, 26]];
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const panel = (y, lo, hi, cls) => {
    const xs = [-16, 0, FL, L - FL, L, L + 16];
    const top = xs.map((x) => P(x, y, zt(Math.min(Math.max(x, 0), L)) + hi));
    const bot = xs.slice().reverse().map((x) => P(x, y, zt(Math.min(Math.max(x, 0), L)) + lo));
    const pts = top.concat(bot);
    return mk("path", { d: poly(fillet(pts, pts.map(() => 4))), class: cls }, g);
  };
  panel(0, 0, 24, "sil");
  const [ru, iu] = rings(-16, 0, 0, W, 2, 1.2);
  put(solid(g), prism(P, front, ru, iu, H - 8, H));
  const steps = [];
  for (let k = 0; k < N; k++) steps.push(solid(g));
  const [rl, il] = rings(L, 0, L + 16, W, 2, 1.2);
  put(solid(g), prism(P, front, rl, il, -8, 0));
  panel(W, -14, 3, "sil");
  panel(W, 3, 24, "lo nf");
  const tw = tween(0.3);
  function draw(o) {
    const pos = [];
    for (let k = 0; k < N; k++) pos.push({ k, a: mod(k * PI - o, SPAN) - PI / 2 });
    pos.sort((p, q) => p.a - q.a);
    pos.forEach((p, i) => {
      const s = steps[i];
      s.sil.classList.toggle("hi", p.k === 10);
      const x0 = Math.max(p.a, 0), x1 = Math.min(p.a + PI - 1, L);
      if (x1 - x0 < 2) { s.sil.setAttribute("d", ""); s.cr.setAttribute("d", ""); return; }
      const top = zt(x0), z0 = Math.min(top - 3, zt(x1 + 1));
      const [r, i2] = rings(x0, 2, x1, W - 2, 1.2, 0.8);
      put(s, prism(P, front, r, i2, z0, top));
    });
  }
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const v = tval(tw, now);
    if (v !== last) { last = v; draw(v * PI); }
    return !tdone(tw, now);
  });
  bag.add(B.unregister);

  const pts = ext.map((w) => P(...w));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const hit = ([sx, sy]) => (sx < bx[0] - 6 || sx > bx[1] + 6 || sy < bx[2] - 6 || sy > bx[3] + 6 ? -1 : 0);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? 0.3 : 0.3 + 3.5 * amp, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "up " + Math.round(3.5 * amp * 10) / 10;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "escalator",
  means: "An escalator between two landings: the pointer sets its steps running up the incline, the bright step riding with them.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[246, 230], [200, 172], [158, 115], null],
  mount,
});
