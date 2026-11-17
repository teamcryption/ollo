/**
 * Landing net: a long handle ending in a round hoop, a mesh bag hanging from
 * the hoop. Over the net, it scoops: the handle pitches up about its grip and
 * the hoop rises with the bag swinging under it. At rest the net lies low,
 * its hoop bright. The slider is how high it scoops.
 *
 * The pattern: one part answering on the discrete clock (cloches).
 */
const {
  Cam, fit, hull, open, poly, proj, seg, tset, tval, tdone, tween, unproj, clamp,
  disposer, mk, pointer, register, rad,
} = HL;

const GX = 66, GZ = 10, LH = 52, R = 32, BAG = 38, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[GX, -R, 0], [GX - LH - 2 * R, R, -BAG + 10], [GX - LH - 2 * R, -R, 0], [GX - (LH + 2 * R) * 0.6, 0, GZ + (LH + 2 * R) * 0.8], [GX - LH - 2 * R, 0, GZ + (LH + 2 * R) * 0.75], [GX - LH - R, 0, -12], [GX, R, 0]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const net = mk("path", { class: "sil" }, g), mesh = mk("path", { class: "nf lo" }, g);
  const hoop = mk("path", { class: "nf hi" }, g);
  const handle = mk("path", { class: "sil" }, g), grip = mk("path", { class: "nf lo" }, g);

  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), dx = -Math.cos(a), dz = Math.sin(a);
    const at = (s, y) => [GX + s * dx, y, GZ + s * dz];
    const c = at(LH + R, 0), rim = [];
    for (let i = 0; i < 40; i++) { const t = (i / 40) * Math.PI * 2; rim.push(at(LH + R + R * Math.cos(t), R * Math.sin(t))); }
    const bot = [c[0] + 4, c[1], c[2] - BAG], low = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; low.push(P(bot[0] + 6 * Math.cos(t), bot[1] + 6 * Math.sin(t), bot[2])); }
    const sp = rim.map((q) => P(...q));
    net.setAttribute("d", poly(hull(sp.concat(low))));
    let m = "";
    for (let i = 0; i < 40; i += 5) if (rim[i][0] + rim[i][1] >= c[0] + c[1] - 4) m += seg(sp[i], P(...bot));
    mesh.setAttribute("d", m + poly(rim.map((q) => P(q[0] + (bot[0] - q[0]) * 0.5, q[1] * 0.55, q[2] + (bot[2] - q[2]) * 0.5))));
    hoop.setAttribute("d", poly(sp));
    const hp = [];
    for (const s of [0, LH]) for (let i = 0; i < 10; i++) { const t = (i / 10) * Math.PI * 2, r = s ? 1.6 : 2.6; hp.push(P(GX + s * dx - r * Math.sin(t) * dz, r * Math.cos(t), GZ + s * dz + r * Math.sin(t) * dx)); }
    handle.setAttribute("d", poly(hull(hp)));
    grip.setAttribute("d", seg(P(...at(16, -2.6)), P(...at(16, 2.6))));
  }

  const ang = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? top : REST, performance.now(), 0);
    read.textContent = a ? "scoop" : "rest";
    B.wake();
  }
  setActive(false);
  const over = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, GZ); return x < GX + 8 && x > GX - LH - 2 * R - 8 && Math.abs(y) < R + 10; };
  bag.add(pointer(stage, { move: (p) => setActive(over(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = clamp(v, 20, 50); if (act) { tset(ang, top, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "keepnet",
  means: "A landing net on a long handle: over it, the net scoops up about its grip, the hoop rising with the mesh bag swinging under it.",
  rules: [1, 4, 5, 8],
  range: [20, 38, 50],
  tour: [[153, 182], [200, 230], [128, 150], null],
  mount,
});
