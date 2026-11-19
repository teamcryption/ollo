/**
 * Surgical lamp: a ceiling canopy, a short pole, a long arm and a wide dome
 * head on a drop with a sterile handle under it. The pointer's place on the
 * floor swings the arm round its pole so the head hangs over that side. At
 * rest the arm reaches to the near left and the dome's rim is bright. The
 * slider is how far round the arm will swing.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, rrect, spring, stepS, unproj, disposer, mk, pointer, register, solid } = HL;

const ARM = 50, TOP = 108, ZA = 92, ZH = 54, RH = 22, REST = 120;
const D = Math.PI / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  const ext = [];
  for (let a = 0; a < 360; a += 30) ext.push([(ARM + RH) * Math.cos(a * D), (ARM + RH) * Math.sin(a * D), ZH - 6], [(ARM + RH) * Math.cos(a * D), (ARM + RH) * Math.sin(a * D), ZA + 4]);
  ext.push([0, 0, TOP + 4]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const ring = (r, cx, cy, z, n = 40) => circ(r, n).map((q) => P(cx + q.u, cy + q.v, z));
  const cyl = (s, cx, cy, r0, z0, r1, z1, cr) => {
    s.sil.setAttribute("d", poly(hull(ring(r0, cx, cy, z0).concat(ring(r1, cx, cy, z1)))));
    if (cr) s.cr.setAttribute("d", poly(ring(r1 - cr, cx, cy, z1)));
  };
  // static: canopy and pole
  const pole = mk("g", {}, g);
  cyl(solid(pole), 0, 0, 3, ZA, 3, TOP - 2, 1);
  cyl(solid(pole), 0, 0, 12, TOP - 2, 9, TOP + 4, 1.5);
  // moving: head (with handle), drop, arm
  const mv = mk("g", {}, g);
  const handle = solid(mv), head = solid(mv), drop = solid(mv), arm = solid(mv);
  head.sil.classList.add("hi");
  const aO = rrect(-4, -3, ARM + 4, 3, 3, 4), aI = rrect(-2.8, -1.8, ARM + 2.8, 1.8, 1.8, 4);
  const rot = (rg, a, z) => rg.map((q) => P(q.u * Math.cos(a) - q.v * Math.sin(a), q.u * Math.sin(a) + q.v * Math.cos(a), z));

  const ang = spring(REST);
  let last = NaN, behind = null;
  function draw() {
    const a = Math.round(ang.x * 10) / 10;
    if (a === last) return;
    last = a;
    const r = a * D, hx = ARM * Math.cos(r), hy = ARM * Math.sin(r);
    arm.sil.setAttribute("d", poly(hull(rot(aO, r, ZA - 4).concat(rot(aO, r, ZA)))));
    arm.cr.setAttribute("d", poly(rot(aI, r, ZA)));
    cyl(drop, hx, hy, 2.2, ZH + 12, 2.2, ZA - 2, 0);
    cyl(head, hx, hy, RH, ZH, 10, ZH + 13, 2);
    cyl(handle, hx, hy, 3, ZH - 7, 3, ZH, 0);
    const b = hx + hy < 0;
    if (b !== behind) { behind = b; if (b) g.insertBefore(mv, pole); else g.appendChild(mv); }
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  let goal = null;
  function retarget() {
    if (goal === null) { ang.t = REST; read.textContent = "rest"; }
    else {
      let d = goal - REST; d = ((d + 540) % 360) - 180;
      ang.t = REST + d * reach;
      read.textContent = Math.round(((ang.t % 360) + 360) % 360) + "°";
    }
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZH), r = Math.hypot(x, y);
      goal = r > 120 || r < 4 ? null : Math.atan2(y, x) / D;
      retarget();
    },
    leave: () => { goal = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return { set: (v) => { reach = clamp(v, 0, 1); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "surgicallamp",
  means: "A ceiling surgical lamp: its long arm swings round the pole so the wide dome head hangs over the pointer's side.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[315, 227], [209, 139], [130, 230], null],
  mount,
});
