/**
 * Bongos: a pair of tapered drums joined by a bridge block, the low drum
 * larger than the high one. The pointer picks a drum by where it stands:
 * it tips up off the ground, its head goes bright and two tone rings spread
 * across the skin toward the rim, while the other drum settles and its rings
 * draw in; the bridge tilts between them. At rest the low drum is a little
 * raised, its head bright. The slider is how far the answer reaches.
 *
 * The pattern: one of a few in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, proj, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DRUMS = [
  { x: 0, y: 0, R: 22, H: 36, name: "low" },
  { x: 50, y: 0, R: 17, H: 32, name: "high" },
];
const FAV = 0, LIFT = 14;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-24, -24, 0], [69, 19, 0], [-24, 24, 0], [24, 24, 0], [-24, 24, 36 + LIFT], [69, -19, 32 + LIFT], [-22, -22, 36 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  function drum(d, grp) {
    const s = solid(grp), lugs = mk("path", { class: "nf lo" }, grp);
    const head = mk("path", { class: "nf" }, grp);
    const r1 = mk("path", { class: "nf lo" }, grp), r2 = mk("path", { class: "nf lo" }, grp);
    return { ...d, s, lugs, head, r1, r2, a: tween(0), z: 0 };
  }
  function shell(d, z) {
    const foot = disc(d.x, d.y, d.R * 0.72), top = disc(d.x, d.y, d.R), inner = disc(d.x, d.y, d.R - 1.6);
    put(d.s, { sil: poly(hull(ringAt(P, foot, z).concat(ringAt(P, top, z + d.H)))), crease: open(ringAt(P, run(inner, front), z + d.H - 1.4)) });
    // a band of tension lugs round the shell, just under the rim
    let lg = "";
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3, ca = Math.cos(a), sa = Math.sin(a);
      if (!front({ nu: ca, nv: sa })) continue;
      const rr = d.R * 0.95;
      lg += open([P(d.x + ca * rr, d.y + sa * rr, z + d.H - 4), P(d.x + ca * rr * 0.86, d.y + sa * rr * 0.86, z + d.H - 15)]);
    }
    d.lugs.setAttribute("d", lg);
    d.head.setAttribute("d", poly(ringAt(P, top, z + d.H)));
  }

  const A = drum(DRUMS[0], mk("g", {}, g));
  // the bridge block between the shells
  const bx0 = 18, bx1 = 37, by = 4;
  const bf = [[bx0, -by], [bx1, -by], [bx1, by], [bx0, by]];
  const bs = solid(mk("g", {}, g));
  function block(za, zb) {
    const zz = (x) => za + ((zb - za) * (x - bx0)) / (bx1 - bx0);
    put(bs, {
      sil: poly(hull(bf.map(([x, y]) => P(x, y, 12 + zz(x))).concat(bf.map(([x, y]) => P(x, y, 22 + zz(x)))))),
      crease: open([P(bx0, by - 1, 21 + za), P(bx1, by - 1, 21 + zb)]),
    });
  }
  const B = drum(DRUMS[1], mk("g", {}, g));
  const items = [A, B];

  let last = "";
  function draw(now) {
    const v = items.map((it) => tval(it.a, now)), key = v.join() + reach;
    if (key === last) return;
    last = key;
    items.forEach((it, k) => {
      const z = LIFT * Math.max(0, v[k] - 0.4) / 0.6 * reach;
      it.z = z;
      shell(it, z);
      const kk = 0.25 + 0.75 * v[k] * reach;
      it.r1.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, (it.R - 3) * kk), z + it.H)));
      it.r2.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, (it.R - 3) * kk * 0.5), z + it.H)));
    });
    block(A.z, B.z);
  }

  const L = register(stage, (_dt, now) => {
    draw(now);
    return items.some((it) => !tdone(it.a, now));
  });
  bag.add(L.unregister);

  const mids = items.map((it) => P(it.x, it.y, it.H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 70 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    items.forEach((it, k) => {
      tset(it.a, a < 0 ? (k === FAV ? 0.6 : 0.1) : k === a ? 1 : 0, now, 0);
      it.head.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : items[a].name;
    L.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; L.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bongos",
  means: "A pair of bongos: the drum under the pointer tips up with its head lit, tone rings spreading over the skin.",
  rules: [1, 4, 5, 6],
  range: [0.3, 1, 1],
  tour: [[160, 203], [262, 240], [161, 204], null],
  mount,
});
