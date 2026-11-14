/**
 * Tricycles: three children's tricycles parked side by side on a play mat,
 * each facing the same way. The pointer picks a tricycle by where it stands:
 * it rolls forward, its wheels turning as it goes, and the ones beside it
 * creep forward a little, staggered from it. At rest one has rolled out of
 * line, its front wheel bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, GAP = 42, RR = 7, FR = 11, ROLL = 18, FAV = 1, MZ = 2;
const REST = [3, 12, 0];
const Y0 = 14, YN = Y0 + (N - 1) * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-14, -2, 0], [64, -2, 0], [64, YN + 14, 0], [-14, YN + 14, 0], [24 + ROLL, Y0, MZ + 32], [0, YN, MZ + 26]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-14, -2, 64, YN + 14, 8, 2);
  put(solid(g), prism(P, front, mr, mi, 0, MZ));

  // a wheel standing in the xz plane, centre (x, y, z), radius r, width w
  const loop = (x, y, z, r) => { const o = []; for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2; o.push(P(x + r * Math.cos(a), y, z + r * Math.sin(a))); } return o; };
  function wheel(el, x, y, z, r, w, turn) {
    el.s.setAttribute("d", poly(hull(loop(x, y - w / 2, z, r).concat(loop(x, y + w / 2, z, r)))));
    let sp = poly(loop(x, y + w / 2, z, r * 0.42));
    for (let i = 0; i < 3; i++) { const a = turn + (i / 3) * Math.PI * 2; sp += seg(P(x + r * 0.42 * Math.cos(a), y + w / 2, z + r * 0.42 * Math.sin(a)), P(x + r * 0.82 * Math.cos(a), y + w / 2, z + r * 0.82 * Math.sin(a))); }
    el.c.setAttribute("d", sp);
  }
  const wheelEls = (grp, cls) => ({ s: mk("path", { class: cls }, grp), c: mk("path", { class: "nf lo" }, grp) });

  const items = [];
  for (let k = 0; k < N; k++) {
    const y = Y0 + k * GAP, grp = mk("g", {}, g);
    const it = { k, y, grp, last: NaN, d: tween(REST[k]) };
    it.rearFar = wheelEls(grp, "sil");
    it.frame = mk("path", { class: "nf" }, grp);
    it.seat = solid(grp);
    it.rearNear = wheelEls(grp, "sil");
    it.fork = mk("path", { class: "nf" }, grp);
    it.front = wheelEls(grp, "sil");
    it.bar = mk("path", { class: "nf" }, grp);
    items.push(it);
  }

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const y = it.y, z0 = MZ, x = d;
    const rz = z0 + RR, fz = z0 + FR, fx = x + 26;
    wheel(it.rearFar, x, y - 10, rz, RR, 3, -d / RR);
    it.frame.setAttribute("d", seg(P(x, y - 10, rz), P(x, y + 10, rz)) + open([P(x, y, rz), P(x + 6, y, z0 + 20), P(fx - 3, y, z0 + 22)]) + seg(P(x + 3, y, rz + 3), P(fx - 3, y, z0 + 22)));
    const [sr, si] = rings(x + 1, y - 5, x + 11, y + 5, 4, 1.2);
    put(it.seat, prism(P, front, sr, si, z0 + 20, z0 + 23));
    wheel(it.rearNear, x, y + 10, rz, RR, 3, -d / RR);
    it.fork.setAttribute("d", seg(P(fx - 3, y - 2.5, z0 + 22), P(fx, y - 2.5, fz)));
    wheel(it.front, fx, y, fz, FR, 4, -d / FR);
    const hz = z0 + 29;
    it.bar.setAttribute("d", seg(P(fx - 3, y + 2.5, z0 + 22), P(fx, y + 2.5, fz)) + open([P(fx - 3, y, z0 + 22), P(fx - 4, y, hz)]) + seg(P(fx - 6, y - 10, hz), P(fx - 4, y + 10, hz)) + seg(P(fx - 6, y - 10, hz), P(fx - 9, y - 11, hz)) + seg(P(fx - 4, y + 10, hz), P(fx - 7, y + 11, hz)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(13 + REST[it.k], it.y, MZ + 12));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? REST[k] : dd === 0 ? REST[k] + ROLL : REST[k] + 4;
      tset(it.d, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.front.s.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "trike " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tricycles",
  means: "Three tricycles parked on a play mat: the one under the pointer rolls forward, wheels turning, and its neighbours creep after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[285, 135], [208, 155], [135, 175], null],
  mount,
});
