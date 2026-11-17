/**
 * Beauty dish: a wide shallow reflector on a light stand, with a small
 * deflector plate held in its middle. The pointer aims the dish: up and down
 * the frame tilts it, across swivels it. At rest it faces the viewer, tilted
 * down a little, and the deflector is bright. The slider is how stiffly it follows.
 *
 * The pattern: a continuous aim on two springs (spotlights).
 */
const {
  Cam, circ, clamp, fit, hull, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 36, DEEP = 13, PZ = 58, REST = [-12, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-40, -40, 0], [40, 40, 0], [40, -40, 0], [-40, 40, 0], [0, 0, PZ + R + 6], [30, 30, PZ + 30], [-30, -30, PZ + 30]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const front = (q) => q.nu + q.nv > 0;
  put(solid(g), prism(P, front, circ(16, 40), circ(14, 40), 0, 3));
  const [pr, pi] = rings(-1.6, -1.6, 1.6, 1.6, 1.5, 0.5);
  put(solid(g), prism(P, front, pr, pi, 3, PZ));
  const shell = mk("path", { class: "sil" }, g), mouth = mk("path", { class: "nf lo" }, g);
  const rod = mk("path", { class: "nf lo" }, g), plate = mk("path", { class: "nf hi" }, g);
  const sp = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const tilt = spring(REST[0], sp), turn = spring(REST[1], sp);
  let last = "";

  function draw() {
    const key = tilt.x.toFixed(2) + "," + turn.x.toFixed(2);
    if (key === last) return;
    last = key;
    const t = (tilt.x * Math.PI) / 180, f = ((turn.x - 45) * Math.PI) / 180, cf = Math.cos(f), sf = Math.sin(f);
    const rz = ([x, y, z]) => [x * cf - y * sf, x * sf + y * cf, z];
    const e1 = rz([1, 0, 0]), e2 = rz([0, -Math.sin(t), Math.cos(t)]), e3 = rz([0, Math.cos(t), Math.sin(t)]);
    const at = (r, w, n = 48) => circ(r, n).map((q) => P(...[0, 1, 2].map((j) => [0, 0, PZ][j] + e1[j] * q.u + e2[j] * q.v + e3[j] * w)));
    const rim = at(R, DEEP), seen = e3[0] + e3[1] + e3[2] * 1.2 > 0;
    shell.setAttribute("d", poly(hull(at(9, 0).concat(at(R * 0.8, DEEP * 0.7), rim))));
    mouth.setAttribute("d", seen ? poly(rim) : "");
    rod.setAttribute("d", seen ? poly(hull(at(1.2, 0, 12).concat(at(1.2, DEEP + 4, 12)))) : "");
    plate.setAttribute("d", seen ? poly(hull(at(10, DEEP + 4).concat(at(10, DEEP + 5.2)))) : "");
  }

  const B = register(stage, (dt) => { const a = stepS(tilt, dt), b = stepS(turn, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { tilt.t = REST[0]; turn.t = REST[1]; read.textContent = "rest"; }
    else {
      tilt.t = Math.round(clamp((180 - p[1]) / 1.6, -40, 70));
      turn.t = Math.round(clamp((p[0] - 200) / 1.6, -80, 80));
      read.textContent = (tilt.t >= 0 ? "up " : "dn ") + Math.abs(tilt.t) + "°";
    }
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return {
    set: (v) => { tilt.k = turn.k = 100 * v; tilt.c = turn.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "diffuser",
  means: "A beauty dish on a light stand: the wide reflector tilts and swivels to aim where the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[330, 60], [260, 130], [110, 240], null],
  mount,
});
