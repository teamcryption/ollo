/**
 * Sewing machine: a bed, a pillar with a handwheel, an arm and a head with
 * the needle bar, a spool on top, and a strip of fabric under the needle.
 * The pointer's x is how far the seam has run: the fabric slides through on
 * a spring, the needle bobs with it, and the stitches it has sewn stay on
 * the cloth. At rest the seam is 40% sewn. The slider is the spring's give.
 *
 * The pattern: a continuous input (terrain's spring) on one value.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 92, BY = 32, BZ = 8, NX = 16, NY = 16, FW = 11, FL = 80, ST = 6, REST = 0.4;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, -30, 0], [BX + 4, BY + 30, 0], [BX, 0, 0], [0, BY + 30, 0], [NX, NY, 60], [BX, NY, 60]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b, par = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };

  box(0, 0, BX, BY, 0, BZ, 4, 1.4);
  mk("path", { d: poly(ringAt(P, disc(NX, NY, 2.2, 16), BZ)), class: "nf lo" }, g);
  const cloth = mk("g", {}, g);
  const fab = solid(cloth), stitches = mk("path", { class: "nf lo" }, cloth);
  // the pillar, then the arm and head over the bed, then the needle
  box(66, 6, 86, 26, BZ, 46, 4, 1.4);
  const wheel = (x) => { const pts = [];
    for (const dx of [0, 3]) for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; pts.push(P(x + dx, 16 + 10 * Math.cos(t), 30 + 10 * Math.sin(t))); }
    return pts; };
  mk("path", { d: poly(hull(wheel(86))), class: "sil" }, g);
  const rim = Array.from({ length: 28 }, (_, i) => { const t = (i / 28) * Math.PI * 2; return P(89, 16 + 6 * Math.cos(t), 30 + 6 * Math.sin(t)); });
  mk("path", { d: poly(rim), class: "nf lo" }, g);
  box(8, 9, 82, 23, 38, 50, 5, 1.4);
  box(6, 7, 26, 25, 26, 50, 5, 1.4);
  const sp = disc(56, 16, 4.5);
  mk("path", { d: poly(hull(ringAt(P, sp, 50).concat(ringAt(P, sp, 58)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(56, 16, 1.2, 12), 58)), class: "nf lo" }, g);
  const bar = mk("path", { class: "nf sil" }, g), foot = mk("path", { class: "nf" }, g), needle = mk("path", { class: "nf sil hi" }, g);
  const eye = mk("circle", { r: 1.7, class: "dot" }, g);

  const f = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const off = v * (FL - 24), y0 = -FL / 2 + 26 + off;
    const [o, i] = rings(NX - FW, y0 - FL / 2, NX + FW, y0 + FL / 2, 1.5, 0.6);
    put(fab, prism(P, front, o, i, BZ, BZ + 0.8));
    let d = "";
    for (let y = y0 - FL / 2 + 4; y < NY - 1; y += ST) if (y + ST * 0.6 < NY) d += seg(P(NX, y, BZ + 0.9), P(NX, y + ST * 0.6, BZ + 0.9));
    stitches.setAttribute("d", d);
    const zt = BZ + 1.5 + 9 * (0.5 - 0.5 * Math.cos((off / ST) * Math.PI * 2));
    bar.setAttribute("d", poly(hull(ringAt(P, disc(NX, NY, 1.6, 12), zt + 9).concat(ringAt(P, disc(NX, NY, 1.6, 12), 26)))));
    const [fo, fi] = rings(NX - 4, NY - 2, NX + 4, NY + 5, 1.5, 0.6);
    put({ sil: foot, cr: foot }, { sil: prism(P, front, fo, fi, BZ + 0.9, BZ + 2.2).sil, crease: "" });
    needle.setAttribute("d", seg(P(NX, NY, zt), P(NX, NY, zt + 9)));
    const e = P(NX, NY, zt + 2.5);
    eye.setAttribute("cx", e[0]); eye.setAttribute("cy", e[1]);
    read.textContent = "stitch " + Math.round(v * 100) + "%";
  }
  draw(REST);
  read.textContent = "rest";

  const B = register(stage, (dt) => { const m = stepS(f, dt); draw(f.x); if (!m && f.t === REST) read.textContent = "rest"; return m; });
  bag.add(B.unregister);
  const x0 = P(0, BY, 0)[0], x1 = P(BX, BY, 0)[0];
  bag.add(pointer(stage, {
    move: ([sx]) => { f.t = clamp((sx - x0) / (x1 - x0), 0, 1); B.wake(); },
    leave: () => { f.t = REST; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { f.k = 100 * v; f.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "sewingmachine",
  means: "A sewing machine: the pointer's x runs the seam, the fabric slides under the needle and the needle bobs as it stitches.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.6],
  tour: [[124, 177], [200, 215], [273, 251], null],
  mount,
});
