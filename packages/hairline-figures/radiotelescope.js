/**
 * Radio telescope: three dishes on pedestals along a pad, each dish with a
 * feed held on struts at its focus. The pointer picks a dish by where it
 * stands: that dish tilts up to the sky and its neighbours follow a little,
 * staggered from it. At rest the dishes look out at uneven angles and the
 * middle one is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), turned to face.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, seg, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 62, R = 22, DEP = 7, FOC = 20, PZ = 3, HZ = 30, FAV = 1;
const REST = [[38, 70], [52, 45], [30, 20]]; // [elevation, azimuth] at rest
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const d2r = Math.PI / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const X1 = (N - 1) * STEP;
  fit(C, [[-30, -30, 0], [X1 + 30, 30, 0], [X1 + 30, -30, 0], [-30, 30, 0], [0, 0, HZ + R + 8], [X1, 0, HZ + R + 8], [X1 + 24, 20, HZ + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-30, -26, X1 + 30, 26, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, y = 0, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 9), disc(x, y, 7.5), PZ, PZ + 4));
    put(solid(grp), prism(P, front, disc(x, y, 4, 16), disc(x, y, 3, 16), PZ + 4, HZ - 2));
    const back = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp);
    const struts = mk("path", { class: "nf lo" }, grp), feed = mk("path", { class: "nf" }, grp);
    const [e, a] = REST[k];
    items.push({ k, x, y, grp, back, rim, struts, feed, el: tween(e), az: tween(a), last: "" });
  }

  function draw(it, el, az) {
    const key = el.toFixed(2) + "," + az.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    const ce = Math.cos(el * d2r), se = Math.sin(el * d2r), ca = Math.cos(az * d2r), sa = Math.sin(az * d2r);
    const n = [ce * ca, ce * sa, se], u = [-sa, ca, 0], w = [-se * ca, -se * sa, ce];
    const c = [it.x, it.y, HZ];
    const at = (r, t, off) => P(c[0] + n[0] * off + r * (Math.cos(t) * u[0] + Math.sin(t) * w[0]),
      c[1] + n[1] * off + r * (Math.cos(t) * u[1] + Math.sin(t) * w[1]),
      c[2] + n[2] * off + r * (Math.cos(t) * u[2] + Math.sin(t) * w[2]));
    const ring = (r, off, m = 36) => Array.from({ length: m }, (_, i) => at(r, (i / m) * 2 * Math.PI, off));
    const shell = [];
    for (const f of [1, 0.75, 0.5, 0.25]) shell.push(...ring(R * f, DEP * f * f));
    shell.push(at(0, 0, -2));
    it.back.setAttribute("d", poly(hull(shell)));
    const rimPts = ring(R, DEP);
    it.rim.setAttribute("d", poly(rimPts));
    const fp = at(0, 0, FOC);
    it.struts.setAttribute("d", [0, 12, 24].map((i) => seg(rimPts[i], fp)).join(""));
    it.feed.setAttribute("d", poly(hull(ring(2.6, FOC - 1.5, 12).concat(ring(2.6, FOC + 2, 12)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) {
      draw(it, tval(it.el, now), tval(it.az, now));
      if (!tdone(it.el, now) || !tdone(it.az, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, HZ / 2));
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
      const dd = Math.abs(k - a), d = from < 0 ? 0 : Math.abs(k - from) * stag;
      const [e0, a0] = REST[k];
      const e = a < 0 ? e0 : dd === 0 ? 82 : lerpE(e0, dd);
      tset(it.el, e, now, d);
      tset(it.az, a < 0 ? a0 : 45, now, d);
      it.back.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "dish " + (a + 1) + " · 82°";
    B.wake();
  }
  const lerpE = (e0, dd) => (dd === 1 ? 64 : e0);
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "radiotelescope",
  means: "Three radio dishes on a pad: the dish under the pointer tilts up to the sky, and its neighbours follow a little.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[200, 147], [277, 186], [123, 109], null],
  mount,
});
