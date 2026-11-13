/**
 * Kettlebells: a two-tier rack, the upper shelf set back and higher, holding
 * seven bells of different sizes, each a round body with an arched handle.
 * The pointer picks a bell by where it sits: it lifts off its shelf, and the
 * bells beside it rock up a little, staggered from it. At rest one bell is
 * half lifted, bright. The slider is the stagger.
 *
 * The pattern: stepped parts; each bell is tested on the plane through its
 * own resting middle, and the one nearest the pointer wins.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const UP = [6, 7.5, 6.5], LO = [9, 7.5, 10.5, 8], FAV = 1, LIFT = 18, GAP = 4;
const ZU = 28, ZL = 4, YU = -17, YL = 6, W = 92;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function row(rs, y, z) {
  const tot = rs.reduce((s, r) => s + 2 * r, 0) + GAP * (rs.length - 1);
  let x = (W - tot) / 2;
  return rs.map((r) => { const b = { r, x: x + r, y, z }; x += 2 * r + GAP; return b; });
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-4, -28, 0], [W + 4, 18, 0], [W + 4, -28, 0], [-4, 18, 0], [W / 2, YU, ZU + 16 + LIFT], [10, YU, ZU + 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [ri, ii] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, ri, ii, z0, z1)); };
  box(-4, -28, W + 4, 18, 3, 1.3, 0, ZL - 1);
  box(-2, -26, 4, -8, 1.5, 0.6, ZL - 1, ZU - 3);
  box(W - 4, -26, W + 2, -8, 1.5, 0.6, ZL - 1, ZU - 3);
  box(-4, -28, W + 4, -6, 2.5, 1.1, ZU - 3, ZU);

  const bells = row(UP, YU, ZU).concat(row(LO, YL, ZL)).map((b, k) => {
    const grp = mk("g", {}, g);
    if (k === UP.length) box(-4, -2, W + 4, 16, 2.5, 1.1, ZL - 1, ZL);
    g.appendChild(grp);
    const arch = mk("path", { class: "sil" }, grp), body = solid(grp);
    return { ...b, k, grp, arch, body, h: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN };
  });

  function draw(b, h) {
    if (h === b.last) return;
    b.last = h;
    const z0 = b.z + h, R = b.r, pts = [];
    for (let i = 0; i <= 8; i++) {
      const s = -0.78 + (i / 8) * 1.62, rr = R * Math.sqrt(Math.max(0.02, 1 - s * s));
      pts.push(...ringAt(P, disc(b.x, b.y, rr), z0 + R * (s + 0.78)));
    }
    b.body.sil.setAttribute("d", poly(hull(pts)));
    b.body.cr.setAttribute("d", poly(ringAt(P, disc(b.x, b.y, R * 0.62), z0 + 0.6)));
    const top = z0 + R * 1.5, out = [], inn = [];
    for (let i = 0; i <= 12; i++) {
      const t = (i / 12) * Math.PI, c = Math.cos(t), s = Math.sin(t);
      out.push(P(b.x + R * 0.72 * c, b.y, top + R * 1.0 * s));
      inn.unshift(P(b.x + R * 0.48 * c, b.y, top + R * 0.72 * s));
    }
    b.arch.setAttribute("d", poly(out.concat(inn)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bells) { draw(b, tval(b.h, now)); if (!tdone(b.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** Each bell is tested on the plane through its resting middle; the nearest, in its own radii, wins. */
  function hit([sx, sy]) {
    let best = -1, bd = 1.5;
    for (const b of bells) {
      const [x, y] = unproj(C, sx, sy, b.z + b.r);
      const d = Math.hypot(x - b.x, y - b.y) / (b.r + 3);
      if (d < bd) { bd = d; best = b.k; }
    }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bells.forEach((b, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : d === 0 ? LIFT : d === 1 ? 3 : 0;
      tset(b.h, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      b.body.sil.classList.toggle("hi", on); b.arch.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "bell " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kettlebells",
  means: "Seven kettlebells on a two-tier rack: the bell under the pointer lifts off its shelf, and its neighbours rock up a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[186, 123], [138, 170], [232, 219], null],
  mount,
});
