/**
 * Power bank: a flat battery brick with a row of four level lights on its top
 * and a cable plug off its end. Pointing at the brick slides the plug home
 * into the port and the level lights come on. At rest the plug stands off the
 * port, bright, and one light glows. The slider is how full the bank is.
 */
const {
  Cam, fit, facing, flatDot, place, prism, proj, put, rings, solid, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const L = 120, W = 66, H = 16, GAP = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lvl = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [L + GAP + 40, W / 2, H], [0, 0, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, W, 12, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [pr, pi] = rings(L - 1, W / 2 - 8, L + 1.5, W / 2 + 8, 1, 0.5);
  put(solid(g), prism(P, front, pr, pi, H / 2 - 3, H / 2 + 3));
  const dots = [0, 1, 2, 3].map((k) => { const d = flatDot(g, C, 2.6, "dot off"); place(d, P(20 + k * 12, W - 14, H)); return d; });
  const cable = solid(g), plug = solid(g);
  const off = tween(GAP);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    const x = L + 1 + o;
    const [a, b] = rings(x, W / 2 - 9, x + 22, W / 2 + 9, 3, 1.2);
    put(plug, prism(P, front, a, b, H / 2 - 5, H / 2 + 5));
    const [c, d] = rings(x + 20, W / 2 - 3, L + GAP + 40, W / 2 + 3, 3, 1);
    put(cable, prism(P, front, c, d, H / 2 - 3, H / 2 + 3));
  }

  const B = register(stage, (_dt, now) => { draw(tval(off, now)); return !tdone(off, now); });
  bag.add(B.unregister);

  const mid = P(L / 2, W / 2, H / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(off, a ? 0 : GAP, performance.now(), 0);
    plug.sil.classList.toggle("hi", !a);
    const n = a ? Math.max(1, Math.round(lvl / 25)) : 1;
    dots.forEach((d, k) => d.setAttribute("class", k < n ? (a ? "dot" : "dot m") : "dot off"));
    read.textContent = a ? Math.round(lvl) + "%" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 60;
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lvl = v; if (act) { act = -2; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "solarcharger",
  means: "A power bank: pointing at it slides the cable plug home into its port and the level lights on top come on.",
  rules: [1, 4, 5, 6],
  range: [25, 75, 100],
  tour: [[108, 132], [175, 166], [242, 200], null],
  mount,
});
