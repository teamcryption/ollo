/**
 * Golf flag: a round green with its cup, a ball lying near it and a pin
 * standing in the cup with its flag. The pointer is the wind: the flag
 * swings round the pole to stream toward it and the pin leans its way.
 * At rest the flag streams a little to the right, bright. The slider is the lean.
 *
 * The pattern: one part turning to the pointer (aim).
 */
const { Cam, circ, fit, hull, poly, proj, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const GR = 72, GZ = 4, PH = 118, FL = 50, FH = 30;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lean = value;
  const C = Cam(45, 0.5, 1.75);
  const ring = (cx, cy, r, z, n = 16) => circ(r, n).map((q) => [cx + q.u, cy + q.v, z]);
  const ext = ring(0, 0, GR, 0, 24).concat(ring(0, 0, GR, GZ, 24));
  for (const [a, b] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) { const t = rad(16); ext.push([a * PH * Math.sin(t), b * PH * Math.sin(t), GZ + PH], [a * (PH * Math.sin(t) + FL), b * (PH * Math.sin(t) + FL), GZ + PH]); }
  fit(C, ext, 200, 170);
  const P = proj(C), S = (pts) => pts.map((p) => P(...p));
  const g = mk("g", {}, svg);

  // the green, its fringe crease and the cup
  mk("path", { class: "sil", d: poly(hull(S(ext.slice(0, 48)))) }, g);
  mk("path", { class: "nf lo", d: poly(S(ring(0, 0, GR - 3, GZ, 48))) }, g);
  mk("path", { class: "nf", d: poly(S(ring(0, 0, 7, GZ, 24))) }, g);
  mk("path", { class: "nf lo", d: poly(S(ring(0, 0, 5.5, GZ - 1.5, 24))) }, g);
  // the ball, a few lengths short of the cup
  const ball = [];
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * Math.PI; ball.push(...ring(26, 20, 4.4 * Math.sin(t), GZ + 4.4 - 4.4 * Math.cos(t), 14)); }
  mk("path", { class: "sil", d: poly(hull(S(ball))) }, g);

  const pole = mk("path", { class: "sil" }, g), flag = mk("path", { class: "sil hi" }, g), seam = mk("path", { class: "nf lo" }, g);
  const dx = spring(0.7), dy = spring(-0.7), ln = spring(4);
  let last = "";
  function draw() {
    let ax = dx.x, ay = dy.x;
    const m = Math.hypot(ax, ay) || 1; ax /= m; ay /= m;
    const key = ax.toFixed(3) + ay.toFixed(3) + ln.x.toFixed(2);
    if (key === last) return;
    last = key;
    const t = rad(ln.x), at = (h) => [ax * h * Math.sin(t), ay * h * Math.sin(t), GZ - 6 + h * Math.cos(t)];
    const top = at(PH + 6);
    pole.setAttribute("d", poly(hull(S(ring(0, 0, 1.8, GZ - 6, 10).concat(ring(top[0], top[1], 1.8, top[2], 10), ring(top[0], top[1], 1.4, top[2] + 2.5, 10))))));
    // the flag: hung from the pole's top, streaming along (ax, ay) with a soft wave
    const nx = -ay, ny = ax, edge = (h0) => {
      const base = at(h0), out = [];
      for (let i = 0; i <= 8; i++) { const s = i / 8, w = 4 * Math.sin(Math.PI * s * 1.6); out.push([base[0] + ax * FL * s + nx * w, base[1] + ay * FL * s + ny * w, base[2] - 2 * s]); }
      return out;
    };
    const hiE = edge(PH), loE = edge(PH - FH);
    flag.setAttribute("d", poly(S(hiE.concat(loE.reverse()))));
    const mid = edge(PH - FH / 2);
    seam.setAttribute("d", poly(S(mid.slice(0, 3).concat(mid.slice(0, 3).reverse()))));
    // paint the flag behind the pole when it streams away from the viewer
    if (ax + ay < 0) { g.insertBefore(flag, pole); flag.after(seam); } else { pole.after(flag); flag.after(seam); }
  }
  draw();

  const B = register(stage, (dt) => { const a = stepS(dx, dt), b = stepS(dy, dt), c = stepS(ln, dt); draw(); return a || b || c; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { dx.t = 0.7; dy.t = -0.7; ln.t = 4; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], GZ), d = Math.hypot(x, y);
    if (d > 4) { dx.t = x / d; dy.t = y / d; }
    ln.t = clamp(d / 80, 0, 1) * lean;
    const deg = (Math.round((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
    read.textContent = deg + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lean = v; }, destroy: bag.dispose };
}

hairline({
  name: "bowlingpinset",
  means: "A golf flag in the cup on a round green: the flag swings round its pole toward the pointer and the pin leans its way.",
  rules: [1, 3, 5, 8],
  range: [0, 12, 16],
  tour: [[52, 250], [348, 250], [200, 300], null],
  mount,
});
