/**
 * Weight plates: seven iron plates hung on edge along one bar over a low
 * base, heaviest at the back, each with its hub ring. The pointer picks a
 * plate by where it stands and it lifts off the bar; its neighbours rise a
 * little after it, staggered. At rest one plate sits a touch raised, bright.
 * The slider is the stagger.
 */
const {
  Cam, fit, proj, rings, prism, facing, hull, poly, seg, open, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = [24, 24, 19, 19, 14, 14, 10], TH = 4, GAP = 3, ZC = 30, X = 0, LIFT = 12, FAV = 2;
const ys = R.map((_, k) => 6 + k * (TH + GAP));
const Y1 = ys[ys.length - 1] + TH + 6;

function disc(R, n) { const p = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; p.push([R * Math.cos(t), R * Math.sin(t)]); } return p; }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-26, 0, 0], [26, Y1, 0], [-26, 0, ZC + 24 + LIFT], [26, Y1, ZC + 24 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-20, 0, 20, Y1, 4, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  mk("path", { class: "nf", d: seg(P(X, 2, ZC), P(X, Y1 - 2, ZC)) + seg(P(X, 3, 4), P(X, 3, ZC)) }, g);

  const plates = R.map((r, k) => {
    const el = solid(g), hub = mk("path", { class: "nf lo" }, el.g);
    return { k, r, y: ys[k], el, hub, z: tween(k === FAV ? 4 : 0), last: "" };
  });

  function draw(p, z) {
    const key = z.toFixed(2);
    if (key === p.last) return;
    p.last = key;
    const cz = ZC + z, ring = disc(p.r, 40), at = (pts, y) => pts.map(([u, v]) => P(X + u, y, cz + v));
    p.el.sil.setAttribute("d", poly(hull(at(ring, p.y).concat(at(ring, p.y + TH)))));
    const inner = disc(p.r - 1.6, 40), hub = disc(4, 20);
    const a = at(inner, p.y + TH), h = at(hub, p.y + TH);
    p.el.cr.setAttribute("d", open(a.concat([a[0]])));
    p.hub.setAttribute("d", open(h.concat([h[0]])));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of plates) { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The plate whose resting centre is nearest the pointer's x on screen. */
  const mids = plates.map((p) => P(X, p.y + TH / 2, ZC));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 12 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    plates.forEach((p, k) => {
      const d = Math.abs(k - a);
      const z = a < 0 ? (k === FAV ? 4 : 0) : d === 0 ? LIFT : d === 1 ? 3 : 0;
      tset(p.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "plate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "plyobox",
  means: "Seven weight plates hung on a bar: the one under the pointer lifts off, and its neighbours rise a little in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[162, 193], [204, 171], [246, 91], null],
  mount,
});
