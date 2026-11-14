/**
 * Cymbals: three cymbals on stands over a rug. The pointer picks a cymbal by
 * where it stands: it swings, tipping toward the viewer as if struck, and
 * the cymbals beside it rock a little, staggered from it. At rest each hangs
 * at its own angle and the ride is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SP = 62, R = 24, FAV = 1;
const CY = [{ h: 58, rest: 10, name: "crash" }, { h: 46, rest: -6, name: "ride" }, { h: 66, rest: 16, name: "splash" }];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const X0 = -R - 6, X1 = 2 * SP + R + 6;
  fit(C, [[X0, -R - 6, 0], [X1, R + 6, 0], [X1, -R - 6, 0], [X0, R + 6, 0], [0, 0, 66 + R * 0.6], [2 * SP, 0, 66 + R * 0.6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(X0, -R - 6, X1, R + 6, 8, 2);
  put(solid(g), prism(P, front, rr, ri, 0, 2));

  const e1 = [Math.SQRT1_2, -Math.SQRT1_2], d = [Math.SQRT1_2, Math.SQRT1_2];
  // a disc of radius r centred at (x, y, z), tipped by a about the e1 axis
  const tipRing = (x, y, z, r, a, n = 36) => {
    const out = [], ca = Math.cos(a), sa = Math.sin(a);
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2, c = r * Math.cos(t), s = r * Math.sin(t);
      out.push(P(x + c * e1[0] + s * d[0] * ca, y + c * e1[1] + s * d[1] * ca, z + s * sa));
    }
    return out;
  };

  const items = CY.map((cy, k) => {
    const x = k * SP, y = 0, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 9), disc(x, y, 7), 2, 4));
    put(solid(grp), prism(P, front, disc(x, y, 1.6, 12), disc(x, y, 1, 12), 4, cy.h + 3));
    const body = mk("path", { class: "sil" }, grp), top = mk("path", { class: "nf lo" }, grp), bell = mk("path", {}, grp);
    return { k, x, y, cy, body, top, bell, a: tween(rad(cy.rest)), last: NaN };
  });

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const { x, y } = it, z = it.cy.h;
    it.body.setAttribute("d", poly(hull(tipRing(x, y, z, R, a).concat(tipRing(x, y, z - 1.6, R, a)))));
    it.top.setAttribute("d", poly(tipRing(x, y, z, R - 3, a)));
    it.bell.setAttribute("d", poly(hull(tipRing(x, y, z, 7, a, 20).concat(tipRing(x, y, z + 3, 4, a, 20)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, it.cy.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? it.cy.rest : dd === 0 ? 34 : dd === 1 ? it.cy.rest + 8 : it.cy.rest;
      tset(it.a, rad(deg), now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : items[a].cy.name;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cymbals",
  means: "Three cymbals on stands: the one under the pointer swings as if struck, and its neighbours rock a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[123, 82], [200, 139], [277, 147], null],
  mount,
});
