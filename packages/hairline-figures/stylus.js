/**
 * Stylus holder: a low charging dock with a round sleeve standing on it,
 * and a stylus sunk in the sleeve, its clicker band near the top. The
 * pointer over the dock tips the stylus out of the sleeve, to the side. At rest the
 * stylus stands docked and the dock's charge light is bright. The slider is
 * how far it tips.
 *
 * The pattern: one part tipping on its pivot; the hit is the dock's rest top,
 * which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DZ = 7, CZ = 30, SR = 5, LEN = 84, SINK = 20, REST = 4, A0 = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-44, -30, 0], [44, 30, 0], [44, -30, 0], [-44, 30, 0], [0, 0, CZ + LEN - SINK + 2], [50, -50, CZ + 26]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-44, -30, 44, 30, 14, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));
  const led = mk("circle", { r: 2.8, class: "dot" }, g);
  const lp = P(30, 18, DZ); led.setAttribute("cx", lp[0]); led.setAttribute("cy", lp[1]);
  put(solid(g), prism(P, front, circ(11, 40), circ(SR + 1.4, 40), DZ, CZ));
  const pen = solid(g);
  pen.sil.setAttribute("class", "sil");
  const cap = mk("path", { class: "nf lo" }, g);
  const tilt = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const t = (deg * Math.PI) / 180, d = [Math.sin(t) * A0, -Math.sin(t) * A0, Math.cos(t)], v = [Math.cos(t) * A0, -Math.cos(t) * A0, -Math.sin(t)], u = [A0, A0, 0];
    const ring = (off, r) => Array.from({ length: 32 }, (_, i) => {
      const a = (i / 32) * Math.PI * 2, q = (j) => [0, 0, CZ][j] + d[j] * off + r * (Math.cos(a) * u[j] + Math.sin(a) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const len = LEN - SINK + deg * 0.5;
    pen.sil.setAttribute("d", poly(hull(ring(0, SR).concat(ring(len, SR)))));
    cap.setAttribute("d", poly(ring(len, SR - 1.2)));
  }
  const L = register(stage, (_dt, now) => { draw(tval(tilt, now)); return !tdone(tilt, now); });
  bag.add(L.unregister);

  let on = null;
  function setActive(a, force) {
    if (a === on && !force) return;
    on = a;
    tset(tilt, a ? 25 + 45 * max : REST, performance.now(), 0);
    pen.sil.classList.toggle("hi", a);
    led.setAttribute("class", a ? "dot off" : "dot");
    read.textContent = a ? "tilt " + Math.round(25 + 45 * max) + "°" : "rest";
    L.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, DZ); return Math.abs(x) < 48 && Math.abs(y) < 34; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = clamp(v, 0, 1); if (on) setActive(true, true); }, destroy: bag.dispose };
}

hairline({
  name: "stylus",
  means: "A stylus in its charging dock: the pointer over the dock tips the stylus out of its sleeve, as far as the slider says.",
  rules: [1, 4, 5, 9],
  range: [0, 0.6, 1],
  tour: [[196, 234], [165, 195], [201, 259], null],
  mount,
});
