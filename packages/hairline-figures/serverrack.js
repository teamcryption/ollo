/**
 * Server rack: a cabinet of eight blades, each with a pull handle, vents and
 * a status light on its face. The pointer's height says where the update is:
 * the blades near it slide out of the rack, the farther the less, each on its
 * own spring, and the one under it is bright. At rest a few blades stand half
 * out where the last update stopped. The slider is the reach, in blades.
 *
 * The pattern: a field along one axis (terrain). The pick is read on the
 * cabinet's face plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const N = 8, W = 64, D = 48, BH = 10, GAP = 2.4, Z0 = 7, OUT = 28, IN = 4;
const H = Z0 + N * (BH + GAP) + 5;
const REST = [0, 0, 5, 13, 7, 0, 0, 0], FAV = 3;
const fall = (u) => (u <= 0.5 ? 1 : u <= 1 ? 1 - (u - 0.5) * 1.5 : 0.1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 1.78);
  fit(C, [[0, 0, 0], [W, D + OUT, 0], [W, 0, 0], [0, D + OUT, 0], [0, 0, H], [W, 0, H]], 200, 162);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the cabinet's body, then the mouth of its open front, behind the blades
  const [cr, ci] = rings(0, 0, W, D, 2.5, 1.2);
  put(solid(g), prism(P, front, cr, null, 0, H));
  const f = (x, z) => P(x, D, z);
  mk("path", { d: poly([f(2.5, 3), f(W - 2.5, 3), f(W - 2.5, H - 3), f(2.5, H - 3)]), class: "nf lo" }, g);

  const blades = [];
  for (let k = 0; k < N; k++) {
    const z0 = Z0 + k * (BH + GAP), el = solid(g), face = mk("g", {}, el.g);
    const vents = mk("path", { class: "nf lo" }, face), handle = mk("path", { class: "nf" }, face);
    const led = mk("circle", { r: 1.3, class: k === FAV ? "dot" : "dot off" }, face);
    blades.push({ k, z0, el, vents, handle, led, sp: spring(REST[k], { eps: 0.05 }), drawn: NaN });
  }
  // the cabinet's side and top, painted over the blades' insides
  const side = mk("path", { class: "sil" }, g), top = solid(g);
  side.setAttribute("d", poly([P(W, 0, 0), P(W, D, 0), P(W, D, H), P(W, 0, H)]));
  put(top, prism(P, front, cr, ci, H - 0.01, H));

  function draw(b) {
    const s = Math.max(0, b.sp.x);
    if (s === b.drawn) return;
    b.drawn = s;
    const [r, i] = rings(IN, s, W - IN, D + s, 1.4, 0.8);
    put(b.el, prism(P, front, r, i, b.z0, b.z0 + BH));
    const y = D + s, zm = b.z0 + BH / 2, q = (x, z) => P(x, y, z);
    let v = "";
    for (let x = IN + 6; x < IN + 26; x += 3.2) v += seg(q(x, zm - 2.2), q(x, zm + 2.2));
    b.vents.setAttribute("d", v);
    b.handle.setAttribute("d", seg(q(W - IN - 14, zm), q(W - IN - 6, zm)));
    place(b.led, q(IN + 3.5, zm));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of blades) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  /** The height on the cabinet's face (y = D) under the point; null off the face. */
  function height([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    return x < -6 || x > W + 6 || z < 0 || z > H ? null : z;
  }

  function retarget() {
    let mark = FAV;
    if (over == null) blades.forEach((b) => (b.sp.t = REST[b.k]));
    else {
      blades.forEach((b) => (b.sp.t = OUT * fall(Math.abs(b.z0 + BH / 2 - over) / (reach * (BH + GAP)))));
      mark = clamp(Math.floor((over - Z0) / (BH + GAP)), 0, N - 1);
    }
    blades.forEach((b) => { b.el.sil.classList.toggle("hi", b.k === mark); b.led.setAttribute("class", b.k === mark ? "dot" : "dot off"); });
    read.textContent = over == null ? "rest" : "blade " + (mark + 1);
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { over = height(p); retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; if (over != null) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "serverrack",
  means: "A rack of eight server blades: the blades near the pointer's height slide out, the nearest furthest.",
  rules: [1, 3, 5, 6],
  range: [1, 1.8, 3],
  tour: [[187, 225], [187, 168], [187, 112], null],
  mount,
});
