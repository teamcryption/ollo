/**
 * Tellurion: a sun on a post at the middle of a round base, and an arm that
 * carries the earth, with its moon, round it. The pointer turns the arm so
 * the earth stands where the pointer is, read on the ground; the moon runs
 * round the earth as it goes. At rest the earth is off to one side, bright.
 * The slider is how far the moon turns per turn of the arm.
 *
 * The pattern: one part aimed at the pointer (aim).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const BR = 26, SZ = 50, SR = 13, AR = 52, AZ = 22, ER = 10, EZ = 34, MR = 4, MD = 17, REST = -0.9;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turns = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-AR - 22, -AR - 22, 0], [AR + 22, AR + 22, 0], [AR + 22, -AR - 22, 0], [-AR - 22, AR + 22, 0], [0, 0, SZ + SR + 2]], 200, 165);
  const P = proj(C), front = facing(C);
  const sphere = (x, y, z, r) => { const pts = []; for (let i = -4; i <= 4; i++) { const t = i / 4.2; pts.push(...ringAt(P, disc(x, y, r * Math.sqrt(1 - t * t)), z + r * t)); } return poly(hull(pts)); };
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, BR, 48), disc(0, 0, BR - 3, 48), 0, 5));
  const sunG = mk("g", {}, g);
  put(solid(sunG), prism(P, front, disc(0, 0, 2.2, 16), disc(0, 0, 1.4, 16), 5, SZ - SR + 2));
  mk("path", { d: sphere(0, 0, SZ, SR), class: "sil" }, sunG);
  mk("path", { d: poly(ringAt(P, disc(0, 0, SR, 40), SZ)), class: "nf lo" }, sunG);
  const armG = mk("g", {}, g);
  const arm = mk("path", { class: "nf" }, armG), stem = mk("path", { class: "nf" }, armG);
  const orbit = mk("path", { class: "nf dash" }, armG);
  const earth = mk("path", { class: "sil" }, armG), eq = mk("path", { class: "nf lo" }, armG), moon = mk("path", { class: "sil" }, armG);
  const ang = spring(REST, { k: 60, c: 14 });
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const ex = AR * Math.cos(a), ey = AR * Math.sin(a), ma = a * (2 + turns * 6) + 1;
    const mx = ex + MD * Math.cos(ma), my = ey + MD * Math.sin(ma);
    arm.setAttribute("d", seg(P(0, 0, AZ), P(ex, ey, AZ)) + seg(P(0, 0, AZ - 3), P(ex, ey, AZ - 3)));
    stem.setAttribute("d", seg(P(ex, ey, AZ), P(ex, ey, EZ - ER)));
    orbit.setAttribute("d", poly(ringAt(P, disc(ex, ey, MD, 40), EZ)));
    earth.setAttribute("d", sphere(ex, ey, EZ, ER));
    eq.setAttribute("d", poly(ringAt(P, disc(ex, ey, ER, 32), EZ)));
    moon.setAttribute("d", sphere(mx, my, EZ, MR));
    if (ex + ey > 0) sunG.after(armG); else armG.after(sunG);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let t = REST, on = false;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], 0); if (Math.hypot(wx, wy) < AR + 40 && Math.hypot(wx, wy) > 8) { t = Math.atan2(wy, wx); on = true; } }
    let d = t - ang.t; d = Math.atan2(Math.sin(d), Math.cos(d));
    ang.t += d;
    earth.classList.toggle("hi", true);
    read.textContent = on ? "m" + (((Math.round(((t + Math.PI) / (2 * Math.PI)) * 12) % 12) + 12) % 12 + 1) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turns = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "tellurion",
  means: "A sun, earth and moon model: the arm turns the earth to where the pointer stands, and the moon circles it.",
  rules: [1, 3, 5, 6],
  range: [0, 0.5, 1],
  tour: [[112, 108], [59, 170], [112, 232], null],
  mount,
});
