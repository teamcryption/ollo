/**
 * Robot lawnmower: a low chassis on two big rear wheels and two small front
 * casters, under a domed shell hinged at the back, a round stop button on
 * its top. The pointer over the mower lifts the shell open on its rear hinge
 * to show the cutting deck and blade disc; the nearer the pointer is to the
 * front, the wider it opens. At rest the shell sits just ajar, the stop
 * button bright. The slider is how far the shell opens.
 *
 * The pattern: one part on a hinge (lid), hit on the ground plane.
 */
const {
  Cam, clamp, circ, facing, fit, hull, poly, prism, proj, rad, rings, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 64, W = 44, HZ = 9, HX = 2, LH = 15, REST = 6;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 3.05);
  const rot = (x, y, z, a) => {
    const dx = x - HX, dz = z - HZ, c = Math.cos(a), s = Math.sin(a);
    return [HX + dx * c - dz * s, y, HZ + dx * s + dz * c];
  };
  const far = [[L, 0, 0], [L, W, 0], [L - 8, W / 2, LH]].map((p) => rot(p[0], p[1], p[2] + HZ, rad(70)));
  fit(C, [[-4, -6, 0], [L + 2, W + 6, 0], [L + 2, -6, 0], [-4, W + 6, 0], [-6, W / 2, LH + HZ], ...far], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a wheel: a disc standing in the x–z plane, with a hub
  function wheel(par, x, y0, y1, r, cz) {
    const a = [], b = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; a.push(P(x + r * Math.cos(t), y0, cz + r * Math.sin(t))); b.push(P(x + r * Math.cos(t), y1, cz + r * Math.sin(t))); }
    const hub = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; hub.push(P(x + r * 0.4 * Math.cos(t), y1, cz + r * 0.4 * Math.sin(t))); }
    mk("path", { class: "sil", d: poly(hull(a.concat(b))) }, par);
    mk("path", { class: "nf lo", d: poly(b) + poly(hub) }, par);
  }
  wheel(g, 14, -7, -1, 10, 10);
  wheel(g, L - 10, 1, 4, 4.5, 4.5);

  // the chassis and its cutting deck
  const [cr0, ci0] = rings(2, 0, L - 2, W, 12, 1.6);
  put(solid(g), prism(P, front, cr0, ci0, 2, HZ));
  mk("path", { class: "nf lo", d: poly(disc(L / 2 + 4, W / 2, 15, 32).map((q) => P(q.u, q.v, HZ))) + poly(disc(L / 2 + 4, W / 2, 4, 16).map((q) => P(q.u, q.v, HZ))) }, g);
  const blade = [[-13, -2], [13, -2], [13, 2], [-13, 2]];
  mk("path", { class: "nf", d: poly(blade.map(([u, v]) => P(L / 2 + 4 + (u - v) * 0.7, W / 2 + (u + v) * 0.7, HZ + 0.6))) }, g);

  // the shell: a rounded dome on a hinge at the back, and the stop button on its top
  const lid = mk("g", {}, g);
  const shell = mk("path", { class: "sil" }, lid), top = mk("path", { class: "nf lo" }, lid);
  const btn = mk("path", { class: "sil" }, lid), btnTop = mk("path", { class: "nf lo" }, lid);
  const foot = rrect(0, -2, L, W + 2, 16, 8), crown = rrect(10, 5, L - 6, W - 5, 12, 8), inner = rrect(12, 7, L - 8, W - 7, 10, 8);
  const bt = disc(22, W / 2, 5, 20), bti = disc(22, W / 2, 3.6, 20);
  wheel(g, 14, W + 1, W + 7, 10, 10);
  wheel(g, L - 10, W - 4, W - 1, 4.5, 4.5);

  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), R = (ring, z) => ring.map((q) => P(...rot(q.u, q.v, z, a)));
    shell.setAttribute("d", poly(hull(R(foot, HZ).concat(R(crown, HZ + LH)))));
    top.setAttribute("d", poly(R(inner, HZ + LH)));
    btn.setAttribute("d", poly(hull(R(bt, HZ + LH - 0.5).concat(R(bt, HZ + LH + 3.5)))));
    btnTop.setAttribute("d", poly(R(bti, HZ + LH + 3.5)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // the hit: the pointer on the ground plane, over the mower's footprint
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, HZ);
    if (x < -4 || x > L + 6 || y < -8 || y > W + 8) return -1;
    return clamp(Math.round((x / L) * 3), 0, 3);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? REST : maxA * (0.55 + 0.15 * a), performance.now(), 0);
    shell.classList.toggle("hi", a >= 0);
    btn.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : "lid " + Math.round(maxA * (0.55 + 0.15 * a)) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "robotmower",
  means: "A robot lawnmower: its shell lifts open on the rear hinge to show the blade, wider the nearer the pointer is to the front.",
  rules: [1, 3, 4, 5],
  range: [25, 50, 70],
  tour: [[168, 160], [208, 182], [252, 206], null],
  mount,
});
