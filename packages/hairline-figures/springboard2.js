/**
 * Mini trampoline: a round frame on short legs, a mat slung inside it on a
 * ring of springs. The mat sinks under the pointer and tips toward where it
 * stands, the springs stretching with it. At rest the mat sags a little,
 * bright. The slider is how deep it sinks.
 */
const { Cam, fit, facing, circ, poly, prism, proj, ringAt, clamp, spring, stepS, unproj, disposer, mk, pointer, put, register, solid, seg } = HL;

const R = 52, RI = 47, RM = 35, Z = 30, NS = 20;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let deep = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, 0], [R, -R, 0], [0, 0, Z + 3]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const legs = [0, 1, 2, 3, 4, 5].map((i) => [Math.cos((i + 0.5) * Math.PI / 3) * (R - 5), Math.sin((i + 0.5) * Math.PI / 3) * (R - 5)]).sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  for (const [x, y] of legs) put(solid(g), prism(P, front, disc(x, y, 2.6, 12), disc(x, y, 1.6, 12), 0, Z));
  put(solid(g), prism(P, front, circ(R, 48), circ(RI, 48), Z, Z + 3));
  const springs = mk("path", { class: "nf lo" }, g), mat = solid(g);
  mat.sil.classList.add("hi");
  const D = spring(1.5), px = spring(8), py = spring(-6);
  let last = "";
  const zAt = (u, v) => Z + 3 - D.x - ((u * px.x + v * py.x) / (RM * RM)) * 1.6;
  function draw() {
    const key = [D.x, px.x, py.x].map((n) => n.toFixed(3)).join();
    if (key === last) return;
    last = key;
    const m = circ(RM, 48).map((q) => P(q.u, q.v, zAt(q.u, q.v)));
    const mi = circ(RM - 3, 48).map((q) => P(q.u, q.v, zAt(q.u, q.v)));
    mat.sil.setAttribute("d", poly(m));
    mat.cr.setAttribute("d", poly(mi));
    let d = "";
    for (let i = 0; i < NS; i++) {
      const a = (i / NS) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      d += seg(P(c * RI, s * RI, Z + 3), P(c * RM, s * RM, zAt(c * RM, s * RM)));
    }
    springs.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const mv = stepS(D, dt) | stepS(px, dt) | stepS(py, dt); draw(); return !!mv; });
  bag.add(B.unregister);
  function aim(p) {
    let on = false, x = 0, y = 0;
    if (p) { [x, y] = unproj(C, p[0], p[1], Z); on = Math.hypot(x, y) < R + 6; }
    if (!on) { D.t = 1.5; px.t = 8; py.t = -6; read.textContent = "rest"; B.wake(); return; }
    const r = Math.hypot(x, y), k = r > RM ? RM / r : 1;
    D.t = deep; px.t = x * k; py.t = y * k;
    read.textContent = "dip " + Math.round(deep + 1.6 * Math.min(1, r / RM));
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { deep = clamp(v, 0, 4.4); }, destroy: bag.dispose };
}

hairline({
  name: "springboard2",
  means: "A mini trampoline on short legs: the mat sinks under the pointer and tips toward it, its ring of springs stretching.",
  rules: [1, 3, 5, 8],
  range: [1.5, 3.4, 4.4],
  tour: [[200, 138], [125, 130], [200, 243], null],
  mount,
});
