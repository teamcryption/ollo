/**
 * Donut box: an open bakery box, its lid standing up behind, holding six
 * ring donuts in two rows of three, each with a wavy icing edge and a few
 * sprinkles. The pointer picks a donut: it lifts out of the box, the donuts
 * beside it lift a little, staggered from it. At rest one donut sits half
 * out, bright. The slider is the stagger.
 *
 * The pattern: one of many on a grid (depositboxes); each donut tests the
 * pointer on its own rest top, so a raised one never hides the one behind.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, ringAt, run, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 84, BY = 56, BH = 9, RC = 7.4, RT = 3.6, LIFT = 22, LID = 46, TILT = 0.3, HIT = 12;
const REST = [[0, 1.5, 0], [0.5, 9, 0]], FAV = [1, 1];
const disc = (x, y, r, n = 28) => circ(Math.max(r, 0.05), n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const SPR = [[0.3, 8.8, 1.2], [1.4, 9.4, 0.4], [2.6, 8.4, 2.2], [3.7, 9.6, 1.0], [4.9, 8.6, 0.2], [5.8, 9.2, 1.7]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.35);
  const lidTop = (x) => [x, -Math.sin(TILT) * LID, BH + Math.cos(TILT) * LID];
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, 0], [0, BY, 0], lidTop(0), lidTop(BX), [14, 14, BH + LIFT + 8]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the lid, open behind the box: a rounded flap with a fold line and its thickness
  const flap = fillet([[0, 0], [BX, 0], [BX, LID], [0, LID]], [0.5, 0.5, 5, 5], 4);
  const onLid = ([x, h], dy = 0) => P(x, -Math.sin(TILT) * h + dy, BH + Math.cos(TILT) * h);
  const lid = mk("g", {}, g);
  mk("path", { class: "sil", d: poly(flap.map((p) => onLid(p, -1.2)).concat(flap.map((p) => onLid(p)))) }, lid);
  mk("path", { class: "nf lo", d: open(flap.map((p) => onLid(p))) + seg(onLid([4, 6]), onLid([BX - 4, 6])) }, lid);

  const [o, i] = rings(0, 0, BX, BY, 3, 1.4);
  const box = solid(g);
  put(box, prism(P, front, o, i, 0, BH));
  mk("path", { class: "nf lo", d: poly(ringAt(P, i, BH)) }, box.g);

  const dn = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) dn.push({ r, c, x: 15 + c * 27, y: 15 + r * 26, z: tween(REST[r][c]), last: NaN });
  dn.slice().sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((d) => {
    const grp = mk("g", {}, g);
    d.sil = mk("path", { class: "sil" }, grp);
    d.cr = mk("path", { class: "nf lo" }, grp);
  });
  // the box's near walls again, over the donuts' feet
  const nr = run(o, front), wall = mk("g", {}, g);
  mk("path", { class: "fo", d: poly(ringAt(P, nr, 0).concat(ringAt(P, nr, BH).reverse())) }, wall);
  mk("path", { class: "nf lo", d: open(ringAt(P, nr, BH)) }, wall);
  mk("path", { class: "nf sil", d: open(ringAt(P, nr, 0)) }, wall);

  function draw(d, lift) {
    if (Math.abs(lift - d.last) < 1e-3) return;
    d.last = lift;
    const z = 1 + lift, { x, y } = d, top = z + 2 * RT;
    const body = [];
    for (let k = 0; k <= 8; k++) { const a = (k / 8) * Math.PI - Math.PI / 2; body.push(...ringAt(P, disc(x, y, RC + RT * Math.cos(a)), z + RT + RT * Math.sin(a))); }
    d.sil.setAttribute("d", poly(hull(body)));
    const icing = [];
    for (let k = 0; k <= 48; k++) { const a = (k / 48) * Math.PI * 2, rr = RC + RT * 0.7 + 0.5 * Math.sin(a * 7); icing.push(P(x + rr * Math.cos(a), y + rr * Math.sin(a), top - 1)); }
    const hole = ringAt(P, disc(x, y, RC - RT * 0.6, 24), top - 0.6);
    const spr = SPR.map(([a, rr, t]) => seg(P(x + rr * 0.85 * Math.cos(a), y + rr * 0.85 * Math.sin(a), top), P(x + rr * 0.85 * Math.cos(a + 0.12 + t * 0.1), y + rr * 0.85 * Math.sin(a + 0.12 + t * 0.1) + 0.8, top))).join("");
    d.cr.setAttribute("d", poly(icing) + poly(hole) + spr);
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const d of dn) { draw(d, tval(d.z, now)); if (!tdone(d.z, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  // the hit: each donut tests the pointer on its own rest top, the nearest middle wins
  function hit([sx, sy]) {
    let a = -1, best = HIT;
    dn.forEach((d, k) => {
      const [wx, wy] = unproj(C, sx, sy, 1 + REST[d.r][d.c] + 2 * RT);
      const e = Math.hypot(wx - d.x, wy - d.y);
      if (e < best) { best = e; a = k; }
    });
    return a;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    dn.forEach((d, k) => {
      const t = a < 0 ? null : dn[a], gd = t ? Math.abs(d.r - t.r) + Math.abs(d.c - t.c) : 0;
      const z = a < 0 ? REST[d.r][d.c] : gd === 0 ? LIFT : gd === 1 ? 5 : gd === 2 ? 2 : 0.5;
      const f = from < 0 ? null : dn[from];
      tset(d.z, z, now, f ? (Math.abs(d.r - f.r) + Math.abs(d.c - f.c)) * stag : 0);
      d.sil.classList.toggle("hi", a < 0 ? d.r === FAV[0] && d.c === FAV[1] : k === a);
    });
    read.textContent = a < 0 ? "rest" : "donut " + (dn[a].r + 1) + "·" + (dn[a].c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "donutbox",
  means: "An open bakery box of six iced donuts: the one under the pointer lifts out, its neighbours lift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[165, 178], [210, 200], [212, 244], null],
  mount,
});
