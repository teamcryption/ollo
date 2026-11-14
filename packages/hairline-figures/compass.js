/**
 * Compass: a round hiking compass lying on a base plate, a dial of four dim
 * dots round its rim and a long needle on a pivot. The needle turns to face
 * the pointer and the read-out gives its bearing. At rest the needle points
 * a little off north and the case is bright.
 *
 * The pattern: one part turning to face the pointer (spring).
 */
const {
  Cam, fit, facing, prism, proj, rings, circ, unproj, spring, stepS, poly, rad,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const R = 40, Z = 9, NL = 33, NW = 7, REST = -30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let snap = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-R - 10, -R - 10, 0], [R + 10, R + 10, 0], [R + 10, -R - 10, 0], [-R - 10, R + 10, 0], [0, 0, Z + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-R - 10, -R - 10, R + 10, R + 10, 10, 2);
  put(solid(g), prism(P, front, pr, pi, -3, 0));
  const cs = solid(g);
  put(cs, prism(P, front, circ(R, 48), circ(R - 4, 48), 0, Z - 1));
  mk("path", { d: poly(circ(R - 9, 48).map((q) => P(q.u, q.v, Z - 1))), class: "nf lo" }, g);
  for (let k = 0; k < 4; k++) { const t = rad(k * 90); place(flatDot(g, C, k === 2 ? 1.8 : 1.3, k === 2 ? "dot m" : "dot off"), P((R - 6) * Math.cos(t), (R - 6) * Math.sin(t), Z - 1)); }
  const south = mk("path", { class: "lo" }, g), north = mk("path", { class: "sil" }, g);
  const pivot = mk("path", { d: poly(circ(2.6, 16).map((q) => P(q.u, q.v, Z + 1.5))) }, g);

  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.05) return;
    last = a;
    const t = rad(a), dx = Math.cos(t), dy = Math.sin(t), nx = -dy, ny = dx;
    const at = (l, w) => P(l * dx + w * nx, l * dy + w * ny, Z);
    north.setAttribute("d", poly([at(0, -NW), at(NL, 0), at(0, NW)]));
    south.setAttribute("d", poly([at(0, -NW), at(-NL * 0.8, 0), at(0, NW)]));
  }
  // north on the dial is -x (the far left corner); angles are measured in the ground plane
  const ang = spring(REST - 180);
  draw(ang.x);
  let on = false;
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); show(); return m; });
  bag.add(B.unregister);
  function show() {
    const b = (((ang.x + 180) % 360) + 360) % 360;
    read.textContent = on ? String(Math.round(b)).padStart(3, "0") + "°" : "rest";
  }
  function mark(a) { cs.sil.classList.toggle("hi", !a); north.classList.toggle("hi", a); }
  function aim(target) {
    let d = ((target - ang.t) % 360 + 540) % 360 - 180;
    ang.t += d; B.wake();
  }
  mark(false); show();
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      on = true; mark(true);
      const [x, y] = unproj(C, sx, sy, Z);
      let a = Math.atan2(y, x) * 180 / Math.PI;
      if (snap > 0) a = Math.round(a / snap) * snap;
      aim(a);
    },
    leave: () => { on = false; mark(false); aim(REST - 180); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { snap = v; }, destroy: bag.dispose };
}

hairline({
  name: "compass",
  means: "A hiking compass on a plate: its needle turns on the pivot to face the pointer, and the read-out gives the bearing.",
  rules: [1, 4, 5, 8],
  range: [0, 0, 45],
  tour: [[249, 172], [200, 247], [200, 85], null],
  mount,
});
