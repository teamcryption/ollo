/**
 * Drum key: a T-handled tuning key seated on a tension rod at the rim of a
 * snare. The pointer is where the hand turns it: the key's paddle swings on
 * a spring to point at the pointer, round its square socket. At rest it sits
 * a quarter-turn askew, bright. The slider is how stiff the turn is.
 *
 * The pattern: a continuous aim on one part; the hit is the floor's plane.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 44, H = 18, KX = 18, KY = 18, ROD = 26, SOCK = 44, WING = 66, REST = 0.55;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [KX - 30, KY - 30, WING], [KX + 30, KY + 30, WING], [KX - 30, KY + 30, WING], [KX + 30, KY - 30, WING]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R, 64), circ(R - 2.5, 64), 0, H));
  mk("path", { class: "nf lo", d: "M" + circ(R - 7, 64).map((q) => P(q.u, q.v, H).join(",")).join("L") + "Z" }, g);
  put(solid(g), prism(P, front, disc(KX, KY, 5, 20), disc(KX, KY, 4, 20), H, H + 3));
  put(solid(g), prism(P, front, disc(KX, KY, 2, 16), null, H + 3, ROD));
  const [sq, sqi] = rings(-4.5, -4.5, 4.5, 4.5, 1.5, 0.8);
  const sock = solid(g), neck = solid(g), wing = solid(g);
  const [wr, wi] = rings(-28, -3.2, 28, 3.2, 3, 1);
  const [nr] = rings(-6, -2.6, 6, 2.6, 2, 0.6);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    put(sock, prism(P, front, turn(sq, a, KX, KY), turn(sqi, a, KX, KY), ROD - 6, SOCK));
    put(neck, prism(P, front, turn(nr, a, KX, KY), null, SOCK, SOCK + 4));
    put(wing, prism(P, front, turn(wr, a, KX, KY), turn(wi, a, KX, KY), SOCK + 4, WING));
  }
  wing.sil.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [wx, wy] = unproj(C, sx, sy, 0);
      const want = Math.atan2(wy - KY, wx - KX);
      sp.t = sp.x + wrap(want - sp.x);
      read.textContent = "turn " + Math.round(((want * 180) / Math.PI + 360) % 180);
      B.wake();
    },
    leave: () => { sp.t = sp.x + wrap(REST - sp.x); read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "drumkey",
  means: "A T-handled drum key on a snare's tension rod: its paddle turns on a spring to point at the pointer, round its socket.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 2],
  tour: [[86, 214], [200, 141], [330, 206], null],
  mount,
});
