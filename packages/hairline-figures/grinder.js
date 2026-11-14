/**
 * Grinder: a bench grinder, a round motor on a foot with a stone wheel at
 * each end of its shaft. The pointer picks a wheel by which side it is on:
 * that wheel slides out along the shaft and turns, a notch on its face
 * showing the spin. At rest the right wheel stands a little out, bright.
 * The slider is how far the wheel slides.
 *
 * The pattern: one of two, picked by side.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const AZ = 44, R = 30, W = 12, MR = 20, ML = 70, FAV = 1;
// a vertical round in the y-z plane at x, centred (y, z)
const roundAt = (P, x, y, z, r, n = 40) => Array.from({ length: n }, (_, i) => {
  const t = (i / n) * Math.PI * 2; return P(x, y + r * Math.cos(t), z + r * Math.sin(t));
});

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-W - 30, -R, AZ - R], [ML + W + 30, R, AZ + R], [-10, -20, 0], [ML + 10, 20, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(ML / 2 - 26, -18, ML / 2 + 26, 18, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 6));
  const [pr, pi] = rings(ML / 2 - 9, -8, ML / 2 + 9, 8, 6, 2);
  const left = mk("g", {}, g);
  put(solid(g), prism(P, front, pr, pi, 6, AZ - MR + 2));
  mk("path", { d: poly(hull(roundAt(P, 0, 0, AZ, MR).concat(roundAt(P, ML, 0, AZ, MR)))), class: "sil" }, g);
  mk("path", { d: poly(roundAt(P, ML, 0, AZ, MR - 3)), class: "nf lo" }, g);
  const right = mk("g", {}, g);

  const wheels = [left, right].map((grp, k) => {
    const shaft = mk("path", { class: "nf lo" }, grp);
    const body = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp), notch = mk("path", { class: "nf lo" }, grp);
    return { k, grp, shaft, body, face, notch, s: tween(k === FAV ? 0.3 : 0), last: NaN, ang: k * 1.3 };
  });

  function draw(w, s) {
    if (s === w.last) return;
    w.last = s;
    const out = 4 + s * reach, sg = w.k ? 1 : -1;
    const xi = w.k ? ML + out : -out, xo = xi + sg * W;
    w.ang = s * Math.PI * 3 + w.k * 1.3;
    w.shaft.setAttribute("d", poly(hull(roundAt(P, w.k ? ML : 0, 0, AZ, 4, 16).concat(roundAt(P, xi, 0, AZ, 4, 16)))));
    w.body.setAttribute("d", poly(hull(roundAt(P, xi, 0, AZ, R).concat(roundAt(P, xo, 0, AZ, R)))));
    const fx = w.k ? xo : xi;
    w.face.setAttribute("d", poly(roundAt(P, fx, 0, AZ, 7, 20)));
    const a = P(fx, 9 * Math.cos(w.ang), AZ + 9 * Math.sin(w.ang)), b = P(fx, 25 * Math.cos(w.ang), AZ + 25 * Math.sin(w.ang));
    w.notch.setAttribute("d", "M" + a[0].toFixed(2) + " " + a[1].toFixed(2) + "L" + b[0].toFixed(2) + " " + b[1].toFixed(2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const w of wheels) { draw(w, tval(w.s, now)); if (!tdone(w.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mid = P(ML / 2, 0, AZ);
  function hit([sx, sy]) {
    if (Math.abs(sy - mid[1]) > 90 || Math.abs(sx - mid[0]) > 170) return -1;
    return Math.abs(sx - mid[0]) < 12 ? -1 : sx < mid[0] ? 0 : 1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    wheels.forEach((w, k) => {
      tset(w.s, a < 0 ? (k === FAV ? 0.3 : 0) : k === a ? 1 : 0, now, 0);
      w.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a ? "right" : "left";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "grinder",
  means: "A bench grinder with a stone wheel on each end: the wheel on the pointer's side slides out along the shaft and turns.",
  rules: [1, 3, 5, 6],
  range: [10, 22, 30],
  tour: [[132, 91], [268, 159], [140, 100], null],
  mount,
});
