/**
 * Bullet camera: a wall plate, a bracket arm and a long bullet camera with a
 * sun hood on a ball joint. The camera swings round to aim at the pointer.
 * At rest it looks out to the right and its lens ring is bright.
 */
const { Cam, clamp, fit, hull, poly, proj, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const PX = 0, PY = 16, PZ = 50, L = 46, R = 8, REST = 0.25;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lag = value;
  const C = Cam(45, 0.5, 4.0);
  fit(C, [[-10, 0, 36], [10, 0, 66], [-44, 20, 44], [44, 20, 44], [0, 62, 44]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const hb = (pts) => poly(hull(pts.map((p) => P(...p))));
  const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  mk("path", { class: "sil", d: hb(box(-10, 0, 36, 10, 3, 64)) }, g);
  mk("path", { class: "sil", d: hb(box(-2.5, 3, PZ - 2.5, 2.5, PY, PZ + 2.5)) }, g);
  const ring = (u, rr) => { const o = []; for (let i = 0; i < 20; i++) { const t = (i / 20) * 2 * Math.PI; o.push([u, rr * Math.cos(t), rr * Math.sin(t)]); } return o; };
  const cam = mk("g", {}, g);
  const hood = mk("path", { class: "sil" }, cam), body = mk("path", { class: "sil" }, cam), lens = mk("path", { class: "sil hi" }, cam);
  const yaw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), pc = Math.cos(-0.25), ps = Math.sin(-0.25);
    const T = ([u, v, w]) => { const u2 = u * pc - w * ps, w2 = u * ps + w * pc; return [PX + u2 * c - v * s, PY + 4 + u2 * s + v * c, PZ + 4 + w2]; };
    body.setAttribute("d", hb(ring(-10, R).concat(ring(L - 10, R)).map(T)));
    hood.setAttribute("d", hb([[-6, -R - 2, R], [L - 4, -R - 2, R], [L - 4, R + 2, R], [-6, R + 2, R], [-6, -R - 2, R + 2.5], [L - 4, -R - 2, R + 2.5], [L - 4, R + 2, R + 2.5], [-6, R + 2, R + 2.5]].map(T)));
    lens.setAttribute("d", hb(ring(L - 10, R - 2).map(T)));
    const toward = s + c > 0;
    if (toward) { cam.appendChild(hood); cam.appendChild(body); cam.appendChild(lens); }
    else { cam.appendChild(lens); cam.appendChild(body); cam.appendChild(hood); }
  }
  const B = register(stage, (_dt, now) => { draw(tval(yaw, now)); return !tdone(yaw, now); });
  bag.add(B.unregister);
  function aim(p) {
    const now = performance.now();
    let t = REST;
    if (p) { const [x, y] = unproj(C, p[0], p[1], 30); t = clamp(Math.atan2(y - PY, x - PX), 0, Math.PI); }
    tset(yaw, t, now, lag);
    read.textContent = p ? Math.round((t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cctvdome",
  means: "A bullet camera on a wall bracket: the camera swings round on its joint to aim at the pointer.",
  rules: [1, 2, 5, 6],
  range: [0, 0, 200],
  tour: [[59, 265], [313, 279], [143, 138], null],
  mount,
});
