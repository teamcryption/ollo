/**
 * Walking frame: four legs, two side rails with grips and two crossbars. The
 * pointer picks a grip by which side it stands on: that grip goes bright and
 * the frame lifts off the floor, as a hand would raise it for a step. The
 * dots on the floor mark where its feet rest. At rest the near grip is
 * bright and the frame stands down. The slider is the lift.
 *
 * The pattern: one object, two sides (pick by world y on the ground).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween, unproj, flatDot, place, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DX = 26, DY = 34, H = 40, T = 2.4;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = 4 + (value / 90) * 12;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-4, -4, 0], [DX + 4, DY + 4, 0], [-4, DY + 4, 0], [DX + 4, -4, 0], [0, 0, H + 20], [DX, DY, H + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[0, 0], [DX, 0], [0, DY], [DX, DY]]) place(flatDot(g, C, 1.6, "dot off"), P(x, y, 0));
  const parts = [], add = (x0, y0, x1, y1, z0, z1) => { const s = solid(g); parts.push({ s, b: [x0, y0, x1, y1, z0, z1] }); return s; };
  const leg = (x, y) => add(x - T / 2, y - T / 2, x + T / 2, y + T / 2, 0, H);
  leg(0, 0); leg(DX, 0);
  add(-1, -T / 2, DX + 1, T / 2, H - 2, H + 0.5);
  const g0 = add(-3, -2, 9, 2, H, H + 3);
  leg(0, DY);
  add(DX - T / 2, 0, DX + T / 2, DY, H - 2, H + 0.5);
  add(DX - T / 2, 0, DX + T / 2, DY, 16, 18.4);
  leg(DX, DY);
  add(-1, DY - T / 2, DX + 1, DY + T / 2, H - 2, H + 0.5);
  const g1 = add(-3, DY - 2, 9, DY + 2, H, H + 3);
  const grips = [g0, g1];
  const z = tween(0);
  let last = NaN;
  function draw(dz) {
    if (dz === last) return;
    last = dz;
    for (const { s, b: [x0, y0, x1, y1, z0, z1] } of parts) {
      const [o, i] = rings(x0, y0, x1, y1, 0.9, 0.4);
      put(s, prism(P, front, o, i, z0 + dz, z1 + dz));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a < 0 ? 0 : lift, performance.now(), 0);
    grips.forEach((s, k) => s.sil.classList.toggle("hi", k === (a < 0 ? 1 : a)));
    read.textContent = a < 0 ? "rest" : a === 0 ? "grip L" : "grip R";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -30 || x > DX + 50 || y < -30 || y > DY + 30) return -1;
    return clamp(y, -30, DY + 30) < DY / 2 ? 0 : 1;
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = 4 + (v / 90) * 12; if (act >= 0) { act = -3; } }, destroy: bag.dispose };
}

hairline({
  name: "walkingframe",
  means: "A walking frame on four feet: the pointer takes one grip, it goes bright and the frame lifts off the floor for a step.",
  rules: [1, 3, 4, 5],
  range: [0, 45, 90],
  tour: [[236, 231], [169, 265], [159, 270], null],
  mount,
});
