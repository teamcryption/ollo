/**
 * Golf buggy: a low floor on four small wheels, a bench seat with its back, a
 * front cowl, and a flat roof on two rear posts and two front struts. The
 * pointer over the buggy folds the roof: it tips back on its rear posts, the
 * front struts swinging up with it, further the nearer the pointer is to the
 * middle. At rest the roof sits closed and the seat back is bright. The
 * slider is how far the roof tips.
 *
 * The pattern: one continuous tilt on a spring; the hit is on the ground plane.
 */
const {
  Cam, facing, fit, hull, open, poly, proj, rrect, run, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, register, solid,
} = HL;

const MAX = 34, REST = 3, R = 6, W = 4, RZ = 40, PXv = -18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-32, -18, 0], [32, 18, 0], [-32, 18, 0], [32, -18, 0], [-22, 0, 44], [10, -17, RZ + 30], [10, 17, RZ + 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const at = (r, z, f) => r.map((q) => (f ? f(q.u, q.v, z) : P(q.u, q.v, z)));
  const tap = (el, foot, top, z0, z1, f) => {
    const inner = rrect(top[0] + 1, top[1] + 1, top[2] - 1, top[3] - 1, Math.max(0.5, top[4] - 1), 4);
    el.sil.setAttribute("d", poly(hull(at(rrect(...foot, 4), z0, f).concat(at(rrect(...top, 4), z1, f)))));
    el.cr.setAttribute("d", open(at(run(inner, front), z1, f)));
  };
  const wheel = (x, y) => {
    const el = solid(g), circle = (off, r) => { const o = []; for (let i = 0; i < 28; i++) { const s = (i / 28) * Math.PI * 2; o.push(P(x + r * Math.cos(s), y + off, R + r * Math.sin(s))); } return o; };
    el.sil.setAttribute("d", poly(hull(circle(-W / 2, R).concat(circle(W / 2, R)))));
    mk("path", { class: "nf lo", d: poly(circle(W / 2, R - 2.5)) }, el.g);
  };
  wheel(-20, -15); wheel(20, -15);
  tap(solid(g), [-30, -14, 30, 14, 5], [-30, -14, 30, 14, 5], 6, 10);
  tap(solid(g), [14, -14, 30, 14, 5], [18, -12, 28, 12, 4], 10, 18);
  tap(solid(g), [-14, -12, 2, 12, 3], [-14, -12, 2, 12, 3], 10, 18);
  const back = solid(g);
  tap(back, [-17, -12, -13, 12, 1.5], [-18, -12, -14, 12, 1.5], 18, 28);
  const posts = mk("path", { class: "nf sil" }, g);
  wheel(-20, 15); wheel(20, 15);
  const roof = solid(g);
  let drawn = NaN;

  function draw(a) {
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a);
    const T = (x, y, z) => { const dx = x - PXv, dz = z - RZ; return P(PXv + dx * c - dz * s, y, RZ + dx * s + dz * c); };
    tap(roof, [-24, -17, 26, 17, 5], [-24, -17, 26, 17, 5], RZ, RZ + 2, T);
    let d = "";
    for (const y of [-12, 12]) d += seg(P(-18, y, 10), P(-18, y, RZ)) + seg(P(22, y, 18), T(22, y, RZ));
    posts.setAttribute("d", d);
  }

  const sp = spring(rad(REST));
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  let last = null;
  function aim(k) {
    const on = k !== null;
    sp.t = rad(on ? REST + (MAX - REST) * amp * (0.55 + 0.45 * k) : REST);
    back.sil.classList.toggle("hi", !on);
    roof.sil.classList.toggle("hi", on);
    read.textContent = on ? Math.round((sp.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      last = Math.abs(x) < 44 && Math.abs(y) < 34 ? 1 - Math.min(1, Math.hypot(x / 32, y / 18)) : null;
      aim(last);
    },
    leave: () => { last = null; aim(null); },
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { amp = v; aim(last); }, destroy: bag.dispose };
}

hairline({
  name: "golfcart",
  means: "A golf buggy: the pointer over it tips the roof back on its rear posts, further near the middle.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[200, 241], [165, 218], [235, 256], null],
  mount,
});
