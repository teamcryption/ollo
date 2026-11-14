/**
 * USB sticks: a hub with a row of flash drives standing in its ports. The
 * pointer picks a stick by where it is along the hub: that stick slides out
 * of its port high enough to show its plug, the others ease up a little after
 * it, staggered from it. At rest they stand at uneven depths, one bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is a fixed plane through
 * the sticks' resting middles, nearest port along x.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, STEP = 10, XS0 = 8, TOP = 8, H = 20, PLUG = 7, LIFT = 12, BUMP = 3;
const X1 = XS0 + (N - 1) * STEP + 8;
const REST = [1.5, 0, 4, 0.5, 2.5], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 4.0);
  fit(C, [[-2, 0, 0], [X1, 22, 0], [X1, 0, 0], [-2, 22, 0], [XS0, 4, TOP + H + LIFT], [X1 - 8, 16, TOP + H + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the hub: a low rounded block, a cable leaving its far end
  mk("path", { class: "nf lo", d: "M" + P(-2, 11, 3).join(",") + "L" + P(-14, 11, 3).join(",") + "L" + P(-20, 4, 0).join(",") }, g);
  const [hr, hi] = rings(-2, 0, X1, 22, 6, 1.6);
  const hub = solid(g);
  put(hub, prism(P, front, hr, hi, 0, TOP));
  const ports = [];
  for (let k = 0; k < N; k++) {
    const x = XS0 + k * STEP, [pr] = rings(x - 2.2, 5, x + 2.2, 17, 0.8, 0.3);
    ports.push("M" + pr.map((q) => P(q.u, q.v, TOP).join(",")).join("L") + "Z");
  }
  mk("path", { class: "nf lo", d: ports.join("") }, hub.g);

  const sticks = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), x = XS0 + k * STEP;
    sticks.push({ x, plug: solid(grp), body: solid(grp), hole: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }
  function draw(s, lift) {
    if (lift === s.last) return;
    s.last = lift;
    const zb = TOP - PLUG + lift;
    const [pr, pi] = rings(s.x - 1.4, 7, s.x + 1.4, 15, 0.5, 0.3);
    if (zb + PLUG > TOP + 0.3) put(s.plug, prism(P, front, pr, pi, Math.max(TOP, zb), zb + PLUG));
    else put(s.plug, { sil: "", crease: "" });
    const [br, bi] = rings(s.x - 3, 4, s.x + 3, 18, 2.4, 0.9);
    put(s.body, prism(P, front, br, bi, zb + PLUG, zb + PLUG + H));
    // the lanyard hole near the top, on the face toward us
    const zt = zb + PLUG + H - 3.5, pts = [];
    for (let i = 0; i < 14; i++) { const t = (i / 14) * Math.PI * 2; pts.push(P(s.x + 3, 11 + 1.6 * Math.cos(t), zt + 1.6 * Math.sin(t))); }
    s.hole.setAttribute("d", "M" + pts.map((p) => p.join(",")).join("L") + "Z");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    sticks.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP + H * 0.5);
    if (x < -6 || x > X1 + 4 || y < -6 || y > 28) return -1;
    return clamp(Math.round((x - XS0) / STEP), 0, N - 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sticks.forEach((s, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, BUMP - Math.abs(k - a));
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "port " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "usbsticks",
  means: "A hub of flash drives: the stick under the pointer slides out of its port, the others ease up after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[146, 138], [203, 166], [259, 195], null],
  mount,
});
