/**
 * Bike basket: a wire basket on a mounting bracket, its slatted lid hinged at the back.
 * The pointer over the figure swings the lid up on its back hinge; leaving lets it settle back to its
 * rest pose. The slider is how far it goes.
 */
const FIX = [{"b":[-8,18,20,0,32,36]},{"b":[0,0,0,70,50,40]},{"l":[[14,50,0],[14,50,40]]},{"l":[[28,50,0],[28,50,40]]},{"l":[[42,50,0],[42,50,40]]},{"l":[[56,50,0],[56,50,40]]},{"l":[[70,12.5,0],[70,12.5,40]]},{"l":[[70,25,0],[70,25,40]]},{"l":[[70,37.5,0],[70,37.5,40]]},{"l":[[0,50,20],[70,50,20],[70,0,20]]}];
const MOV = [{"b":[0,0,40,70,50,44]},{"l":[[14,0,44],[14,50,44]]},{"l":[[28,0,44],[28,50,44]]},{"l":[[42,0,44],[42,50,44]]},{"l":[[56,0,44],[56,50,44]]},{"l":[[0,17,44],[70,17,44]]},{"l":[[0,33,44],[70,33,44]]}];
const PIV = [0,25,40], AX = 1, A0 = -12, A1 = -60;
const { Cam, fit, proj, poly, hull, open, mk, register, pointer, disposer, tween, tset, tval, tdone } = HL;
const V = [0.612, 0.612, 0.5];
const FACES = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 4, 6, 2], [1, 3, 7, 5], [0, 1, 5, 4], [2, 6, 7, 3]];
const corners = ([a, b, c, d, e, f]) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i & 1 ? d : a, i & 2 ? e : b, i & 4 ? f : c]);
function cyl([cx, cy, cz], ax, r, len, n = 22) {
  const out = [];
  for (const s of [-len / 2, len / 2]) for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, a = r * Math.cos(t), b = r * Math.sin(t);
    out.push(ax === 0 ? [cx + s, cy + a, cz + b] : ax === 1 ? [cx + a, cy + s, cz + b] : [cx + a, cy + b, cz + s]);
  }
  return out;
}
function rot(p, piv, ax, deg) {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  const x = p[0] - piv[0], y = p[1] - piv[1], z = p[2] - piv[2];
  const q = ax === 0 ? [x, y * c - z * s, y * s + z * c] : ax === 1 ? [x * c + z * s, y, -x * s + z * c] : [x * c - y * s, x * s + y * c, z];
  return [q[0] + piv[0], q[1] + piv[1], q[2] + piv[2]];
}
const depth = (pts) => pts.reduce((a, p) => a + p[0] * V[0] + p[1] * V[1] + p[2] * V[2], 0) / pts.length;
function shape(spec) { return spec.c ? { kind: "c", pts: cyl(spec.c, spec.ax, spec.r, spec.len) } : spec.l ? { kind: "l", pts: spec.l } : { kind: "b", pts: corners(spec.b) }; }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const parts = [...FIX.map((s) => ({ ...shape(s), mov: false })), ...MOV.map((s) => ({ ...shape(s), mov: true }))];
  const pose = (pt, a) => (pt.mov ? pt.pts.map((p) => rot(p, PIV, AX, a)) : pt.pts);
  const all = [];
  for (const a of [A0, (A0 + A1) / 2, A1]) parts.forEach((pt) => all.push(...pose(pt, a)));
  let C = Cam(45, 0.5, 1); fit(C, all, 200, 160);
  let P = proj(C), sp = all.map((p) => P(...p));
  const w = Math.max(...sp.map((q) => q[0])) - Math.min(...sp.map((q) => q[0])), h = Math.max(...sp.map((q) => q[1])) - Math.min(...sp.map((q) => q[1]));
  C = Cam(45, 0.5, Math.min(330 / w, 262 / h)); fit(C, all, 200, 160); P = proj(C);
  const g = mk("g", {}, svg);
  parts.forEach((pt) => { pt.g = mk("g", {}, g); pt.els = []; });
  function drawPart(pt, a) {
    const W = pose(pt, a), S = W.map((p) => P(...p));
    pt.g.replaceChildren(); pt.d = depth(W) + (pt.kind === "l" ? 0.5 : 0) + (pt.mov ? (pt.kind === "l" ? 0.05 : 0) : 0);
    if (pt.kind === "l") { mk("path", { d: open(S), class: pt.mov ? "nf" : "nf lo" }, pt.g); return; }
    if (pt.kind === "b") {
      for (const f of FACES) { const q = f.map((i) => S[i]); let ar = 0; for (let i = 0; i < 4; i++) { const u = q[i], v = q[(i + 1) % 4]; ar += u[0] * v[1] - v[0] * u[1]; } if (ar > 0.01) mk("path", { d: poly(q) }, pt.g); }
      pt.sil = mk("path", { d: poly(hull(S)), class: "sil nf" + (pt.mov ? " hi" : "") }, pt.g);
    } else {
      const n = S.length / 2;
      pt.sil = mk("path", { d: poly(hull(S)), class: "sil" + (pt.mov ? " hi" : "") }, pt.g);
      const end = depth(W.slice(n)) > depth(W.slice(0, n)) ? S.slice(n) : S.slice(0, n);
      mk("path", { d: poly(end), class: "nf" }, pt.g);
    }
  }
  const tw = tween(A0);
  let last = NaN, on = false;
  function draw(a) {
    if (a === last) return; last = a;
    parts.forEach((pt) => drawPart(pt, a));
    [...parts].sort((p, q) => p.d - q.d).forEach((pt) => g.appendChild(pt.g));
    read.textContent = Math.abs(a - A0) < 0.5 ? "rest" : Math.round(Math.abs(a - A0)) + "°";
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = all.slice(0, all.length / 3).map((p) => P(...p));
  const bx = [Math.min(...rest.map((q) => q[0])) - 16, Math.max(...rest.map((q) => q[0])) + 16, Math.min(...rest.map((q) => q[1])) - 16, Math.max(...rest.map((q) => q[1])) + 16];
  const go = () => { tset(tw, on ? A0 + (A1 - A0) * reach : A0, performance.now(), 0); B.wake(); };
  draw(A0);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const o = x > bx[0] && x < bx[1] && y > bx[2] && y < bx[3]; if (o !== on) { on = o; go(); } },
    leave: () => { on = false; go(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; go(); }, destroy: bag.dispose };
}

hairline({
  name: "bikebasket",
  means: "A wire bike basket on its bracket: the pointer swings the slatted lid up on its back hinge to open it.",
  rules: [1, 3, 4, 5, 6],
  range: [30, 85, 100],
  tour: [[201,151], [200, 160], [150,190], null],
  mount,
});
