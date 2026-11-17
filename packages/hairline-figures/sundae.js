/**
 * Sundae glass: a footed glass holding two scoops, a cherry on top and a
 * long spoon in the top scoop. The pointer over the glass digs the spoon
 * in: it lifts the top scoop and its cherry up and out over the rim. At
 * rest the spoon sits just in, the scoop bright. The slider is the reach.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const BZ = 52, REST = 0.12;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  const P0 = (x, y, z) => [x, y, z];
  fit(C, [P0(-26, -26, 0), P0(26, 26, 0), P0(26, -26, 0), P0(-26, 26, 0), P0(0, 0, 100), P0(44, -2, 104), P0(70, 26, 110)], 200, 162);
  const P = proj(C), front = facing(C);
  const ball = (x, y, z, r) => {
    const pts = [];
    for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI; pts.push(...ringAt(P, disc(x, y, r * Math.sin(a) + 0.3, 24), z - r * Math.cos(a))); }
    return poly(hull(pts));
  };
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 17), disc(0, 0, 15), 0, 3));
  put(solid(g), prism(P, front, disc(0, 0, 3, 16), disc(0, 0, 2, 16), 3, 24));
  const bowl = solid(g);
  bowl.sil.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 9), 22).concat(ringAt(P, disc(0, 0, 25), BZ)))));
  bowl.cr.setAttribute("d", poly(ringAt(P, disc(0, 0, 23), BZ)));
  const dome = [];
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); dome.push(...ringAt(P, disc(0, 0, 23 * Math.cos(a) + 0.3), BZ + 18 * Math.sin(a))); }
  mk("path", { d: poly(hull(dome)) }, g);
  const top = mk("path", { class: "sil hi" }, g), cherry = mk("path", {}, g), spoon = mk("path", { class: "nf" }, g);
  const s = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const x = 40 * t, y = -6 * t, z = BZ + 26 + 16 * t;
    top.setAttribute("d", ball(x, y, z, 15));
    cherry.setAttribute("d", ball(x + 1, y - 1, z + 18, 4.5));
    spoon.setAttribute("d", seg(P(x + 6, y + 8, z - 4), P(x + 26, y + 30, z + 18)) + seg(P(x + 26, y + 30, z + 18), P(x + 30, y + 34, z + 22)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(s, now)); return !tdone(s, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(s, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "scoop" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => {
    const [x, y] = unproj(C, sx, sy, BZ);
    return Math.hypot(x, y) < 34;
  };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(s, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sundae",
  means: "A sundae glass with two scoops and a cherry: the pointer over it digs the spoon in and lifts the top scoop out over the rim.",
  rules: [1, 5, 6, 8],
  range: [0.6, 0.85, 1],
  tour: [[200, 134], [222, 160], [180, 150], null],
  mount,
});
