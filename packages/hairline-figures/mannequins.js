/**
 * Mannequins: three dress forms in a shop window, each a shaped torso with a
 * neck cap on a pole and a round base, with a seam down its front. The
 * pointer is what the window turns to: every form swivels on its own spring
 * to face it, and the nearest one is bright. At rest the forms face the
 * street, each a little askew, one bright. The slider is how quickly they
 * follow.
 *
 * The pattern: a continuous aim (officechairs); the hit is on the floor's
 * plane, which never moves.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, prism, proj, rings, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [0, 34, 68], YS = [10, 0, 12], SKEW = [-28, 10, 34], FAV = 1, Z0 = 30;
const LV = [[0, 9, 7], [8, 7.6, 5.6], [13, 7, 5.2], [20, 9.6, 7], [27, 10, 6], [30, 6.5, 4]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const ell = (rx, ry, a, cx, cy, n = 28) => {
  const c = Math.cos(a), s = Math.sin(a);
  return circ(1, n).map((q) => {
    const u = q.u * rx, v = q.v * ry, nu0 = q.u / rx, nv0 = q.v / ry, l = Math.hypot(nu0, nv0);
    return { u: cx + u * c - v * s, v: cy + u * s + v * c, nu: (nu0 * c - nv0 * s) / l, nv: (nu0 * s + nv0 * c) / l };
  });
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-16, -14, -3], [84, 26, -3], [84, -14, -3], [-16, 26, -3], [0, 10, Z0 + 36], [68, 12, Z0 + 36]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-16, -14, 84, 26, 6, 1.6); put(solid(g), prism(P, front, r, i, -3, 0)); }

  const forms = XS.map((cx, k) => {
    const cy = YS[k], rest = Math.PI / 4 + SKEW[k] * (Math.PI / 180);
    return { k, cx, cy, rest, sp: spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN };
  });
  forms.slice().sort((p, q) => p.cx + p.cy - (q.cx + q.cy)).forEach((f) => {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(f.cx, f.cy, 7, 32), disc(f.cx, f.cy, 5.8, 32), 0, 2));
    put(solid(grp), prism(P, front, disc(f.cx, f.cy, 0.9, 12), null, 2, Z0 + 1));
    f.hips = solid(grp);
    f.torso = solid(grp);
    f.seam = mk("path", { class: "nf lo" }, f.torso.g);
    f.neck = solid(grp);
  });

  function draw(f) {
    const a = f.sp.x;
    if (Math.abs(a - f.drawn) < 1e-4) return;
    f.drawn = a;
    const R = LV.map(([z, rx, ry]) => ringAt(P, ell(ry, rx, a, f.cx, f.cy), Z0 + z));
    f.hips.sil.setAttribute("d", poly(hull([].concat(R[0], R[1], R[2]))));
    const pts = [].concat(R[2], R[3], R[4], R[5]);
    const top = ell(LV[5][2] - 0.9, LV[5][1] - 0.9, a, f.cx, f.cy);
    put(f.torso, { sil: poly(hull(pts)), crease: open(ringAt(P, top, Z0 + 30)) });
    const c = Math.cos(a), s = Math.sin(a);
    f.seam.setAttribute("d", c + s > -0.2 ? open(LV.slice(0, 5).map(([z, , ry]) => P(f.cx + c * ry, f.cy + s * ry, Z0 + z))) : "");
    put(f.neck, prism(P, front, disc(f.cx, f.cy, 2.4, 16), disc(f.cx, f.cy, 1.6, 16), Z0 + 30, Z0 + 35));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const f of forms) { if (stepS(f.sp, dt)) m = true; draw(f); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const f of forms) {
      if (over) {
        const d = Math.hypot(over[0] - f.cx, over[1] - f.cy);
        if (d < bd) { bd = d; near = f; }
        const aim = d < 4 ? f.sp.t : Math.atan2(over[1] - f.cy, over[0] - f.cx);
        f.sp.t = f.sp.t + wrap(aim - f.sp.t);
      } else f.sp.t = f.sp.t + wrap(f.rest - f.sp.t);
    }
    for (const f of forms) { const on = over ? f === near : f.k === FAV; f.torso.sil.classList.toggle("hi", on); f.hips.sil.classList.toggle("hi", on); }
    read.textContent = near ? "form " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = x < -40 || x > 110 || y < -50 || y > 60 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const f of forms) { f.sp.k = 100 * v; f.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "mannequins",
  means: "Three dress forms in a shop window: every form turns to face the pointer, and the nearest one is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[76, 190], [211, 225], [324, 243], null],
  mount,
});
