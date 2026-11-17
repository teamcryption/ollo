/**
 * RAM slot: a memory stick standing in its long slot on a patch of
 * motherboard, a row of chips along its face and a latch clip at each end.
 * The pointer over the board swings both clips outward and the stick rises
 * out of the slot. At rest the stick is seated, bright, one clip leaning
 * loose. The slider is how far the stick rises.
 *
 * The pattern: one part lifting; the hit is the board's fixed plane.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, rad, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 92, H = 26, TH = 1.8, SZ = 6, CH = 15, OPEN = 38;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-14, -10, -4], [L + 14, 12, -4], [L + 14, -10, -4], [-14, 12, -4], [0, 0, SZ + H + 32], [L, TH, SZ + H + 32], [-14, 0, 14], [L + 14, 0, 14]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-14, -10, L + 14, 12, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const [sr, si] = rings(-6, -2.2, L + 6, TH + 2.2, 1.6, 0.7);
  const slot = solid(g);
  put(slot, prism(P, front, sr, si, 0, SZ));
  mk("path", { class: "nf lo", d: poly([P(0, 0, SZ), P(L, 0, SZ), P(L, TH, SZ), P(0, TH, SZ)]) }, slot.g);

  // a clip: a paddle hinged at its foot, leaning outward by b degrees
  function clip(xh, sgn) {
    const s = { sil: mk("path", { class: "sil" }, g), a: tween(0), last: NaN };
    s.draw = (b) => {
      if (b === s.last) return;
      s.last = b;
      const c = Math.cos(rad(b)), n = Math.sin(rad(b)), pts = [];
      for (const w of [-0.8, 3.2]) for (const u of [0, CH]) for (const y of [-2, TH + 2]) {
        const dx = -sgn * w, dz = u;
        pts.push(P(xh + c * dx - sgn * n * dz, y, SZ - 3 + sgn * n * dx + c * dz));
      }
      s.sil.setAttribute("d", poly(hull(pts)));
    };
    return s;
  }
  const left = clip(-1, 1);
  const stickG = mk("g", {}, g);
  const stick = solid(stickG), chips = mk("path", { class: "nf lo" }, stickG);
  stick.sil.classList.add("hi");
  const right = clip(L + 1, -1);
  const z = tween(0);
  let last = NaN;
  const [kr, ki] = rings(0, 0, L, TH, 0.6, 0.5);
  function drawStick(h) {
    if (h === last) return;
    last = h;
    const z0 = SZ + h, y = TH + 0.02;
    put(stick, prism(P, front, kr, ki, z0, z0 + H));
    let d = "";
    for (let k = 0; k < 8; k++) {
      const x0 = 4 + k * 10.8 + (k > 3 ? 2 : 0);
      d += poly([P(x0, y, z0 + 8), P(x0 + 8, y, z0 + 8), P(x0 + 8, y, z0 + 20), P(x0, y, z0 + 20)]);
    }
    chips.setAttribute("d", d + seg(P(2, y, z0 + 4), P(L - 2, y, z0 + 4)));
  }

  const B = register(stage, (_dt, now) => {
    drawStick(tval(z, now));
    left.draw(tval(left.a, now));
    right.draw(tval(right.a, now));
    return !tdone(z, now) || !tdone(left.a, now) || !tdone(right.a, now);
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const inside = (zz) => { const [x, y] = unproj(C, sx, sy, zz); return x > -20 && x < L + 20 && y > -20 && y < 18; };
    return inside(0) || inside(SZ + H * 0.6);
  }
  let on = null;
  function apply(o) {
    const now = performance.now();
    tset(left.a, o ? OPEN : 14, now, 0);
    tset(right.a, o ? OPEN : 0, now, 60);
    tset(z, o ? lift : 0, now, o ? 180 : 0);
    read.textContent = o ? "lift " + Math.round(lift) : "rest";
    B.wake();
  }
  function setOn(o) { if (o === on) return; on = o; apply(o); }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = clamp(v, 10, 32); if (on) apply(true); }, destroy: bag.dispose };
}

hairline({
  name: "ramstick",
  means: "A memory stick in its slot: the pointer swings the end clips open and the stick rises out of the slot.",
  rules: [1, 3, 5, 6],
  range: [10, 22, 32],
  tour: [[102, 168], [200, 159], [294, 302], null],
  mount,
});
