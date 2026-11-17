/**
 * Spring balance: a hanging spring scale under the arm of a stand, a weight
 * on its hook. The pointer swings the balance toward it, and the further it
 * swings the more the spring stretches out of the barrel. At rest it hangs
 * a little off true, the barrel bright. The slider is the widest swing.
 */
const {
  Cam, circ, fit, facing, open, poly, prism, proj, rings, unproj, clamp, rad, hull, seg,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const TOP = 112, BL = 40, BR = 6.5;
const add = (c, a, k) => [c[0] + a[0] * k, c[1] + a[1] * k, c[2] + a[2] * k];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-40, -40, 0], [34, 34, 0], [0, -40, TOP + 6], [-50, 50, 30], [50, -50, 30]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [b0, b1] = rings(-40, -40, 30, 30, 8, 2);
  put(solid(g), prism(P, front, b0, b1, 0, 5));
  const post = circ(3.5, 20).map((q) => ({ ...q, u: q.u, v: q.v - 40 }));
  put(solid(g), prism(P, front, post, circ(2, 20).map((q) => ({ ...q, u: q.u, v: q.v - 40 })), 5, TOP + 6));
  const arm = [[0, -40, TOP + 6], [0, 0, TOP + 6]];
  mk("path", { d: poly([P(...arm[0]), P(...arm[1]), P(0, 0, TOP + 2), P(0, -40, TOP + 2)]) }, g);
  const loop = mk("path", { class: "nf" }, g), barrel = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf lo" }, g);
  const mark = mk("path", { class: "nf lo" }, g), rod = mk("path", { class: "nf" }, g), hook = mk("path", { class: "nf" }, g);
  const wt = mk("path", { class: "" }, g), wtop = mk("path", { class: "nf lo" }, g);
  const ang = spring(rad(10)), dir = spring(rad(-60)), ext = spring(8);
  const w = norm([1, -1, 0]);

  function ring3(c, a, b, r, n = 32) { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push(P(...add(add(c, a, r * Math.cos(t)), b, r * Math.sin(t)))); } return o; }
  function draw() {
    const a = ang.x, b = dir.x;
    const d = [Math.sin(a) * Math.cos(b), Math.sin(a) * Math.sin(b), -Math.cos(a)];
    const p1 = norm(cross(d, w)), p2 = cross(d, p1);
    const h = [0, 0, TOP + 3];
    loop.setAttribute("d", poly(ring3(add(h, d, 3), d, w, 3, 20)));
    const t0 = add(h, d, 6), t1 = add(h, d, 6 + BL);
    barrel.setAttribute("d", poly(hull(ring3(t0, p1, p2, BR).concat(ring3(t1, p1, p2, BR)))));
    cap.setAttribute("d", poly(ring3(t0, p1, p2, BR)));
    const e = ext.x, m = add(h, d, 12 + e);
    mark.setAttribute("d", seg(P(...add(m, w, -BR)), P(...add(m, w, BR))) + seg(P(...add(add(h, d, 14), w, -2)), P(...add(add(h, d, 4 + BL), w, -2))));
    const r1 = add(t1, d, 6 + e);
    rod.setAttribute("d", open([P(...t1), P(...r1)]));
    const hk = []; for (let i = 0; i <= 10; i++) { const t = Math.PI * (i / 10) * 1.3; hk.push(P(...add(add(r1, d, 4 - 4 * Math.cos(t)), w, 4 * Math.sin(t)))); }
    hook.setAttribute("d", open(hk));
    const wc = add(r1, d, 8), wb = add(wc, d, 18);
    wt.setAttribute("d", poly(hull(ring3(wc, p1, p2, 11).concat(ring3(wb, p1, p2, 11)))));
    wtop.setAttribute("d", poly(ring3(wc, p1, p2, 11)));
  }
  draw();
  barrel.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(ang, dt) | stepS(dir, dt) | stepS(ext, dt); draw(); return !!m; });
  bag.add(B.unregister);
  function aim(wx, wy) {
    const a = Math.atan2(wy, wx);
    let dd = a - dir.t; dd = Math.atan2(Math.sin(dd), Math.cos(dd));
    dir.t += dd;
    const k = clamp(Math.hypot(wx, wy) / 70, 0, 1);
    ang.t = rad(reach) * k; ext.t = 4 + 18 * k;
    read.textContent = Math.round(10 + 40 * k) + " g";
    B.wake();
  }
  function rest() { ang.t = rad(10); ext.t = 8; read.textContent = "rest"; B.wake(); }
  rest();
  bag.add(pointer(stage, { move: ([sx, sy]) => { const [wx, wy] = unproj(C, sx, sy, 0); aim(wx, wy); }, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "springscale",
  means: "A spring balance on a stand: it swings toward the pointer, and the further it swings the more the spring stretches.",
  rules: [1, 3, 5, 6],
  range: [10, 25, 40],
  tour: [[365, 259], [60, 250], [200, 300], null],
  mount,
});
