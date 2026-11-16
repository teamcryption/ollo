/**
 * Disc golf basket: a pole on a round foot, a wide tray part way up, and a
 * crown of chains hanging from a band at the top. The pointer is a throw:
 * the band and its chains swing back on the pole's top, as a disc hits them,
 * the side nearer the pointer swinging away. At rest the band is bright and
 * the crown hangs a little tilted. The slider is how hard the throw lands.
 */
const { Cam, circ, fit, hull, open, poly, proj, rad, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const TOP = 100, BR = 30, TZ = 40, TR = 34, NCH = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hard = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-TR, -TR, 0], [TR, TR, 0], [TR, -TR, 0], [-TR, TR, 0], [-BR - 14, 0, TOP + 8], [BR + 14, 0, TOP + 8]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const cyl = (r, z0, z1, n = 40) => poly(hull(circ(r, n).map((q) => P(q.u, q.v, z0)).concat(circ(r, n).map((q) => P(q.u, q.v, z1)))));
  const ring = (r, z) => poly(circ(r, 40).map((q) => P(q.u, q.v, z)));
  mk("path", { class: "sil", d: cyl(18, 0, 3) }, g);
  mk("path", { class: "nf lo", d: ring(16, 3) }, g);
  mk("path", { class: "sil", d: cyl(2.2, 3, TOP + 4, 16) }, g);
  mk("path", { class: "sil", d: cyl(TR, TZ, TZ + 12) }, g);
  mk("path", { class: "nf lo", d: ring(TR - 2, TZ + 12) }, g);
  mk("path", { class: "sil", d: cyl(2.2, TZ + 12, TOP + 4, 16) }, g);
  const chains = mk("path", { class: "nf lo" }, g), band = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf lo" }, g);
  // the crown swings about the pole's top, tipping by ang toward +x turned by dir
  const REST = 0.18;
  const s = tween(REST);
  let last = NaN, dir = 45;
  function draw(v) {
    const key = v + "," + dir;
    if (key === last) return;
    last = key;
    const ang = rad(28 * v), d = rad(dir), cd = Math.cos(d), sd = Math.sin(d), ca = Math.cos(ang), sa = Math.sin(ang);
    const T = (x, y, z) => {
      const u = x * cd + y * sd, w = -x * sd + y * cd, dz = z - TOP, u1 = u * ca + dz * sa, z1 = -u * sa + dz * ca;
      return P(u1 * cd - w * sd, u1 * sd + w * cd, TOP + z1);
    };
    const rg = (r, z) => circ(r, 40).map((q) => T(q.u, q.v, z));
    band.setAttribute("d", poly(hull(rg(BR, TOP - 8).concat(rg(BR, TOP)))));
    cap.setAttribute("d", poly(rg(BR - 2, TOP)));
    const cs = [];
    for (let i = 0; i < NCH; i++) {
      const t = (i / NCH) * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t);
      cs.push(open([T(BR * c, BR * sn, TOP - 8), T(BR * 0.75 * c, BR * 0.75 * sn, TZ + 34), T(5 * c, 5 * sn, TZ + 14)]));
    }
    chains.setAttribute("d", cs.join(" "));
  }
  const B = register(stage, (_dt, now) => { draw(tval(s, now)); return !tdone(s, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, TOP - 30);
  let act = -3;
  function setActive(k, sx) {
    const side = k < 0 ? -2 : sx < mid[0] ? 0 : 1;
    if (side === act) return;
    act = side;
    dir = side === 0 ? 135 : side === 1 ? -45 : 45;
    last = NaN;
    tset(s, side < 0 ? REST : -hard, performance.now(), 0);
    band.classList.add("hi");
    read.textContent = side < 0 ? "rest" : side === 0 ? "left" : "right";
    B.wake();
  }
  setActive(-1, 0);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 130 ? 1 : -1, sx),
    leave: () => setActive(-1, 0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { hard = v; const k = act; act = -3; if (k >= 0) setActive(1, k === 0 ? 0 : 400); }, destroy: bag.dispose };
}

hairline({
  name: "discgolf",
  means: "A disc golf basket: the pointer lands a throw, and the band and its chains swing back on the pole.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.3],
  tour: [[136, 77], [264, 90], [200, 150], null],
  mount,
});
