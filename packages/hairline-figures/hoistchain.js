/**
 * Chain hoist: a hoist body hangs by its top hook from a beam stub, a hand
 * wheel on its face with the hand chain looping down, and a load block on
 * the lifting chain below. The pointer's height is the pull: the hand chain
 * runs, the wheel turns and the block climbs. At rest the block hangs low,
 * its hook bright. The slider is the rest height.
 *
 * The pattern: one part lifting by the pointer's height (lift).
 */
const {
  Cam, fit, open, poly, prism, proj, rings, ringAt, seg, clamp, rad,
  disposer, mk, pointer, put, register, solid, spring, stepS, facing, flatDot, place,
} = HL;

const WY = 14, WZ = 76, WR = 12, HMAX = 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restH = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-4, -46, 104], [4, 46, 104], [-11, -11, 0], [11, 11, 0], [-WR, WY, 28], [WR, WY, 28]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -46, 4, 46, 2, 1);
  put(solid(g), prism(P, front, br, bi, 98, 104));
  mk("path", { class: "nf", d: open([P(0, 0, 98), P(0, 0, 92), P(3, 0, 90), P(0, 0, 87)]) }, g);
  const [hr, hi] = rings(-10, -8, 10, 8, 4, 1.4);
  put(solid(g), prism(P, front, hr, hi, 64, 86));
  const lchain = mk("path", { class: "nf lo" }, g);
  const load = solid(g), lid = mk("path", { class: "nf lo" }, g);
  const hook = flatDot(g, C, 2.6, "dot");
  const circle = (r, a0) => Array.from({ length: 32 }, (_, i) => { const t = a0 + (i / 32) * Math.PI * 2; return P(r * Math.cos(t), WY, WZ + r * Math.sin(t)); });
  mk("path", { d: poly(circle(WR, 0)) }, g);
  mk("path", { class: "sil nf", d: poly(circle(WR, 0)) }, g);
  mk("path", { class: "nf lo", d: poly(circle(WR - 2.2, 0)) }, g);
  const spokes = mk("path", { class: "nf lo" }, g);
  const hchain = mk("path", { class: "nf" }, g);
  const H = spring(restH);
  let last = NaN, act = false;

  function draw() {
    const h = H.x;
    if (h === last) return;
    last = h;
    const top = h + 16, hz = top + 6;
    lchain.setAttribute("d", open([P(0, 0, 64), P(0, 0, hz)]) + " " + seg(P(0, 0, hz), P(-7, -7, top)) + seg(P(0, 0, hz), P(7, 7, top)) + seg(P(0, 0, hz), P(-7, 7, top)) + seg(P(0, 0, hz), P(7, -7, top)));
    const [lr, li] = rings(-10, -10, 10, 10, 2.5, 1.2);
    put(load, prism(P, front, lr, li, h, top));
    lid.setAttribute("d", seg(P(-10, 0, top), P(10, 0, top)));
    place(hook, P(0, 0, hz));
    const turn = h / WR;
    let sp = "";
    for (let k = 0; k < 3; k++) { const t = turn + (k * Math.PI * 2) / 3; sp += seg(P(0, WY, WZ), P((WR - 2.2) * Math.cos(t), WY, WZ + (WR - 2.2) * Math.sin(t))); }
    spokes.setAttribute("d", sp);
    let ch = open([P(-WR, WY, WZ), P(-WR, WY, 34), P(-WR + 4, WY, 29), P(WR - 4, WY, 29), P(WR, WY, 34), P(WR, WY, WZ)]);
    const ph = ((h * 1.5) % 6 + 6) % 6;
    for (let z = 36 + ph; z < WZ - 2; z += 6) ch += seg(P(-WR - 1.6, WY, z), P(-WR + 1.6, WY, z));
    for (let z = WZ - 2 - ph; z > 36; z -= 6) ch += seg(P(WR - 1.6, WY, z), P(WR + 1.6, WY, z));
    hchain.setAttribute("d", ch);
    read.textContent = act ? Math.round(h) + " up" : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(H, dt); draw(); return m; });
  bag.add(B.unregister);
  function setActive(on, h) {
    act = on; H.t = h;
    load.sil.classList.toggle("hi", on);
    hook.setAttribute("class", on ? "dot off" : "dot");
    last = NaN; B.wake();
  }
  setActive(false, restH);
  draw();
  bag.add(pointer(stage, {
    move: ([, sy]) => setActive(true, clamp(((sy - 70) / 190) * HMAX, 2, HMAX)),
    leave: () => setActive(false, restH),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restH = v; if (!act) setActive(false, v); }, destroy: bag.dispose };
}

hairline({
  name: "hoistchain",
  means: "A chain hoist: pull down with the pointer and the hand chain runs, the wheel turns and the load block climbs.",
  rules: [1, 3, 4, 5],
  range: [2, 8, 14],
  tour: [[200, 238], [200, 269], [120, 108], null],
  mount,
});
