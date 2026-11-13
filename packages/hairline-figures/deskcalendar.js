/**
 * Desk calendar: an A-frame stand with eight month pages hung from a row of
 * wire rings along its ridge, each page with a month grid and an index tab
 * stepped along its foot, so every page shows one tab. The pointer picks a
 * page by where it falls along the stack: that page flips up over the rings
 * and stands, the pages in front of it flip on over to the back, the one
 * nearest still in the air, and the pages behind it lift off the stand a
 * little, staggered from it. At rest the front page is lifted, about to be
 * turned, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), hinged. Tweens on each
 * page's angle; the pick is read on the plane of the resting stack, which
 * never moves.
 */
const {
  Cam, clamp, fillet, fit, hull, poly, proj, rad, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const N = 8, PW = 88, PL = 40, TH = 5, TW = 9, STEP = 10.5, TK = 0.9, PX0 = 4, SW = PW + 8;
const ZR = 46, B = 20, ZH = ZR + 1.2, UPA = 165, FAV = 0;
const stackA = (i) => 24.8 + (N - 1 - i) * 0.7, backA = (i) => 335.4 - i * 0.6;
const restA = (i) => (i === FAV ? 40 : stackA(i));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  const L = PL + TH;
  fit(C, [[0, -B, 0], [SW, B, 0], [SW, -B, 0], [0, B, 0], [PX0, 0, ZH + L], [PX0 + PW, 0, ZH + L], [PX0, -L, ZH], [PX0 + PW, L * 0.8, ZH]], 200, 172);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // the stand: a tent of two slopes meeting at the ridge, its silhouette and the bevel of its near end
  const tent = fillet([[-B, 0], [B, 0], [1.6, ZR], [-1.6, ZR]], [2, 2, 1.5, 1.5]);
  const bevel = fillet([[-B + 3.4, 1.4], [B - 3.4, 1.4], [0.9, ZR - 2.6], [-0.9, ZR - 2.6]], [1.4, 1.4, 1, 1]);
  const stand = mk("g", {}, g);
  mk("path", { d: poly(hull(tent.map(([y, z]) => P(0, y, z)).concat(tent.map(([y, z]) => P(SW, y, z))))), class: "sil" }, stand);
  mk("path", { d: poly(bevel.map(([y, z]) => P(SW, y, z))), class: "nf lo" }, stand);
  mk("path", { d: seg(P(1.5, B - 0.6, 1.4), P(SW - 1.5, B - 0.6, 1.4)), class: "nf lo" }, stand);

  const pages = [];
  for (let i = 0; i < N; i++) {
    const t = 3 + i * STEP;
    const shape = fillet(
      [[0, 1.5], [PW, 1.5], [PW, PL], [t + TW, PL], [t + TW, L], [t, L], [t, PL], [0, PL]],
      [1, 1, 2, 1.2, 1.6, 1.6, 1.2, 2],
    );
    const grp = mk("g", {}, g);
    const under = mk("path", { class: "lo" }, grp), over = mk("path", { class: "sil" }, grp);
    const head = mk("path", { class: "nf" }, grp), grid = mk("path", { class: "nf lo" }, grp);
    pages.push({ i, t, shape, grp, under, over, head, grid, a: tween(restA(i)), last: NaN });
  }
  // the wire rings over the ridge, through every page's holes
  const wire = mk("path", { class: "nf" }, g);
  let w = "";
  for (let k = 0; k < 9; k++) {
    const x = PX0 + 6 + k * ((PW - 12) / 8), pts = [];
    for (let s = 0; s < 14; s++) { const q = (s / 14) * Math.PI * 2; pts.push(P(x, 2.4 * Math.cos(q), ZH + 0.4 + 2.4 * Math.sin(q))); }
    w += poly(pts);
  }
  wire.setAttribute("d", w);

  function draw(p, a) {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (u, v, o) => P(PX0 + u, v * s - o * c, ZH - v * c - o * s);
    const faces = c + 0.816 * s > 0; // the printed side turned toward the viewer
    const near = faces ? 0 : -TK, far = faces ? -TK : 0;
    p.under.setAttribute("d", poly(p.shape.map(([u, v]) => at(u, v, far))));
    p.over.setAttribute("d", poly(p.shape.map(([u, v]) => at(u, v, near))));
    if (!faces) { p.head.setAttribute("d", ""); p.grid.setAttribute("d", ""); return; }
    p.head.setAttribute("d", seg(at(6, 10, 0), at(PW - 6, 10, 0)));
    let d = "";
    for (let r = 0; r < 5; r++) d += seg(at(6, 14 + r * 5.6, 0), at(PW - 6, 14 + r * 5.6, 0));
    for (let k = 1; k < 7; k++) d += seg(at(6 + k * (PW - 12) / 7, 14, 0), at(6 + k * (PW - 12) / 7, 36.4, 0));
    p.grid.setAttribute("d", d);
  }

  // paint by how far each page leans toward the viewer: the back stack, the stand, then the front
  let painted = "";
  const B2 = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pages) {
      const a = tval(p.a, now);
      if (a !== p.last) { draw(p, a); p.last = a; }
      if (!tdone(p.a, now)) moving = true;
    }
    const items = pages.map((p) => ({ el: p.grp, k: Math.sin(rad(p.last)) + p.i * 1e-4 })).concat([{ el: stand, k: 0 }]);
    items.sort((x, y) => x.k - y.k);
    const key = items.map((it) => it.k.toFixed(3)).join();
    if (key !== painted) { painted = key; for (const it of items) g.appendChild(it.el); g.appendChild(wire); }
    return moving;
  });
  bag.add(B2.unregister);

  /** The page whose tab column holds the point, read on the plane of the resting stack, which never moves; -1 off it. */
  const A0 = stackA(N / 2), sa = Math.sin(rad(A0)), ca = Math.cos(rad(A0));
  const o = P(PX0, 0, ZH), pu = P(PX0 + 1, 0, ZH), pv = P(PX0, sa, ZH - ca);
  const eu = [pu[0] - o[0], pu[1] - o[1]], ev = [pv[0] - o[0], pv[1] - o[1]], det = eu[0] * ev[1] - eu[1] * ev[0];
  function hit([x, y]) {
    const qx = x - o[0], qy = y - o[1];
    const u = (qx * ev[1] - qy * ev[0]) / det, v = (eu[0] * qy - eu[1] * qx) / det;
    if (u < -2 || u > PW + 2 || v < 0 || v > L + 4) return -1;
    return clamp(Math.round((u - 3 - TW / 2) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pages.forEach((p, i) => {
      const d = Math.abs(i - a);
      let th = restA(i);
      if (a >= 0) th = i === a ? UPA : i < a ? (d === 1 ? 255 : d === 2 ? 308 : backA(i)) : stackA(i) + (d === 1 ? 16 : d === 2 ? 6 : d === 3 ? 2 : 0);
      tset(p.a, th, now, from < 0 ? 0 : Math.abs(i - from) * stag);
      p.over.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "page " + (a + 1);
    B2.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "deskcalendar",
  means: "A desk flip calendar: the page under the pointer flips up over the rings, the ones in front flip to the back, the ones behind lift.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[109, 223], [177, 257], [228, 282], null],
  mount,
});
