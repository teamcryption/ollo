/**
 * Gong: a round gong hung by two cords inside a wooden frame, a mallet
 * leaning at its foot. The pointer over the gong strikes it: the disc swings
 * back on its cords and turns bright. At rest the mallet is the bright mark.
 * The slider is how far the gong swings.
 *
 * The pattern: one part turning about a hinge (swing).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 80, H = 92, R = 30, CX = W / 2, Y0 = 6, ZT = H - 6, DROP = 10;
const REST = 0.1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-8, -8, 0], [W + 8, 20, 0], [W + 8, -8, 0], [-8, 20, 0], [0, 0, H + 4], [W, 12, H + 4], [CX, Y0 + 40, ZT - 30]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, z0, x1, y1, z1, cls = "") => {
    const pts = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) pts.push(P(x, y, z));
    return mk("path", { d: poly(hull(pts)), class: cls }, g);
  };
  // frame: feet, posts, top beam
  box(-8, -2, 0, 6, 14, 4);
  box(W - 6, -2, 0, W + 8, 14, 4);
  box(-2, Y0 - 2, 4, 4, Y0 + 4, H);
  const cordL = mk("path", { class: "nf" }, g), cordR = mk("path", { class: "nf" }, g);
  const disc = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g), boss = mk("path", { class: "nf" }, g);
  box(W - 4, Y0 - 2, 4, W + 2, Y0 + 4, H);
  box(-4, Y0 - 3, H - 6, W + 4, Y0 + 5, H + 2);
  // mallet leaning on the right foot
  const m0 = [W - 2, 22, 2], m1 = [W - 14, 24, 40];
  const mallet = mk("path", { class: "sil" }, g);
  {
    const pts = [];
    for (const d of [-1.2, 1.2]) { pts.push(P(m0[0] + d, m0[1], m0[2]), P(m1[0] + d, m1[1], m1[2])); }
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; pts.push(P(m1[0] + 5 * Math.cos(t), m1[1] + 5 * Math.sin(t), m1[2] + 4), P(m1[0] + 5 * Math.cos(t), m1[1], m1[2] + 4 + 5 * Math.sin(t))); }
    mallet.setAttribute("d", poly(hull(pts)));
  }

  const ang = tween(REST);
  let last = NaN;
  const at = (u, d, n, a) => P(CX + u, Y0 + d * Math.sin(a) + n * Math.cos(a), ZT - d * Math.cos(a) + n * Math.sin(a));
  function draw(a) {
    if (a === last) return;
    last = a;
    const ring = (r, n, dc) => { const o = []; for (let i = 0; i < 40; i++) { const t = (i / 40) * Math.PI * 2; o.push(at(r * Math.cos(t), dc + r * Math.sin(t), n, a)); } return o; };
    const dc = DROP + R;
    disc.setAttribute("d", poly(hull(ring(R, -1.5, dc).concat(ring(R, 1.5, dc)))));
    rim.setAttribute("d", poly(ring(R - 5, 1.5, dc)));
    boss.setAttribute("d", poly(hull(ring(7, 1.5, dc).concat(ring(5, 4, dc)))));
    for (const [el, u] of [[cordL, -12], [cordR, 12]]) {
      const top = P(CX + u * 1.6, Y0, ZT), bot = at(u, DROP + R - Math.sqrt(R * R - u * u), 0, a);
      el.setAttribute("d", poly([top, bot, [bot[0] + 0.6, bot[1]], [top[0] + 0.6, top[1]]]));
    }
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const mid = P(CX, Y0, ZT - DROP - R);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? -0.15 - 0.55 * (amp / 90) : REST, performance.now(), 0);
    disc.classList.toggle("hi", on);
    mallet.classList.toggle("hi", !on);
    read.textContent = on ? "struck" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], sy - mid[1]) < 70;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "gong",
  means: "A gong hung in a frame with a mallet at its foot: the pointer over the gong strikes it and the disc swings back on its cords.",
  rules: [1, 3, 4, 5],
  range: [0, 60, 90],
  tour: [[200, 166], [190, 140], [215, 190], null],
  mount,
});
