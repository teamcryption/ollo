/**
 * Thimble box: a small rounded box with a hinged lid along its far edge and
 * a thimble resting inside. At rest the lid sits ajar, bright. The pointer
 * over the box swings the lid back on its hinge and the thimble rises out
 * of the opening after it. The slider is the thimble's lag behind the lid.
 */
const { Cam, circ, fit, hull, poly, prism, proj, rings, facing, tdone, tset, tval, tween, unproj, disposer, mk, pointer, put, register, solid } = HL;

const W = 36, H = 14, LT = 4, OPEN = 108, AJAR = 10, RISE = 11;

function rotY(p, c, a) {
  const s = Math.sin(a), co = Math.cos(a), x = p[0] - c[0], z = p[2] - c[2];
  return [c[0] + x * co + z * s, p[1], c[2] - x * s + z * co];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lag = value;
  const C = Cam(45, 0.5, 4.3);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [-14, 0, H + W], [-14, W, H + W]], 200, 154);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ring, inner] = rings(0, 0, W, W, 6, 2.2);
  const lidBack = mk("g", {}, g);
  const box = solid(g);
  put(box, prism(P, front, ring, inner, 0, H));
  const th = solid(g), lidFront = mk("g", {}, g);
  const lid = solid(lidFront);
  const [lr, li] = rings(0, 0, W, W, 6, 1.4);
  const ang = tween(AJAR), rise = tween(0);
  let lastA = NaN, lastR = NaN;

  function drawLid(deg) {
    if (deg === lastA) return;
    lastA = deg;
    const a = -deg * Math.PI / 180, c = [0, 0, H], T = (u, v, z) => P(...rotY([u, v, z], c, a));
    const pts = [];
    lr.forEach((s) => { pts.push(T(s.u, s.v, H), T(s.u, s.v, H + LT)); });
    lid.sil.setAttribute("d", poly(hull(pts)));
    lid.cr.setAttribute("d", poly(li.map((s) => T(s.u, s.v, deg > 90 ? H : H + LT))));
    const par = deg > 90 ? lidBack : lidFront;
    if (lid.g.parentNode !== par) par.appendChild(lid.g);
  }
  function drawTh(r) {
    if (r === lastR) return;
    lastR = r;
    if (r < 0.4) { th.sil.setAttribute("d", ""); th.cr.setAttribute("d", ""); return; }
    const foot = circ(8, 24).map((s) => ({ ...s, u: s.u + W / 2, v: s.v + W / 2 }));
    const top = circ(6.4, 24).map((s) => ({ ...s, u: s.u + W / 2, v: s.v + W / 2 }));
    const pts = foot.map((s) => P(s.u, s.v, H)).concat(top.map((s) => P(s.u, s.v, H + r)));
    th.sil.setAttribute("d", poly(hull(pts)));
    const dimples = [];
    for (let k = 1; k <= 3; k++) dimples.push(poly(circ(1.6 * k, 16).map((s) => P(s.u + W / 2, s.v + W / 2, H + r))));
    th.cr.setAttribute("d", dimples.join(""));
  }
  const B = register(stage, (_dt, now) => {
    drawLid(tval(ang, now));
    drawTh(tval(rise, now));
    return !tdone(ang, now) || !tdone(rise, now);
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tset(ang, a ? OPEN : AJAR, now, a ? 0 : lag);
    tset(rise, a ? RISE : 0, now, a ? lag : 0);
    lid.sil.classList.toggle("hi", !a);
    th.sil.classList.toggle("hi", a);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -6 && x < W + 4 && y > -4 && y < W + 4;
  }
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lag = v; }, destroy: bag.dispose };
}

hairline({
  name: "thimble",
  means: "A thimble box: the pointer swings the hinged lid back and the thimble rises out of the box after it.",
  rules: [4, 5, 6, 8],
  range: [0, 160, 400],
  tour: [[221, 206], [221, 240], [221, 170], null],
  mount,
});
