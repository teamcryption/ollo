/**
 * Teacup ride: one big cup on its saucer, riding a round turntable, a wheel
 * inside the cup and a handle on its side. The pointer's angle round the
 * turntable sets where the cup rides: the cup swings round the platform to
 * it, spinning on its saucer as it goes. At rest the cup sits off to the
 * left, its rim bright. The slider is how far round it swings.
 *
 * The pattern: one part following the pointer's angle (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rrect, ringAt, run, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 46, OR = 22, CZ = 5, REST = 2.2, CR = 15;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
function box(cx, cy, w, d, a, r) {
  const c = Math.cos(a), s = Math.sin(a);
  return rrect(-w / 2, -d / 2, w / 2, d / 2, r, 4).map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, -R, 34]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, R, 64), disc(0, 0, R - 2.5, 64), 0, CZ));
  mk("path", { d: poly(ringAt(P, disc(0, 0, 6, 24), CZ)), class: "nf lo" }, g);
  const saucer = solid(g), hFar = mk("g", {}, g), cup = solid(g);
  const lip = mk("path", { class: "nf lo" }, g), wheel = mk("path", { class: "nf" }, g), spoke = mk("path", { class: "nf lo" }, g);
  const hNear = mk("g", {}, g), handle = solid(hNear);
  cup.sil.classList.add("hi");

  const th = spring(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.002) return;
    last = a;
    const x = Math.cos(a) * OR, y = Math.sin(a) * OR, sp = a * 2.2 + 0.6;
    put(saucer, prism(P, front, disc(x, y, 18, 44), disc(x, y, 15.5, 44), CZ, CZ + 2.5));
    const foot = ringAt(P, disc(x, y, 9, 40), CZ + 2.5), mid = ringAt(P, disc(x, y, 14, 40), CZ + 12), top = ringAt(P, disc(x, y, CR, 44), CZ + 26);
    cup.sil.setAttribute("d", poly(hull(foot.concat(mid, top))));
    cup.cr.setAttribute("d", poly(top));
    lip.setAttribute("d", poly(ringAt(P, disc(x, y, CR - 2, 44), CZ + 26)));
    wheel.setAttribute("d", poly(ringAt(P, disc(x, y, 5, 24), CZ + 22)));
    const s0 = P(x + Math.cos(sp) * 5, y + Math.sin(sp) * 5, CZ + 22), s1 = P(x - Math.cos(sp) * 5, y - Math.sin(sp) * 5, CZ + 22);
    spoke.setAttribute("d", open([s0, s1]));
    const hx = x + Math.cos(sp + 1.4) * (CR + 1), hy = y + Math.sin(sp + 1.4) * (CR + 1);
    put(handle, prism(P, front, box(hx, hy, 6, 3.4, sp + 1.4, 1.4), box(hx, hy, 4, 1.6, sp + 1.4, 0.6), CZ + 10, CZ + 21));
    (hx + hy < x + y ? hFar : hNear).appendChild(handle.g);
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);

  let lastP = null;
  function aim(p) {
    const w = p && unproj(C, p[0], p[1], 0);
    if (!w || Math.hypot(w[0], w[1]) > R + 24 || Math.hypot(w[0], w[1]) < 4) { th.t = REST; read.textContent = "rest"; }
    else {
      const d = wrap(Math.atan2(w[1], w[0]) - REST) * reach;
      th.t = REST + d;
      read.textContent = "a " + Math.round((((th.t * 180) / Math.PI) % 360 + 360) % 360);
    }
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => { lastP = p; aim(p); }, leave: () => { lastP = null; aim(null); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (lastP) aim(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "teacups",
  means: "A teacup ride: the cup swings round its turntable to the pointer's angle, spinning on its saucer as it rides.",
  rules: [1, 3, 5, 8],
  range: [30, 90, 100],
  tour: [[307, 170], [251, 222], [236, 119], null],
  mount,
});
