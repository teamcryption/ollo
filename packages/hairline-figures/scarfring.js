/**
 * Scarf hanger: a bar on a hook with four large rings hanging under it, a
 * scarf hanger. The pointer over the hanger turns the rings on their loops,
 * one after another out from the nearest, to face the viewer. At rest one
 * ring stands half turned, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, hull, poly, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const N = 4, STEP = 30, RR = 13, ZB = 64, FAV = 2;
const X0 = -((N - 1) * STEP) / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[X0 - 14, -14, ZB - 2 * RR - 8], [-X0 + 14, 14, ZB - 2 * RR - 8], [X0 - 14, 0, ZB + 22], [-X0 + 14, 0, ZB + 22]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const hook = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI * 1.4 - 0.2; hook.push(P(5 * Math.cos(a) - 5, 0, ZB + 10 + 6 * Math.sin(a) + 2)); }
  mk("path", { d: "M" + hook.map((p) => p.join(",")).join("L"), class: "nf" }, g);
  const bar = (x0, x1, z, r) => poly(hull([...circ(r, 10).map((q) => P(x0, q.u, z + q.v)), ...circ(r, 10).map((q) => P(x1, q.u, z + q.v))]));
  mk("path", { d: bar(-2, 2, ZB + 6, 1.5) }, g);
  mk("path", { d: bar(X0 - 10, -X0 + 10, ZB, 2.4) }, g);
  const rings = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    mk("path", { d: bar(x, x, ZB - 1, 2.2), class: "nf" }, grp);
    rings.push({ k, x, o: mk("path", { class: k === FAV ? "sil hi" : "sil" }, grp), i: mk("path", { class: "nf" }, grp), t: tween(k === FAV ? 0.18 : 0), last: NaN });
  }
  function ring(x, A, r, z) { const c = Math.cos(A), s = Math.sin(A); return circ(r, 36).map((q) => P(x + q.u * c, q.u * s, z + q.v)); }
  function draw(it, k) {
    if (k === it.last) return;
    it.last = k;
    const A = k * Math.PI / 2, z = ZB - RR - 3;
    it.o.setAttribute("d", poly(hull(ring(it.x, A, RR + 2.5, z).concat(ring(it.x + 0.01, A + 0.15, RR + 2.5, z)))));
    it.i.setAttribute("d", poly(ring(it.x, A, RR - 2.5, z)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of rings) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = rings.map((it) => P(it.x, 0, ZB - RR));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    rings.forEach((it, k) => {
      tset(it.t, a < 0 ? (k === FAV ? 0.18 : 0) : 1, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.o.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ring " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "scarfring",
  means: "A scarf hanger with four rings on a bar: the pointer turns the rings on their loops, one after another out from the nearest.",
  rules: [1, 2, 4, 5, 6],
  range: [0, 60, 120],
  tour: [[171, 162], [114, 134], [286, 220], null],
  mount,
});
