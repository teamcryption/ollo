/**
 * Corset: an adjustable dress form on a pole and tripod base, with a dial
 * wheel at the waist. The pointer, read on the ground plane, turns the dial:
 * the further right, the more the torso widens. At rest the dial is
 * bright, a quarter turned. The slider is how far the form may widen.
 */
const { Cam, fit, proj, poly, hull, clamp, spring, stepS, mk, pointer, register, disposer, unproj, circ, ringAt } = HL;

const PROF = [[0, 10], [6, 15], [16, 12], [26, 9.5], [36, 13], [44, 14], [50, 9], [52, 4]];
const Z0 = 34, REST = 0.25;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-22, -22, 0], [22, 22, 0], [22, -22, 0], [-22, 22, 0], [0, 0, Z0 + 60]], 200, 168);
  const P = proj(C);
  const ring = (r, z, n = 32) => ringAt(P, circ(r, n).map((q) => ({ ...q, u: q.u, v: q.v })), z);
  const g = mk("g", {}, svg);
  // tripod base and pole
  for (const t of [0.3, 2.4, 4.5]) mk("path", { d: poly(hull([P(0, 0, 4), P(0, 0, 8), P(20 * Math.cos(t), 20 * Math.sin(t), 0), P(20 * Math.cos(t), 20 * Math.sin(t), 2)])), class: "sil" }, g);
  mk("path", { d: poly(hull(ring(1.6, 0).concat(ring(1.6, Z0 + 4)))), class: "sil" }, g);
  const torso = mk("path", { class: "sil" }, g), waist = mk("path", { class: "nf lo" }, g), bust = mk("path", { class: "nf lo" }, g);
  const neck = mk("path", { class: "sil" }, g);
  const dial = mk("path", { class: "sil" }, g), spoke = mk("path", { class: "nf" }, g);
  const s = spring(REST);
  let last = NaN;
  const wid = (u) => 1 + u * 0.5;
  function draw(u) {
    if (u === last) return;
    last = u;
    const k = wid(u), pts = [];
    for (const [h, r] of PROF) pts.push(...ringAt(P, circ(r, 32).map((q) => ({ ...q, u: q.u * k, v: q.v * (0.8 + 0.2 * k) })), Z0 + h));
    torso.setAttribute("d", poly(hull(pts)));
    const half = (r, z) => ringAt(P, circ(r, 32).map((q) => ({ ...q, u: q.u * k, v: q.v * (0.8 + 0.2 * k) })), z).filter((_, i) => i < 4 || i > 20);
    waist.setAttribute("d", "M" + half(9.5, Z0 + 26).map((p) => p.join(",")).join("L"));
    bust.setAttribute("d", "M" + half(13, Z0 + 36).map((p) => p.join(",")).join("L"));
    neck.setAttribute("d", poly(hull(ring(3.5, Z0 + 52).concat(ring(3, Z0 + 58)))));
    // the dial: a wheel standing at the side of the waist, facing +x
    const cx = 11 * k + 4, cz = Z0 + 26, R = 7, w = [];
    for (let i = 0; i < 32; i++) { const t = (i / 32) * 2 * Math.PI; w.push(P(cx, R * Math.cos(t), cz + R * Math.sin(t)), P(cx + 2, R * Math.cos(t), cz + R * Math.sin(t))); }
    dial.setAttribute("d", poly(hull(w)));
    const t = u * 2 * Math.PI * 1.5;
    spoke.setAttribute("d", "M" + P(cx + 2, -R * 0.9 * Math.cos(t), cz - R * 0.9 * Math.sin(t)).join(",") + "L" + P(cx + 2, R * 0.9 * Math.cos(t), cz + R * 0.9 * Math.sin(t)).join(","));
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  dial.classList.add("hi");
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const inside = Math.hypot(x, y) < 70;
    s.t = inside ? REST + clamp((x + y + 40) / 80, 0, 1) * (reach - REST) : REST;
    read.textContent = inside ? "+" + Math.round(s.t * 50) + "%" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave: () => { s.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "corset",
  means: "An adjustable dress form with a dial at its waist: the pointer turns the dial and the torso widens.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1],
  tour: [[200, 300], [200, 264], [200, 228], null],
  mount,
});
