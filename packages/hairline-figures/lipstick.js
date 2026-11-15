/**
 * Lipstick: an open lipstick case with its cap standing beside it. The
 * pointer's height twists the case: up winds the slanted bullet out of its
 * sleeve, down winds it back in, and a seam on the sleeve turns as it goes.
 * At rest the bullet stands half out, bright. The slider is the reach.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, ringAt, run, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 13, CASE = 26, SR = 10.5, BR = 8.5, BL = 22, REST = 0.45;
const at = (r, x, y, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  const CX = 0, CY = 0, KX = 34, KY = -30;
  fit(C, [[CX - R, CY - R, 0], [CX + R, CY + R, 0], [KX + R, KY - R, 0], [KX - R, KY + R, 0], [CX, CY, CASE + 40 + BL + 4], [KX, KY, 46]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the cap, farther back, painted first
  const cap = solid(g);
  put(cap, prism(P, front, at(R + 0.5, KX, KY), at(R - 1.5, KX, KY), 0, 44));
  mk("path", { d: poly(ringAt(P, at(R - 3, KX, KY), 44)), class: "nf lo" }, g);
  // the case
  const body = mk("g", {}, g);
  put(solid(body), prism(P, front, at(R, CX, CY), at(R - 1.6, CX, CY), 0, CASE));
  mk("path", { d: open(ringAt(P, run(at(R, CX, CY), front), 8)), class: "nf lo" }, body);
  const sleeveG = mk("g", {}, g);
  const sleeve = solid(sleeveG), seam = mk("path", { class: "nf lo" }, sleeveG);
  const bullet = mk("path", { class: "sil" }, sleeveG), tip = mk("path", { class: "nf lo" }, sleeveG);

  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const top = CASE + 4 + f * reach;
    put(sleeve, prism(P, front, at(SR, CX, CY), at(SR - 1.4, CX, CY), CASE, top));
    const ang = f * 5;
    const sx = Math.cos(ang), sy = Math.sin(ang);
    seam.setAttribute("d", sx + sy > -0.3 ? open([P(CX + SR * sx, CY + SR * sy, CASE + 1), P(CX + SR * sx, CY + SR * sy, top - 1)]) : "");
    const b0 = top, pts = [], face = [];
    for (const q of at(BR, CX, CY, 36)) {
      const z1 = b0 + BL * (0.55 + 0.45 * ((q.u - CX) - (q.v - CY)) / (2 * BR));
      pts.push(P(q.u, q.v, b0), P(q.u, q.v, z1));
      face.push(P(q.u, q.v, z1));
    }
    bullet.setAttribute("d", poly(hull(pts)));
    tip.setAttribute("d", poly(face));
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const base = P(CX, CY, CASE)[1];
  function aim(p) {
    sp.t = p ? clamp((base + 10 - p[1]) / 140, 0, 1) : REST;
    bullet.classList.add("hi");
    read.textContent = p ? Math.round(sp.t * 100) + "%" : "rest";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "lipstick",
  means: "An open lipstick beside its cap: the pointer's height twists the case and winds the slanted bullet out or back in.",
  rules: [3, 5, 6, 8],
  range: [24, 40, 40],
  tour: [[117, 77], [117, 235], [235, 194], null],
  mount,
});
