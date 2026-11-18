/**
 * Irrigation pivot: a centre-pivot rig on its crop circle, a steel tower at
 * the hub and a long pipe span carried by three wheeled A-frame towers, with
 * a truss under it and sprinkler drops hanging from it. The pointer is where
 * the water should go: the whole span sweeps round the hub on a spring to
 * point at it. At rest the span lies toward the reader, bright. The slider is
 * how far round the span will sweep.
 *
 * The pattern: a continuous aim (officechairs' spring on an angle); the hit
 * is on the field's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 84, TW = [30, 57, 84], PZ = 22, REST = rad(28);
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.62);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([(L + 8) * Math.cos(a), (L + 8) * Math.sin(a), 0], [(L + 6) * Math.cos(a), (L + 6) * Math.sin(a), PZ + 3]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the crop circle, a dashed guide on the ground, and the wheel track of each tower
  const ringPath = (r) => { const pts = circ(r, 72).map((q) => P(q.u, q.v, 0)); return "M" + pts.map((p) => p.join(",")).join("L") + "Z"; };
  mk("path", { class: "nf dash", d: ringPath(L + 6) }, g);
  mk("path", { class: "nf lo", d: TW.map(ringPath).join("") }, g);

  const hub = mk("g", {}, g);
  { const [r, i] = rings(-9, -9, 9, 9, 2.5, 1.2); put(solid(hub), prism(P, front, r, i, 0, 2)); }
  { const [r, i] = rings(-4, -4, 4, 4, 1.2, 0.8); put(solid(hub), prism(P, front, r, i, 2, PZ + 6)); }
  { const [r, i] = rings(-6, -6, 6, 6, 2, 1); put(solid(hub), prism(P, front, r, i, PZ + 6, PZ + 9)); }

  const span = mk("g", {}, g);
  const legs = mk("path", { class: "nf sil" }, span);
  const truss = mk("path", { class: "nf lo" }, span);
  const wheels = TW.map(() => [0, 1].map(() => mk("ellipse", { class: "", rx: 3.2, ry: 1.9 }, span)));
  const pipe = solid(span);
  const [PR, PI] = rings(3, -1.6, L + 9, 1.6, 1.2, 0.5);
  pipe.sil.classList.add("hi");

  const sp = spring(REST);
  let drawn = NaN, spanFirst = null;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a), at = (r, w, z) => P(r * c - w * s, r * s + w * c, z);
    put(pipe, prism(P, front, turn(PR, a), turn(PI, a), PZ, PZ + 3.2));
    let L1 = "", T1 = "";
    TW.forEach((r, i) => {
      L1 += seg(at(r, -9, 2.5), at(r, 0, PZ)) + seg(at(r, 9, 2.5), at(r, 0, PZ)) + seg(at(r, -9, 2.5), at(r, 9, 2.5));
      [-9, 9].forEach((w, j) => { const p = at(r, w, 1.9); wheels[i][j].setAttribute("cx", p[0]); wheels[i][j].setAttribute("cy", p[1]); });
      const r0 = i ? TW[i - 1] : 4, m = (r0 + r) / 2;
      T1 += seg(at(r0, 0, PZ), at(m, 0, PZ - 7)) + seg(at(m, 0, PZ - 7), at(r, 0, PZ));
      for (const f of [0.3, 0.7]) { const d = r0 + (r - r0) * f; T1 += seg(at(d, 0, PZ), at(d, 0, PZ - 9)); }
    });
    T1 += seg(at(L + 7, 0, PZ), at(L + 7, 0, PZ - 6));
    legs.setAttribute("d", L1);
    truss.setAttribute("d", T1);
    // the span is painted before the hub when it points away from the reader
    const first = c + s < 0;
    if (first !== spanFirst) { spanFirst = first; if (first) hub.before(span); else hub.after(span); }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let aim = null;
  function retarget() {
    const goal = aim == null ? REST : REST + reach * wrap(aim - REST);
    sp.t = sp.t + wrap(goal - sp.t);
    read.textContent = aim == null ? "rest" : Math.round(((goal * 180) / Math.PI + 360) % 360) + "°";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      aim = r > L + 30 || r < 6 ? null : Math.atan2(y, x);
      retarget();
    },
    leave: () => { aim = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  read.textContent = "rest";
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "irrigationpivot",
  means: "A centre-pivot irrigation rig: its long sprinkler span sweeps round the hub to point at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[129, 150], [292, 137], [150, 215], null],
  mount,
});
