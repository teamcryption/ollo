/**
 * Paramotor: a pilot in a harness with the motor's round prop cage on the
 * back, hanging under a long arched wing on its lines. The pointer's x swings
 * the wing over the pilot like a pendulum, and the prop turns with it. The
 * wing is the bright mark.
 */
const { Cam, fit, proj, hull, poly, open, clamp, spring, stepS, disposer, mk, pointer, register } = HL;
const S = 1.9, Z0 = 0, ZP = 34, RW = 78, TW = 0.78;
const box = (x0, x1, y0, y1, z0, z1) => { const o = []; [x0, x1].forEach((x) => [y0, y1].forEach((y) => [z0, z1].forEach((z) => o.push([x, y, z])))); return o; };
const hoop = (x, r, zc, n = 24) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([x, r * Math.cos(t), zc + r * Math.sin(t)]); } return o; };
const rot = (b) => (p) => { const y = p[1], z = p[2] - ZP; return [p[0], y * Math.cos(b) - z * Math.sin(b), ZP + y * Math.sin(b) + z * Math.cos(b)]; };
const arc = (x, b, dz = 0) => { const o = []; for (let k = 0; k <= 16; k++) { const t = -TW + (2 * TW * k) / 16; o.push(rot(b)([x, RW * Math.sin(t), ZP + RW * Math.cos(t) + dz])); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, S);
  const ext = [];
  [-0.75, 0.75].forEach((b) => ext.push(...arc(14, b), ...arc(-14, b)));
  fit(C, ext.concat([[-14, 22, Z0], [-14, -22, Z0], [10, 0, Z0]]), 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const n = ["lines", "wing", "ribs", "cage", "cageIn", "prop", "motor", "pilot", "head"];
  const el = {};
  n.forEach((k) => (el[k] = mk("path", { class: k === "lines" || k === "ribs" || k === "cageIn" ? "nf lo" : k === "cage" ? "nf sil" : "sil" }, g)));
  el.wing.classList.add("hi");
  const sh = (pts) => poly(hull(pts.map((p) => P(...p))));
  const zc = Z0 + 22;
  el.cage.setAttribute("d", poly(hoop(-16, 22, zc).map((p) => P(...p))));
  el.cageIn.setAttribute("d", poly(hoop(-16, 20, zc).map((p) => P(...p))));
  el.motor.setAttribute("d", sh(box(-15, -6, -7, 7, zc - 8, zc + 8)));
  el.pilot.setAttribute("d", sh(box(-6, 8, -6, 6, Z0 + 10, Z0 + 34).concat(box(4, 18, -5, 5, Z0 + 8, Z0 + 14))));
  el.head.setAttribute("d", sh(hoop(1, 5, Z0 + 40, 12).concat(hoop(-3, 5, Z0 + 40, 12))));
  const b = spring(0.14);
  let last = NaN;
  function draw() {
    if (b.x === last) return; last = b.x;
    const v = b.x, R = rot(v);
    const le = arc(14, v), te = arc(-14, v), le2 = arc(14, v, -4), te2 = arc(-14, v, -3);
    el.wing.setAttribute("d", poly(le.concat(le2.slice().reverse()).map((p) => P(...p))) + poly(le.concat(te.slice().reverse()).map((p) => P(...p))) );
    let ribs = "", lines = "";
    for (let k = 2; k <= 14; k += 2) ribs += open([P(...le[k]), P(...te[k])]);
    [1, 4, 7, 9, 12, 15].forEach((k) => { const s = k < 8 ? -1 : 1; lines += open([P(...le2[k]), P(...R([2, s * 6, ZP]))]) + open([P(...te2[k]), P(...R([-2, s * 6, ZP]))]); });
    el.ribs.setAttribute("d", ribs);
    el.lines.setAttribute("d", lines);
    const a = 0.5 + v * 4, pts = [];
    [0, Math.PI].forEach((o) => { const c = Math.cos(a + o), s = Math.sin(a + o); [[3, 3], [10, 3.5], [18, 2]].forEach(([u, w]) => [-1, 1].forEach((q) => pts.push([-19, u * c - q * w * s, zc + u * s + q * w * c]))); });
    el.prop.setAttribute("d", sh(pts.slice(0, 6)) + sh(pts.slice(6)));
  }
  const B = register(stage, (dt) => { const m = stepS(b, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx]) {
    b.t = clamp((sx - 200) / 90, -1, 1) * gain * 0.6;
    read.textContent = Math.round((b.t * 180) / Math.PI) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { b.t = 0.14; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = clamp(v, 0.3, 1.25); }, destroy: bag.dispose };
}

hairline({
  name: "paramotor",
  means: "A paramotor pilot with a caged prop on the back: the pointer's x swings the arched wing over them on its lines, and the prop turns.",
  rules: [3, 4, 5, 8],
  range: [0.3, 0.9, 1.25],
  tour: [[286, 86], [152, 153], [299, 102], null],
  mount,
});
