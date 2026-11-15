/**
 * Hammock stand: a steel stand of a long base and two raked posts with a
 * hammock slung between them. The pointer's place along the stand sets the
 * hammock's sway about the line through the post tops. At rest it hangs
 * swung a little to one side, bright. The slider is how far it can sway.
 *
 * The pattern: one hanging part swinging to follow the pointer.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const L = 160, Y = 20, TOP = 66, X0 = 30, X1 = 130, SAG = 36, WD = 15, REST = -16;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [L, 2 * Y, 0], [L, 0, 0], [0, 2 * Y, 0], [X0, Y, TOP + 6], [X1, Y, TOP + 6], [80, Y - 45, TOP - 10], [80, Y + 45, TOP - 10]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const rod = (a, b, r) => { const pts = []; for (const p of [a, b]) for (const dx of [-r, r]) for (const dy of [-r, r]) for (const dz of [-r, r]) pts.push(P(p[0] + dx, p[1] + dy, p[2] + dz)); return mk("path", { d: poly(hull(pts)) }, g); };
  rod([4, 2, 2], [4, 2 * Y - 2, 2], 2.5);
  rod([L - 4, 2, 2], [L - 4, 2 * Y - 2, 2], 2.5);
  rod([4, Y, 3], [L - 4, Y, 3], 3);
  rod([10, Y, 4], [X0 - 4, Y, TOP], 2.5);
  rod([L - 10, Y, 4], [X1 + 4, Y, TOP], 2.5);
  const ham = mk("path", { class: "sil" }, g), seam = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  const at = (a, x, dy, dz) => { const r = (a * Math.PI) / 180; return P(x, Y + dy * Math.cos(r) - dz * Math.sin(r), TOP + dy * Math.sin(r) + dz * Math.cos(r)); };
  function draw(a) {
    if (a === last) return; last = a;
    const A = [], Bk = [], M = [];
    for (let i = 0; i <= 20; i++) {
      const s = i / 20, x = X0 + (X1 - X0) * s, dz = -SAG * Math.sin(Math.PI * s) - 2, w = WD * Math.pow(Math.sin(Math.PI * s), 0.6);
      A.push(at(a, x, w, dz + w * 0.25)); Bk.push(at(a, x, -w, dz + w * 0.25)); M.push(at(a, x, 0, dz));
    }
    ham.setAttribute("d", poly(A.concat(Bk.reverse())));
    seam.setAttribute("d", "M" + M.map((p) => p.join(",")).join("L"));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const xa = P(0, Y, 0)[0], xb = P(L, Y, 0)[0];
  let act = null;
  function set(t) {
    if (t === act) return; act = t;
    const v = t === null ? REST : (t * 2 - 1) * max;
    tset(ang, v, performance.now(), 0);
    ham.classList.add("hi");
    read.textContent = t === null ? "rest" : Math.round(v) + "°";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: ([sx]) => set(Math.round(clamp((sx - xa) / (xb - xa), 0, 1) * 20) / 20), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "hammockstand",
  means: "A hammock on a steel stand: the pointer's place along the stand sways the hammock about the line through the post tops.",
  rules: [1, 3, 5, 6],
  range: [20, 45, 60],
  tour: [[93, 142], [200, 196], [307, 250], null],
  mount,
});
