/**
 * Land yacht: a long spine on three wheels, a cross beam at the back, a
 * tall mast and one triangular sail on a boom. The pointer on the ground is
 * where the wind comes from: the boom swings round the mast to set the sail
 * against it, on a spring. At rest the sail is sheeted a little to one side
 * and bright. The slider is how far the boom may swing.
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const MX = 14, MT = 104, BZ = 20, BL = 62, REST = 0.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-52, -38, 0], [50, 38, 0], [MX, 0, MT], [MX - BL, -BL, BZ], [MX - BL, BL, BZ]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => mk("path", { class: "sil", d: poly(circ(9, 24).map((q) => P(x + q.u, y, 9 + q.v))) }, g);
  wheel(-30, -36);
  const [cr, ci] = rings(-34, -38, -26, 38, 2.5, 0.8);
  put(solid(g), prism(P, front, cr, ci, 9, 14));
  const [sr, si] = rings(-52, -4, 50, 4, 3, 1);
  put(solid(g), prism(P, front, sr, si, 10, 16));
  const [er, ei] = rings(-26, -7, -8, 7, 4, 1);
  put(solid(g), prism(P, front, er, ei, 16, 22));
  wheel(46, 0);
  wheel(-30, 36);
  const mast = mk("path", { class: "nf sil" }, g);
  mast.setAttribute("d", seg(P(MX, 0, 16), P(MX, 0, MT)));
  const sail = mk("path", { class: "sil hi" }, g), bat = mk("path", { class: "nf lo" }, g), boom = mk("path", { class: "nf sil" }, g);
  const ang = spring(REST);
  let maxA = 1.35 * value, over = null, last = 99;

  function draw() {
    if (Math.abs(ang.x - last) < 1e-4) return;
    last = ang.x;
    const c = Math.cos(ang.x), s = Math.sin(ang.x);
    const at = (t, z) => P(MX - BL * t * c, -BL * t * s, z);
    const leech = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, z = BZ + (MT - BZ) * (1 - t), bl = 6 * Math.sin(t * Math.PI);
      leech.push(P(MX - BL * t * c + s * bl, -BL * t * s - c * bl, z));
    }
    sail.setAttribute("d", poly([P(MX, 0, BZ)].concat(leech.reverse())));
    const b = [];
    for (const t of [0.3, 0.55, 0.8]) {
      const z = BZ + (MT - BZ) * (1 - t);
      b.push(seg(P(MX, 0, z), at(t, z)));
    }
    bat.setAttribute("d", b.join(""));
    boom.setAttribute("d", seg(P(MX, 0, BZ), at(1.04, BZ)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    ang.t = over == null ? REST : clamp(over, -maxA, maxA);
    read.textContent = over == null ? "rest" : `boom ${Math.round((ang.t * 180) / Math.PI)}°`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.hypot(x, y) > 140 ? null : Math.atan2(-y, MX + 20 - x);
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { maxA = 1.35 * v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "landyacht",
  means: "A land yacht on three wheels: the pointer is the wind, and the boom swings the sail round the mast to meet it.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[330, 180], [173, 221], [250, 255], null],
  mount,
});
