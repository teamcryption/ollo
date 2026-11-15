/**
 * Roll cage: a wire roll container on four casters, mesh back and sides, and
 * a pair of half gates across its front. The pointer over the cage swings
 * both gates open on their hinges, one a beat after the other. At rest the
 * gates stand a little ajar, unevenly, the left one bright. The slider is how
 * wide they open.
 *
 * The pattern: one gesture on the discrete clock, staggered by distance; the
 * hit is on the floor's plane, which never moves.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 56, D = 34, H = 78, Z0 = 9, GW = W / 2;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [W, 0, H], [W, D + GW, 0], [0, D + GW, 0], [W, D, 0], [0, 0, H]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[4, 4], [W - 4, 4], [4, D - 4], [W - 4, D - 4]]) {
    put(solid(g), prism(P, front, disc(x, y, 3), null, 1, 6));
    place(flatDot(g, C, 1.1, "dot off"), P(x, y, 0));
  }
  const [dr, di] = rings(0, 0, W, D, 2.5, 1.4);
  put(solid(g), prism(P, front, dr, di, 6, Z0));
  // back and sides: a frame and a few bars each
  let back = "";
  const frame = (pts) => { for (let i = 0; i < pts.length; i++) back += seg(pts[i], pts[(i + 1) % pts.length]); };
  frame([P(0, 0, Z0), P(W, 0, Z0), P(W, 0, H), P(0, 0, H)]);
  frame([P(0, 0, Z0), P(0, D, Z0), P(0, D, H), P(0, 0, H)]);
  frame([P(W, 0, Z0), P(W, D, Z0), P(W, D, H), P(W, 0, H)]);
  let bars = "";
  for (const x of [14, 28, 42]) bars += seg(P(x, 0, Z0), P(x, 0, H));
  for (const z of [34, 58]) { bars += seg(P(0, 0, z), P(0, D, z)) + seg(P(W, 0, z), P(W, D, z)) + seg(P(0, 0, z), P(W, 0, z)); }
  mk("path", { class: "nf lo", d: bars }, g);
  mk("path", { class: "nf", d: back }, g);

  const gates = [0, 1].map((k) => ({ k, fr: mk("path", { class: "nf sil" }, g), bar: mk("path", { class: "nf" }, g), tw: tween(k ? 6 : 20), last: NaN }));
  function draw(gt, a) {
    if (a === gt.last) return;
    gt.last = a;
    const hx = gt.k ? W : 0, sx = gt.k ? -1 : 1, r = rad(a);
    const at = (s, z) => P(hx + sx * Math.cos(r) * s, D + Math.sin(r) * s, z);
    gt.fr.setAttribute("d", poly([at(0, Z0 + 2), at(GW - 1, Z0 + 2), at(GW - 1, H - 2), at(0, H - 2)]));
    let b = "";
    for (const s of [6.5, 13, 19.5]) b += seg(at(s, Z0 + 2), at(s, H - 2));
    for (const z of [30, 50]) b += seg(at(0, z), at(GW - 1, z));
    gt.bar.setAttribute("d", b);
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const gt of gates) { draw(gt, tval(gt.tw, now)); if (!tdone(gt.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  const sp = [[0, 0, 0], [W, 0, H], [W, D, 0], [0, D, 0], [0, 0, H], [W, D, H], [0, D, H]].map((q) => P(...q));
  const bx = [Math.min(...sp.map((q) => q[0])), Math.max(...sp.map((q) => q[0])), Math.min(...sp.map((q) => q[1])), Math.max(...sp.map((q) => q[1]))];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    const now = performance.now();
    gates.forEach((gt) => {
      tset(gt.tw, a ? open - gt.k * 8 : gt.k ? 6 : 20, now, gt.k * 50);
      gt.fr.classList.toggle("hi", a || gt.k === 0);
    });
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => set(sx > bx[0] - 10 && sx < bx[1] + 10 && sy > bx[2] - 10 && sy < bx[3] + 10),
    leave: () => set(false),
  }));
  set(false);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "cagecart",
  means: "A wire roll cage on casters: the pointer over it swings both front half gates open on their hinges, one after the other.",
  rules: [1, 2, 4, 5],
  range: [60, 95, 115],
  tour: [[171, 107], [200, 150], [150, 180], null],
  mount,
});
