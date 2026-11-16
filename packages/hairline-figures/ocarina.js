/**
 * Ocarina: a round-bellied clay ocarina, a short mouthpiece at one end and
 * finger holes across its back, resting on a low ring. The pointer is the
 * player's lips: the ocarina turns on its ring to point its mouthpiece there,
 * on a spring. At rest it lies a little turned, bright. The slider is how
 * quickly it follows (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (a spring on one angle); the hit is the
 * pointer's screen x, which never moves with the drawing.
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RX = 36, RY = 23, RZ = 14, CZ = 18, REST = 0.45;
const HOLES = [[-12, -10, 2.6], [2, -12, 2.6], [14, -8, 2.4], [-10, 9, 2.6], [5, 11, 3], [18, 4, 2]];
const BODY = [];
for (let i = 0; i <= 8; i++) for (let j = 0; j < 24; j++) {
  const la = -Math.PI / 2 + (i / 8) * Math.PI, lo = (j / 24) * Math.PI * 2;
  BODY.push([RX * Math.cos(la) * Math.cos(lo), RY * Math.cos(la) * Math.sin(lo), CZ + RZ * Math.sin(la)]);
}
for (const x of [-RX - 12, -RX + 6]) for (const y of [-5, 5]) for (const z of [CZ - 1, CZ + 6]) BODY.push([x, y * (x < -RX ? 0.9 : 1.2), z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.85);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([(RX + 12) * Math.cos(a), (RX + 12) * Math.sin(a), 0], [(RX + 12) * Math.cos(a), (RX + 12) * Math.sin(a), CZ + RZ]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(16, 48), circ(14.4, 48), 0, 5));
  const body = solid(g);
  body.sil.classList.add("hi");
  const holes = mk("path", { class: "nf" }, g);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a);
    const at = (x, y, z) => P(x * c - y * s, x * s + y * c, z);
    const crz = CZ + RZ * 0.6, k = Math.sqrt(1 - 0.36);
    const crease = circ(1, 48).map((q) => at(RX * k * q.u, RY * k * q.v, crz));
    put(body, { sil: poly(hull(BODY.map((p) => at(...p)))), crease: poly(crease) });
    let d = "";
    for (const [x, y, r] of HOLES) {
      const z = CZ + RZ * Math.sqrt(Math.max(0, 1 - (x / RX) ** 2 - (y / RY) ** 2)) + 0.2;
      d += poly(circ(r, 16).map((q) => at(x + q.u, y + q.v, z)));
    }
    holes.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over == null ? REST : over;
    read.textContent = over == null ? "rest" : Math.round((over * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = clamp(lerp(-0.9, 1.6, (p[0] - 80) / 240), -0.9, 1.6); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "ocarina",
  means: "A clay ocarina on a low ring: it turns to point its mouthpiece at the pointer, finger holes riding round on top.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[118, 133], [309, 214], [309, 105], null],
  mount,
});
