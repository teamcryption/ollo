/**
 * Pipe bender: a round former on a short block, a pipe run along its groove
 * and a long lever pinned at the former's centre with a shoe that presses the
 * pipe. The lever swings round the pin toward the pointer and wraps the pipe
 * round the former with it. At rest the lever stands part way through a bend,
 * bright. The slider is how far the lever may swing.
 */
const { Cam, clamp, facing, fit, hull, poly, open, prism, proj, rings, circ, unproj, spring, stepS, disposer, mk, pointer, put, register, solid, rad } = HL;

function xf(az) {
  const ca = Math.cos(az), sa = Math.sin(az);
  return ([x, y, z]) => [x * ca - y * sa, x * sa + y * ca, z];
}
function box(g) { const grp = mk("g", {}, g); return { g: grp, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp) }; }
function drawBox(P, el, b, T) {
  const [x0, x1, y0, y1, z0, z1] = b, pts = [];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) pts.push(P(...T([x, y, z])));
  el.sil.setAttribute("d", poly(hull(pts)));
  el.cr.setAttribute("d", poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map((p) => P(...T(p)))));
}
const R = 16, RP = R + 2.6, ZP = 9.5, W = 2.6, REST = 50;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, on = false;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-62, RP, 0], [20, -20, 0], [0, 66, 18], [66, 0, 18], [47, 47, 18], [47, -47, 18], [0, -66, 18], [-30, -RP, 9]], 200, 165);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const block = solid(g);
  const [br, bi] = rings(-20, -20, 20, 20, 7, 1.4);
  put(block, prism(P, front, br, bi, 0, 5));
  const former = solid(g);
  put(former, prism(P, front, circ(R, 40), circ(R - 1.6, 40), 5, 13));
  const pipe = mk("g", {}, g);
  const tube = mk("path", { class: "sil" }, pipe), seam = mk("path", { class: "nf lo" }, pipe);
  const shoe = box(g), lever = box(g), grip = box(g);
  const pin = solid(g);
  put(pin, prism(P, front, circ(3.2, 16), circ(2, 16), 13, 20));
  lever.sil.classList.add("hi");
  const ang = spring(REST);
  let last = NaN;
  function ribbon(pts) {
    const s = pts.map((p) => P(...p)), L = [], Rr = [];
    for (let i = 0; i < s.length; i++) {
      const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, w = W * C.S;
      L.push([s[i][0] - dy / n * w, s[i][1] + dx / n * w]);
      Rr.push([s[i][0] + dy / n * w, s[i][1] - dx / n * w]);
    }
    return { d: poly(L.concat(Rr.reverse())), c: open(s) };
  }
  function draw() {
    const a = ang.x;
    if (a === last) return;
    last = a;
    const pts = [[-60, RP, ZP], [-30, RP, ZP], [0, RP, ZP]];
    const n = Math.max(2, Math.ceil(a / 6));
    for (let i = 1; i <= n; i++) { const t = rad(90 - a * i / n); pts.push([RP * Math.cos(t), RP * Math.sin(t), ZP]); }
    const te = rad(90 - a), e = pts[pts.length - 1];
    pts.push([e[0] + 26 * Math.sin(te), e[1] - 26 * Math.cos(te), ZP]);
    const rb = ribbon(pts);
    tube.setAttribute("d", rb.d);
    seam.setAttribute("d", rb.c);
    const T = xf(te);
    drawBox(P, shoe, [RP - 5, RP + 6, -6, 6, 4, 15], T);
    drawBox(P, lever, [-5, 64, -3, 3, 15, 18.5], T);
    drawBox(P, grip, [46, 64, -4.2, 4.2, 14, 19.5], T);
    read.textContent = !on ? "rest" : Math.round(ang.t) + "°";
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    on = true;
    const [x, y] = unproj(C, sx, sy, 0);
    let t = Math.atan2(y, x) * 180 / Math.PI;
    if (t < -120) t += 360;
    ang.t = clamp(90 - t, 5, 30 + 150 * reach);
    last = NaN; B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { on = false; ang.t = REST; last = NaN; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pipebender",
  means: "A pipe bender: the lever swings round the former toward the pointer and its shoe wraps the pipe round the groove.",
  rules: [1, 3, 5],
  range: [0.2, 1, 1],
  tour: [[311, 217], [357, 173], [269, 262], null],
  mount,
});
