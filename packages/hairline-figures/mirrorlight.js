/**
 * Vanity mirror: a tri-fold mirror on a low plinth, a tall centre glass with
 * a hinged wing on each side. The pointer picks a wing by where it stands:
 * that wing opens flat beside the glass and the other folds in across it; over
 * the middle both open flat. At rest the left wing stands ajar, the right half
 * shut, and the centre glass is bright. The slider is how far the other folds.
 *
 * The pattern: one of a few parts, picked by screen x (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HW = 20, WW = 20, Z0 = 6, Z1 = 78, T = 1.8, REST = 32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-HW - WW, -8, 0], [HW + WW, -8, 0], [-HW - WW, 0, Z1], [HW + WW, 0, Z1], [HW, WW, 0], [-HW, WW, Z1], [HW + 4, 20, Z1]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-HW - 4, -9, HW + 4, 7, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, Z0));

  // a panel standing on the line from (hx, hy) along angle a (deg), u from u0 to u1
  const face = (hx, hy, dx, dy, ring, off) => ring.map((q) => P(hx + q.u * dx + off[0], hy + q.u * dy + off[1], q.v));
  const outer = (u0, u1, z0, z1) => rrect(u0, z0, u1, z1, 5, 5);
  const glass = (u0, u1, z0, z1) => rrect(u0 + 4, z0 + 4, u1 - 4, z1 - 4, 2.5, 4);

  function panel(el, hx, hy, dx, dy, u0, u1, z0, z1) {
    const n = [-dy * T, dx * T];
    const back = n[0] + n[1] < 0 ? n : [-n[0], -n[1]], fr = [0, 0];
    const o = outer(u0, u1, z0, z1);
    const a = face(hx, hy, dx, dy, o, back), b = face(hx, hy, dx, dy, o, fr);
    el.sil.setAttribute("d", poly(hull(a.concat(b))));
    el.edge.setAttribute("d", poly(b));
    el.gl.setAttribute("d", poly(face(hx, hy, dx, dy, glass(u0, u1, z0, z1), fr)));
  }
  const mkPanel = (parent) => {
    const grp = mk("g", {}, parent);
    return { grp, sil: mk("path", { class: "sil" }, grp), edge: mk("path", { class: "nf lo" }, grp), gl: mk("path", { class: "nf lo" }, grp) };
  };

  const mid = mkPanel(g);
  panel(mid, 0, 0, 1, 0, -HW, HW, Z0, Z1);
  const wings = [-1, 1].map((s) => ({ s, el: mkPanel(g), a: tween(s < 0 ? REST : 100), last: NaN }));

  function draw(w, a) {
    if (a === w.last) return;
    w.last = a;
    const dx = w.s * Math.cos(rad(a)), dy = Math.sin(rad(a));
    panel(w.el, w.s * HW, 0, dx, dy, 0.6, WW, Z0 + 3, Z1 - 3);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const w of wings) { draw(w, tval(w.a, now)); if (!tdone(w.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const cx = P(0, 0, (Z0 + Z1) / 2), lx = P(-HW - WW / 2, 4, 40), rx = P(HW + WW / 2, 4, 40);
  function hit([sx, sy]) {
    if (sy < P(0, 0, Z1 + 8)[1] || sy > P(0, 10, 0)[1] + 10) return -1;
    if (sx < lx[0] - 30 || sx > rx[0] + 30) return -1;
    if (Math.abs(sx - cx[0]) < 16) return 1;
    return sx < cx[0] ? 0 : 2;
  }

  let act = -2;
  const NAMES = ["left", "mid", "right"];
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    wings.forEach((w, k) => {
      const i = k * 2; // 0 or 2
      const to = a < 0 ? (i ? 100 : REST) : a === 1 || a === i ? 0 : swing;
      tset(w.a, to, now, from < 0 ? 0 : Math.abs(i - from) * 25);
      w.el.sil.classList.toggle("hi", a === i);
    });
    mid.sil.classList.toggle("hi", a < 0 || a === 1);
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; }, destroy: bag.dispose };
}

hairline({
  name: "mirrorlight",
  means: "A tri-fold vanity mirror: the wing under the pointer opens flat while the other folds in across the glass.",
  rules: [1, 2, 5, 6],
  range: [70, 140, 165],
  tour: [[128, 88], [192, 134], [247, 141], null],
  mount,
});
