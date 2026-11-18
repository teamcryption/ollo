/**
 * Post hole digger: two long poles hinged on a bolt above a pair of curved
 * clamshell blades standing in a hole. Pointing at the digger spreads the
 * handles apart and the blades swing shut on the soil. At rest the handles
 * are nearly together, blades open and bright. The slider is how far the
 * handles spread.
 */
const { Cam, clamp, fit, hull, open, poly, proj, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const Q = Math.SQRT1_2, L = 100, HZ = 26, REST = 14;
const W = (s, w, z) => [(s + w) * Q, (w - s) * Q, z];

function bar(P, A, B, r, n = 14) {
  let d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
  const dn = Math.hypot(...d); d = d.map((x) => x / dn);
  const k = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [d[1] * k[2] - d[2] * k[1], d[2] * k[0] - d[0] * k[2], d[0] * k[1] - d[1] * k[0]];
  const un = Math.hypot(...u); u = u.map((x) => x / un);
  const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
  const ring = (c) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, q = (j) => c[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
    return P(q(0), q(1), q(2));
  });
  return poly(hull(ring(A).concat(ring(B))));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [W(-76, 0, HZ + 80), W(76, 0, HZ + 80), W(0, 0, HZ + L + 4), W(0, -22, 0), W(0, 22, 0)], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const holeRing = Array.from({ length: 40 }, (_, i) => { const t = (i / 40) * Math.PI * 2; return P(...W(22 * Math.cos(t), 22 * Math.sin(t), 0)); });
  mk("path", { d: poly(holeRing), class: "nf lo" }, g);
  const sides = [-1, 1].map((sg) => ({
    sg,
    blade: mk("path", { class: "sil" }, g), rim: mk("path", { class: "nf lo" }, g),
  }));
  for (const sd of sides) { sd.pole = mk("path", { class: "sil" }, g); sd.grip = mk("path", { class: "sil" }, g); }
  const bolt = mk("path", { class: "sil" }, g);
  bolt.setAttribute("d", bar(P, W(0, -6, HZ), W(0, 6, HZ), 2.6));

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = clamp((a - REST) / 26, 0, 1), sn = Math.sin(rad(a)), cs = Math.cos(rad(a));
    for (const { sg, blade, rim, pole, grip } of sides) {
      const top = [], bot = [];
      const tip = sg * (13 - 11 * t);
      for (let i = 0; i <= 10; i++) {
        const th = -Math.PI / 2 + (i / 10) * Math.PI;
        top.push(P(...W(sg * 3 + sg * 6 * Math.cos(th), 10 * Math.sin(th), HZ - 4)));
        bot.push(P(...W(tip + sg * 3 * Math.cos(th), 7 * Math.sin(th), 2)));
      }
      blade.setAttribute("d", poly(hull(top.concat(bot))));
      rim.setAttribute("d", open(top));
      const at = (f) => W(sg * (2 + f * L * sn), 0, HZ + f * L * cs);
      pole.setAttribute("d", bar(P, at(0), at(0.86), 2.1));
      grip.setAttribute("d", bar(P, at(0.84), at(1.04), 3.4));
    }
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // the hit box is the rest pose, which never moves
  const tl = P(...W(-34, 0, HZ + L + 4)), br = P(...W(34, 0, 0)), hinge = P(...W(0, 0, HZ))[1];
  const hit = ([sx, sy]) => sx > tl[0] - 18 && sx < br[0] + 18 && sy > tl[1] - 14 && sy < br[1] + 24 ? (sy < hinge ? 1 : 0) : -1;

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? REST : maxA, performance.now(), 0);
    for (const s of sides) {
      s.blade.classList.toggle("hi", a < 0);
      s.pole.classList.toggle("hi", a >= 0); s.grip.classList.toggle("hi", a >= 0);
    }
    read.textContent = a < 0 ? "rest" : a === 1 ? "grips" : "blades";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act >= 0) { tset(ang, maxA, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "postholedigger",
  means: "A post hole digger: point at it and the long handles spread apart while the clamshell blades swing shut.",
  rules: [1, 3, 5, 8],
  range: [26, 38, 48],
  tour: [[263, 40], [200, 245], [137, 40], null],
  mount,
});
