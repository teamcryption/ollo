/**
 * Gumball machine: a glass globe of gumballs on a squat body, a cap on top and
 * a crank on the body's face. The pointer on the machine turns the crank, and
 * the wheel under the globe stirs the gumballs round on a spring. At rest the
 * crank sits a little turned, bright. The slider is how far the crank turns.
 *
 * The pattern: a continuous aim on one angle; the hit is the machine's rest
 * box on screen.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, poly, open, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const GR = 21, GZ = 54, BALL = 4.6, REST = 0.3, TURN = 2.4;
const BALLS = [];
for (let i = 0; i < 16; i++) { const a = i * 2.4, h = -0.8 + (i / 15) * 1.3, r = 15 * Math.sqrt(1 - h * h * 0.5); BALLS.push([r * Math.cos(a), r * Math.sin(a), GZ + h * 12]); }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-16, -16, 0], [16, 16, 0], [0, 0, GZ + GR + 5], [-GR, GR, GZ], [GR, -GR, GZ]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [b0, b1] = rings(-16, -16, 16, 16, 6, 1.8);
  put(solid(g), prism(P, front, b0, b1, 0, 32));
  const ctr = P(0, 0, GZ), R = GR * C.S, gl = [];
  for (let i = 0; i < 48; i++) { const t = (i / 48) * Math.PI * 2; gl.push([ctr[0] + R * Math.cos(t), ctr[1] + R * Math.sin(t)]); }
  mk("path", { class: "sil", d: poly(gl) }, g);
  const balls = mk("g", {}, g);
  const bEls = BALLS.map(() => mk("path", { class: "" }, balls));
  put(solid(g), prism(P, front, circ(10, 32), circ(8.6, 32), 32, 36));
  put(solid(g), prism(P, front, circ(6, 24), circ(4.8, 24), GZ + GR - 1, GZ + GR + 4));
  // the chute and the crank on the +x face
  const chute = [];
  for (let i = 0; i <= 8; i++) { const t = Math.PI + (i / 8) * Math.PI; chute.push(P(16.2, 5 * Math.cos(t), 9 + 5 * Math.sin(t) * -1)); }
  mk("path", { class: "nf lo", d: poly(chute) }, g);
  const hub = [];
  for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; hub.push(P(16.4, 6 * Math.cos(t), 21 + 6 * Math.sin(t))); }
  mk("path", { class: "", d: poly(hub) }, g);
  const crank = mk("path", { class: "nf sil hi" }, g);

  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const pts = BALLS.map(([x, y, z], i) => { const c = Math.cos(a), s = Math.sin(a); return { i, x: x * c - y * s, y: x * s + y * c, z }; });
    pts.sort((p, q) => p.x + p.y - (q.x + q.y) - (p.z - q.z) * 0.3);
    pts.forEach((p, j) => {
      const c0 = P(p.x, p.y, p.z), r = BALL * C.S, d = [];
      for (let k = 0; k < 16; k++) { const t = (k / 16) * Math.PI * 2; d.push([c0[0] + r * Math.cos(t), c0[1] + r * Math.sin(t)]); }
      bEls[j].setAttribute("d", poly(d));
    });
    const f = a * 2.5, c = Math.cos(f), s = Math.sin(f);
    crank.setAttribute("d", open([P(17, -11 * c, 21 - 11 * s), P(17, 11 * c, 21 + 11 * s), P(21, 11 * c, 21 + 11 * s)]));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const lo = P(0, 0, 0), hi = P(0, 0, GZ + GR + 4);
  let over = false;
  function retarget() {
    sp.t = over ? REST + amt * TURN : REST;
    read.textContent = over ? "turn " + Math.round((amt * TURN * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { over = Math.abs(sx - lo[0]) < 85 && sy > hi[1] - 10 && sy < lo[1] + 50; retarget(); },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "gumball",
  means: "A gumball machine: the pointer turns its crank and the gumballs in the glass globe stir round.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[236, 217], [200, 140], [165, 245], null],
  mount,
});
