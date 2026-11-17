/**
 * Edging iron: a half-moon edger stood on a strip of turf, the curved blade
 * on the cut line, a long shaft and a T handle. The pointer rocks the iron
 * forward on its blade, as a foot would to cut the edge. At rest it leans
 * back a little, its blade bright. The slider is how far it rocks.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const BR = 22, SH = 78, TW = 13, TZ = 8, REST = -0.18;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.75);
  const top = TZ + BR + SH;
  fit(C, [[-48, -26, 0], [48, 26, 0], [48, -26, 0], [-48, 26, 0], [-top * 0.25, 0, top + 4], [top * 0.62, 0, top * 0.8], [0, TW, top], [0, -TW, top]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-48, -26, 48, 26, 4, 2);
  put(solid(g), prism(P, front, cr, ci, 0, TZ));
  mk("path", { d: "M" + P(-40, 0, TZ).join(",") + "L" + P(40, 0, TZ).join(","), class: "nf lo dash" }, g);
  const shaft = mk("path", { class: "nf" }, g), handle = mk("path", { class: "nf" }, g), blade = mk("path", { class: "sil" }, g), back = mk("path", { class: "nf lo" }, g);
  const t = tween(REST);
  // rock about the blade's lowest point (0, 0, TZ)
  const rot = (x, y, z, a) => { const dz = z - TZ; return P(x * Math.cos(a) + dz * Math.sin(a), y, TZ - x * Math.sin(a) + dz * Math.cos(a)); };
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const half = (y) => { const o = []; for (let i = 0; i <= 20; i++) { const th = Math.PI + (i / 20) * Math.PI; o.push(rot(BR * Math.cos(th), y, TZ + BR + BR * Math.sin(th), a)); } return o; };
    blade.setAttribute("d", poly(hull(half(-1.2).concat(half(1.2)))));
    back.setAttribute("d", poly(half(1.2)));
    const ring = (r, z) => disc(0, 0, r).map((q) => rot(q.u, q.v, z, a));
    shaft.setAttribute("d", poly(hull(ring(2.6, TZ + BR - 2).concat(ring(2.6, TZ + BR + SH)))));
    const hr = (y) => circ(3.2, 14).map((q) => rot(q.u, y, TZ + BR + SH + q.v, a));
    handle.setAttribute("d", poly(hull(hr(-TW).concat(hr(TW)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, TZ + BR + SH / 2);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 0.2 + 0.5 * amt : REST, performance.now(), 0);
    read.textContent = a ? "cut" : "rest";
    B.wake();
  }
  blade.classList.add("hi");
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 90), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, 0.2 + 0.5 * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "dutchhoe",
  means: "A half-moon edging iron on a strip of turf: the pointer rocks it forward on its curved blade to cut the edge.",
  rules: [3, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 124], [175, 100], [225, 170], null],
  mount,
});
