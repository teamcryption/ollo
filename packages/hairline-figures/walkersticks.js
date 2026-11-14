/**
 * Cane stand: six walking canes standing in a round stand, crooks facing
 * different ways. The pointer picks a cane by where it stands: it rises out
 * of the stand and tips outward on its foot, and the other canes settle
 * upright, staggered from it. At rest one cane leans out, bright.
 * The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, R = 17, H = 30, L = 76, CR = 1.7, HK = 5.5, FAV = 4, TIP = 30, RISE = 12;
const REST = [5, 3, 7, 4, 16, 6];
const disc = (x, y, r, n = 12) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  const canes = [];
  for (let k = 0; k < N; k++) {
    const a = rad(k * 60 + 20), h = rad(k * 97 + 40);
    canes.push({ k, bx: 9 * Math.cos(a), by: 9 * Math.sin(a), dx: Math.cos(a), dy: Math.sin(a), hx: Math.cos(h), hy: Math.sin(h) });
  }
  // the pose: tilt t (deg) outward about the foot, rise z
  const pose = (c, t, z) => {
    const s = Math.sin(rad(t)), co = Math.cos(rad(t));
    return [c.bx + c.dx * L * s, c.by + c.dy * L * s, 2 + z + L * co];
  };
  const ext = [];
  for (const c of canes) { const [x, y, z] = pose(c, TIP, RISE); ext.push([x + c.hx * 12, y + c.hy * 12, z + 7], [x, y, z]); }
  fit(C, ext.concat([[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-R, -R, R, R, R, 2);
  put(solid(g), prism(P, front, sr, si, 0, H));
  mk("path", { d: poly(ringAt(P, si, H)), class: "nf lo" }, g);

  canes.sort((a, b) => a.bx + a.by - (b.bx + b.by));
  for (const c of canes) {
    c.grp = mk("g", {}, g);
    c.shaft = mk("path", { class: "sil" }, c.grp);
    c.hook = mk("path", { class: "sil" }, c.grp);
    c.tw = tween(REST[c.k]);
    c.last = NaN;
  }
  // the stand's near wall, over the canes' feet
  const fr = run(sr, front);
  mk("path", { d: poly(ringAt(P, fr, H).concat(ringAt(P, fr, 0).reverse())), class: "sil" }, g);

  function draw(c, v) {
    if (v === c.last) return;
    c.last = v;
    const t = v, z = (v > REST[c.k] ? (v - REST[c.k]) / (TIP - REST[c.k]) : 0) * RISE;
    const [tx, ty, tz] = pose(c, t, z);
    c.shaft.setAttribute("d", poly(hull(ringAt(P, disc(c.bx, c.by, CR), 2 + z).concat(ringAt(P, disc(tx, ty, CR), tz)))));
    const arc = (r) => {
      const out = [];
      for (let i = 0; i <= 10; i++) { const f = Math.PI * (1 - i / 10); out.push(P(tx + c.hx * (HK + r * Math.cos(f)), ty + c.hy * (HK + r * Math.cos(f)), tz + r * Math.sin(f))); }
      out.push(P(tx + c.hx * (HK + r), ty + c.hy * (HK + r), tz - 6));
      return out;
    };
    c.hook.setAttribute("d", poly(arc(HK + CR).concat(arc(HK - CR).reverse())));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of canes) { draw(c, tval(c.tw, now)); if (!tdone(c.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = [];
  for (const c of canes) { const [x, y, z] = pose(c, REST[c.k], 0); mids[c.k] = P((c.bx + x) / 2 + c.hx * 3, (c.by + y) / 2 + c.hy * 3, z * 0.7); }
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx) + 0.25 * Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const c of canes) {
      const to = a < 0 ? REST[c.k] : c.k === a ? TIP : 0;
      tset(c.tw, to, now, from < 0 ? 0 : Math.abs(c.k - from) * stag);
      const on = c.k === (a < 0 ? FAV : a);
      c.shaft.classList.toggle("hi", on); c.hook.classList.toggle("hi", on);
    }
    read.textContent = a < 0 ? "rest" : "cane " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "walkersticks",
  means: "Six walking canes in a round stand: the cane under the pointer rises and tips outward, and the others settle upright.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[188, 142], [213, 169], [167, 154], null],
  mount,
});
