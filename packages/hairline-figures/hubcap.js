/**
 * Hubcap: a wheel standing on its tyre, with a spoked hubcap on its face. The
 * pointer prises the cap: it slides off the rim toward you and turns, further
 * the nearer the pointer is to the wheel. At rest the cap sits a hair proud of
 * the rim, its centre bright.
 */
const { Cam, fit, proj, hull, poly, seg, clamp, spring, stepS, unproj, disposer, mk, pointer, register } = HL;

const R = 30, W = 10, CAP = 21, OUT = 24, SPOKES = 5;
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.1);
  const ext = [[-R, -W, 0], [R, -W, 0], [-R, W + OUT + 6, 0], [R, W + OUT + 6, 0], [-R, -W, 2 * R], [R, W + OUT + 6, 2 * R]];
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const disc = (c, d, r, rot = 0, n = 40) => {
    const u = norm(cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cross(d, u);
    return Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2 + rot; return P(...[0, 1, 2].map((j) => c[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]))); });
  };
  const ax = [0, 1, 0], hub = [0, 0, R];
  const tyre = mk("path", { class: "sil", d: poly(hull(disc([0, -W, R], ax, R, 0, 64).concat(disc([0, W, R], ax, R, 0, 64)))) }, g);
  mk("path", { class: "lo nf", d: poly(disc([0, W, R], ax, R - 7, 0, 64)) }, g);
  mk("path", { class: "nf", d: poly(disc([0, W, R], ax, 3, 0, 20)) }, g);
  const cap = mk("path", { class: "sil" }, g), face = mk("path", { class: "lo nf" }, g);
  const spokes = mk("path", { class: "nf" }, g), boss = mk("path", { class: "sil" }, g);
  void tyre;
  const amt = spring(0.06, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, over = null;

  function draw() {
    if (Math.abs(amt.x - drawn) < 1e-4) return;
    drawn = amt.x;
    const off = OUT * amt.x, rot = amt.x * 1.4, tip = amt.x * 0.35;
    const d = norm([0, Math.cos(tip), Math.sin(tip)]);
    const at = (s) => [hub[0] + d[0] * s, W + 0.5 + off + d[1] * s, hub[2] + d[2] * s];
    cap.setAttribute("d", poly(hull(disc(at(0), d, CAP, rot, 48).concat(disc(at(4), d, CAP - 5, rot, 48)))));
    face.setAttribute("d", poly(disc(at(4), d, CAP - 5, rot, 48)));
    const ring = disc(at(4), d, CAP - 6, rot, SPOKES), inner = disc(at(4), d, 5, rot, SPOKES);
    spokes.setAttribute("d", ring.map((q, i) => seg(inner[i], q)).join(""));
    boss.setAttribute("d", poly(hull(disc(at(4), d, 4.5, rot, 20).concat(disc(at(6), d, 3.5, rot, 20)))));
  }

  const B = register(stage, (dt) => { const m = stepS(amt, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    amt.t = over ? clamp(1.15 - over / 90, 0.35, 1) : 0.06;
    cap.classList.toggle("hi", !!over);
    boss.classList.toggle("hi", !over);
    read.textContent = over ? "off " + Math.round(amt.t * OUT) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], R), r = Math.hypot(x, y - W);
      over = r > 85 ? null : Math.max(r, 1);
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { amt.k = 100 * v; amt.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "hubcap",
  means: "A wheel with a spoked hubcap: the pointer prises the cap, which slides off the rim toward you and turns.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[207, 163], [189, 186], [211, 146], null],
  mount,
});
