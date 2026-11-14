/**
 * Mic stand: a round base, a pole, and a boom with a counterweight and a mic
 * on its end. The pointer is the singer: the boom swings round on a spring to
 * aim the mic at it. At rest it is turned a little off-axis, the mic bright.
 * The slider is the boom's reach.
 *
 * The hit is on the ground plane, which never moves; the aim is its angle
 * about the pole. Paint order flips the arm's two ends round the pole.
 */
const {
  Cam, circ, clamp, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 74, RB = 20, REST = -0.6, BACK = 14;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const at = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let BL = value, over = null;
  const C = Cam(45, 0.5, 2.5);
  const ext = [];
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; ext.push([Math.cos(a) * 66, Math.sin(a) * 62, H + 4], [Math.cos(a) * 62, Math.sin(a) * 62, H - 16], [Math.cos(a) * RB, Math.sin(a) * RB, 0]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const cyl = (el, r, b, x, y, z0, z1) => put(el, prism(P, front, at(circ(r, 24), x, y), at(circ(r - b, 24), x, y), z0, z1));

  cyl(solid(g), RB, 1.6, 0, 0, 0, 3);
  cyl(solid(g), 7, 1, 0, 0, 3, 6);
  const back = mk("g", {}, g), pole = mk("g", {}, g), fore = mk("g", {}, g);
  cyl(solid(pole), 1.7, 0.6, 0, 0, 6, H - 2);
  const weight = solid(back), boom = solid(fore), mic = solid(fore), knob = solid(fore);
  const grille = mk("path", { class: "nf lo" }, mic.g);
  const yaw = spring(REST, { eps: 0.002 });
  let drawn = NaN, len = BL;

  function draw() {
    const a = yaw.x;
    if (a === drawn && len === BL) return;
    drawn = a; len = BL;
    const c = Math.cos(a), s = Math.sin(a);
    const [o, i] = rings(-BACK, -1.3, BL, 1.3, 1.3, 0.5);
    put(boom, prism(P, front, rot(o, a), rot(i, a), H, H + 2.6));
    cyl(weight, 4.2, 0.9, -c * BACK, -s * BACK, H - 2, H + 5);
    cyl(knob, 3, 0.8, 0, 0, H - 3, H + 3.6);
    cyl(mic, 4.6, 1, c * BL, s * BL, H - 15, H + 1);
    const ring = at(circ(4.6, 24), c * BL, s * BL), pts = ring.filter(front).map((q) => P(q.u, q.v, H - 9));
    grille.setAttribute("d", pts.length ? "M" + pts.map((p) => p.join(" ")).join("L") : "");
    // the end nearer the viewer paints over the pole
    if (c + s > 0) g.append(back, pole, fore);
    else g.append(fore, pole, back);
  }
  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    const goal = over ? Math.atan2(over[1], over[0]) : REST;
    yaw.t = yaw.x + wrap(goal - yaw.x);
    mic.sil.classList.toggle("hi", true);
    const deg = Math.round((goal * 180) / Math.PI + 360) % 360;
    read.textContent = over ? "aim " + deg + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > 6 && r < 120 ? [x, y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { BL = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "microphones",
  means: "A mic on a boom stand: the boom swings round its pole to aim the mic at the pointer.",
  rules: [1, 3, 5, 9],
  range: [30, 46, 60],
  tour: [[94, 269], [244, 229], [271, 313], null],
  mount,
});
