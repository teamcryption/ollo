/**
 * Tire rack: three tires standing on a two-rail storage rack. The pointer
 * picks a tire by where it stands across the rack: it rolls forward off the
 * rails, and its neighbours roll a little, staggered from it. At rest the
 * middle tire stands part-way out, bright. The slider is the stagger.
 */
const { Cam, clamp, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const N = 3, R = 24, TW = 20, STEP = 26, OUT = 30, FAV = 1, RZ = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const X1 = (N - 1) * STEP + TW;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-6, -OUT - R, 0], [X1 + 6, -OUT - R, 0], [-6, R + 6, 0], [X1 + 6, R + 6, 0], [0, 0, RZ + 2 * R + 2], [X1, -OUT, RZ + 2 * R + 2]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const bx = (x0, y0, z0, x1, y1, z1) => { const p = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) p.push(P(x, y, z)); return poly(hull(p)); };
  for (const x of [-4, X1 + 2]) for (const y of [-14, 12]) mk("path", { d: bx(x, y, 0, x + 2, y + 2, RZ + 2), class: "sil" }, g);
  for (const y of [-14, 12]) mk("path", { d: bx(-4, y, RZ, X1 + 4, y + 2, RZ + 2), class: "sil" }, g);
  const vis = P(1, 0, 0)[1] > P(0, 0, 0)[1] ? 1 : 0;
  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf" }, grp), hub = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, grp, sil, rim, hub, y: tween(k === FAV ? OUT * 0.5 : 0), last: NaN });
  }
  const ring = (x, cy, r) => { const p = []; for (let i = 0; i < 36; i++) { const t = (i / 36) * Math.PI * 2; p.push(P(x, cy + r * Math.cos(t), RZ + R + r * Math.sin(t))); } return p; };

  function draw(it, o) {
    if (o === it.last) return false;
    it.last = o;
    const cy = -o, xf = it.x0 + vis * TW;
    it.sil.setAttribute("d", poly(hull(ring(it.x0, cy, R).concat(ring(it.x0 + TW, cy, R)))));
    it.rim.setAttribute("d", poly(ring(xf, cy, R * 0.62)));
    it.hub.setAttribute("d", poly(ring(xf, cy, R * 0.25)));
    return true;
  }
  function order() {
    items.slice().sort((a, b) => P(a.x0 + TW / 2, -a.last, 0)[1] - P(b.x0 + TW / 2, -b.last, 0)[1]).forEach((it) => g.appendChild(it.grp));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false, ch = false;
    for (const it of items) { if (draw(it, tval(it.y, now))) ch = true; if (!tdone(it.y, now)) moving = true; }
    if (ch) order();
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + TW / 2, 0, RZ + R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), o = a < 0 ? (k === FAV ? OUT * 0.5 : 0) : d === 0 ? OUT : d === 1 ? 8 : 0;
      tset(it.y, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tire " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tirerack",
  means: "Three tires on a storage rack: the tire under the pointer rolls forward off the rails and its neighbours roll a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[122, 116], [197, 154], [164, 137], null],
  mount,
});
