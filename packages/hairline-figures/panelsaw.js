/**
 * Panel saw: a tall upright frame on two feet, a shelf along its foot with a
 * sheet stood on it against the frame, and a guide beam standing in front of
 * the sheet. The saw carriage rides the beam, motor out front and blade into
 * the sheet. The pointer's height pulls the carriage down the beam, on a
 * spring. At rest it sits near the top and is bright. The slider is how far
 * it can travel.
 *
 * The pattern: one part following a continuous input (slide).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.08, ZT = 90, RUN = 70, BX = 70;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.45);
  fit(C, [[-4, -22, 0], [124, -22, 0], [124, 32, 0], [-4, 32, 0], [0, -4, 116], [120, 2, 116], [BX, 50, 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, a, i, z0, z1)); return s; };
  // a disc standing across y (in the x-z plane) or across x (in the y-z plane)
  const xz = (cx, cz, r, y0, y1) => circ(r, 24).flatMap((q) => [P(cx + q.u, y0, cz + q.v), P(cx + q.u, y1, cz + q.v)]);
  const yz = (cy, cz, r, x0, x1) => circ(r, 28).flatMap((q) => [P(x0, cy + q.u, cz + q.v), P(x1, cy + q.u, cz + q.v)]);
  box(solid(g), -4, -22, 8, 30, 0, 4, 2, 1);
  box(solid(g), 112, -22, 124, 30, 0, 4, 2, 1);
  box(solid(g), 0, -6, 6, 0, 4, 114, 2, 0.8);
  box(solid(g), 114, -6, 120, 0, 4, 114, 2, 0.8);
  box(solid(g), 0, -6, 120, 0, 106, 114, 2, 1);
  box(solid(g), -4, -6, 124, 16, 8, 13, 2, 1.2);
  box(solid(g), 8, 0, 110, 4, 13, 98, 1.5, 0.8);
  box(solid(g), BX - 4, 6, BX + 4, 11, 6, 118, 2, 0.8);
  const blade = mk("path", { class: "sil" }, g), carr = solid(g), motor = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf lo" }, g);
  carr.sil.classList.add("hi");
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const v = sp.x;
    if (v === last) return;
    last = v;
    const cz = ZT - v * RUN * reach / 100;
    blade.setAttribute("d", poly(hull(yz(14, cz - 2, 20, BX - 1, BX + 1))));
    box(carr, BX - 17, 10, BX + 17, 26, cz - 6, cz + 24, 5, 1.6);
    motor.setAttribute("d", poly(hull(xz(BX, cz + 9, 13, 26, 46))));
    cap.setAttribute("d", poly(circ(10, 24).map((q) => P(BX + q.u, 46, cz + 9 + q.v))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const yT = P(BX, 17, ZT + 8)[1], yB = P(BX, 17, ZT - RUN + 8)[1], xs = [P(0, 30, 0)[0], P(120, -6, 0)[0]];
  let state = "";
  function set(p) {
    let t = REST, on = false;
    if (p && p[0] > xs[0] && p[0] < xs[1] && p[1] > yT - 40 && p[1] < yB + 40) { t = clamp((p[1] - yT) / (yB - yT), 0, 1); on = true; }
    sp.t = t;
    const s = on ? Math.round(t * RUN * reach / 100) + "cm" : "rest";
    if (s !== state) { state = s; read.textContent = s; }
    B.wake();
  }
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "panelsaw",
  means: "A vertical panel saw with a sheet stood in its frame: the pointer's height pulls the saw carriage down the beam.",
  rules: [1, 3, 5, 8],
  range: [30, 100, 100],
  tour: [[200, 132], [199, 172], [198, 214], null],
  mount,
});
