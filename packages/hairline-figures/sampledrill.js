/**
 * Core drill: a planetary core drill on its landing pad, the drill head riding
 * a mast with the bit beneath it. The pointer is how deep it bores: nearer the
 * mast foot, further the head slides down and the bit sinks into the ground, on
 * a spring. At rest the head is raised, the bit bright. The slider is depth.
 *
 * The pattern: a continuous value (a spring on one height); the hit is on the
 * floor's plane, which never moves.
 */
const { Cam, fit, hull, poly, proj, spring, stepS, disposer, mk, pointer, register, unproj } = HL;

const ZT = 74, DEEP = 40, REST = 4, RH = 15, HH = 16, LB = 26;
const ring = (P, c, r, z, n = 40) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(P(c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z)); } return o; };
const cyl = (P, c, r0, z0, r1, z1) => poly(hull(ring(P, c, r0, z0).concat(ring(P, c, r1, z1))));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let deep = DEEP * value;
  const C = Cam(45, 0.5, 2.6);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([36 * Math.cos(a), 36 * Math.sin(a), 0], [20 * Math.cos(a), 20 * Math.sin(a), ZT + HH + 12]); }
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const O = [0, 0], M = [-14, -14];
  mk("path", { class: "sil", d: cyl(P, O, 32, 0, 32, 5) }, g);
  mk("path", { class: "nf lo", d: poly(ring(P, O, 29, 5)) }, g);
  mk("path", { class: "sil", d: cyl(P, M, 3.5, 5, 3.5, ZT + HH + 10) }, g);
  mk("path", { class: "nf lo", d: poly(ring(P, O, 5, 5, 24)) }, g);
  const bit = mk("path", { class: "sil" }, g), flutes = mk("path", { class: "nf lo" }, g), head = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf lo" }, g), motor = mk("path", { class: "sil" }, g);
  const dz = spring(REST);
  let last = NaN;

  function draw() {
    const d = Math.min(deep, dz.x);
    if (Math.abs(d - last) < 1e-3) return;
    last = d;
    const z0 = ZT - d, zb = Math.max(5, z0 - LB);
    bit.setAttribute("d", cyl(P, O, 2.6, zb, 3.4, z0));
    let f = "";
    for (let z = z0 - 4; z > zb + 1; z -= 5) { const p0 = P(-2.4, 2.4, z), p1 = P(2.4, -2.4, z - 3); f += `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`; }
    flutes.setAttribute("d", f);
    head.setAttribute("d", cyl(P, O, RH, z0, RH, z0 + HH));
    cap.setAttribute("d", poly(ring(P, O, RH - 2.5, z0 + HH)));
    motor.setAttribute("d", cyl(P, O, 6, z0 + HH, 5, z0 + HH + 7));
  }

  const B = register(stage, (dt) => { const m = stepS(dz, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(over) {
    if (over) {
      const f = Math.max(0, Math.min(1, 1 - (Math.hypot(over[0], over[1]) - 6) / 40));
      dz.t = REST + f * (deep - REST);
      read.textContent = "d " + Math.round(dz.t);
    } else { dz.t = REST; read.textContent = "rest"; }
    head.classList.toggle("hi", !!over);
    bit.classList.toggle("hi", !over);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x, y) > 70 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { deep = DEEP * v; aim(null); }, destroy: bag.dispose };
}

hairline({
  name: "sampledrill",
  means: "A planetary core drill: the drill head slides down its mast and the bit bores in as the pointer nears.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[200, 278], [230, 250], [200, 197], null],
  mount,
});
