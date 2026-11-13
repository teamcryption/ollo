/**
 * Camera tripod: a camera body with a lens barrel on a pan head, over a
 * centre column and three splayed legs, a pan handle out the back. The pointer
 * is the subject: the camera pans and tilts to aim at it, each on its own
 * spring, and the lens racks out the farther away it is. At rest the camera
 * looks off to the right, lens half out and bright. The slider is how quickly
 * it follows (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (terrain's spring, on yaw, pitch and zoom);
 * the hit is on the floor's plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rrect, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const HZ = 62, APEX = 42, FOOT = 30, BD = 6, BW = 11, BH = 7.5, LR = 4.6;
const REST = { yaw: rad(-25), pitch: rad(-6), zoom: 1.6 };
const VIEW = [0.612, 0.612, 0.5];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const lensLen = (z) => 4 + 7 * z;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.0);
  const ext = [];
  for (let k = 0; k < 3; k++) { const a = rad(105 + k * 120); ext.push([FOOT * Math.cos(a), FOOT * Math.sin(a), 0]); }
  for (let k = 0; k < 8; k++) for (const p of [rad(-24), rad(5)]) { const a = (k / 8) * Math.PI * 2, R = BD + lensLen(3) + 2; ext.push([R * Math.cos(a) * Math.cos(p), R * Math.sin(a) * Math.cos(p), HZ + R * Math.sin(p)]); }
  ext.push([0, 0, HZ + BH + 2]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const legs = [];
  for (let k = 0; k < 3; k++) {
    const a = rad(105 + k * 120), cx = Math.cos(a), cy = Math.sin(a);
    legs.push(seg(P(cx * 3, cy * 3, APEX), P(cx * FOOT, cy * FOOT, 0.8)), seg(P(cx * 3, cy * 3, APEX - 3), P(cx * (FOOT - 1.6), cy * (FOOT - 1.6), 0.8)));
    place(flatDot(g, C, 1.3, "dot off"), P(cx * FOOT, cy * FOOT, 0));
  }
  mk("path", { class: "nf sil", d: legs.join("") }, g);
  put(solid(g), prism(P, front, circ(4.5, 32), circ(3.6, 32), APEX - 3, APEX));
  put(solid(g), prism(P, front, circ(2, 16), null, APEX, HZ - 12));
  put(solid(g), prism(P, front, circ(5.5, 32), circ(4.6, 32), HZ - 12, HZ - BH - 1));
  const rig = mk("g", {}, g);
  const handle = mk("path", { class: "nf sil" }, rig), body = solid(rig);
  const lens = mk("path", { class: "sil hi" }, rig), rim = mk("path", { class: "nf" }, rig);

  const opts = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const S = { yaw: spring(REST.yaw, opts), pitch: spring(REST.pitch, opts), zoom: spring(REST.zoom, opts) };
  let lastKey = "", toward = null;
  const FACE = rrect(-BW, -BH, BW, BH, 2.5, 4), FACEI = rrect(-BW + 1.2, -BH + 1.2, BW - 1.2, BH - 1.2, 1.5, 4);

  function draw() {
    const key = S.yaw.x.toFixed(4) + S.pitch.x.toFixed(4) + S.zoom.x.toFixed(3);
    if (key === lastKey) return;
    lastKey = key;
    const cy = Math.cos(S.yaw.x), sy = Math.sin(S.yaw.x), cp = Math.cos(S.pitch.x), sp = Math.sin(S.pitch.x);
    const d = [cp * cy, cp * sy, sp], u = [sy, -cy, 0], v = [-sp * cy, -sp * sy, cp];
    const at = (off, a, b) => P(...[0, 1, 2].map((j) => [0, 0, HZ][j] + d[j] * off + a * u[j] + b * v[j]));
    const face = (ring, off) => ring.map((q) => at(off, q.u, q.v));
    const circle = (off, r) => Array.from({ length: 28 }, (_, i) => { const t = (i / 28) * Math.PI * 2; return at(off, r * Math.cos(t), r * Math.sin(t)); });
    const fwd = d[0] * VIEW[0] + d[1] * VIEW[1] + d[2] * VIEW[2] > 0;
    body.sil.setAttribute("d", poly(hull(face(FACE, -BD).concat(face(FACE, BD)))));
    body.cr.setAttribute("d", poly(face(FACEI, fwd ? BD : -BD)));
    body.sil.classList.toggle("hi", !fwd);
    const L = lensLen(S.zoom.x), end = circle(BD + L, LR + 0.8);
    lens.setAttribute("d", poly(hull(circle(BD, LR).concat(end))));
    rim.setAttribute("d", fwd ? poly(end) + poly(circle(BD + L - 0.01, LR - 0.6)) : "");
    handle.setAttribute("d", seg(P(0, 0, HZ - BH - 1), P(-cy * 26, -sy * 26, HZ - BH - 8)));
    if (fwd !== toward) {
      toward = fwd;
      if (fwd) rig.append(handle, body.g, lens, rim); else rig.append(rim, lens, body.g, handle);
    }
  }

  const B = register(stage, (dt) => {
    const a = stepS(S.yaw, dt), b = stepS(S.pitch, dt), c = stepS(S.zoom, dt);
    draw();
    return a || b || c;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    if (over) {
      const r = Math.hypot(over[0], over[1]);
      if (r > 4) S.yaw.t = S.yaw.t + wrap(Math.atan2(over[1], over[0]) - S.yaw.t);
      S.pitch.t = clamp(Math.atan2(-HZ * 0.3, r), rad(-24), rad(5));
      S.zoom.t = clamp(1 + (r - 20) / 30, 1, 3);
    } else {
      S.yaw.t = S.yaw.t + wrap(REST.yaw - S.yaw.t);
      S.pitch.t = REST.pitch; S.zoom.t = REST.zoom;
    }
    read.textContent = over ? "zoom " + Math.round(S.zoom.t * 2) / 2 + "×" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y), k = Math.min(1, 80 / r);
      over = r > 110 ? null : [x * k, y * k];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const s of Object.values(S)) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "cameratripod",
  means: "A camera on a tripod: it pans and tilts to aim at the pointer, and its lens zooms out the farther the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[290, 300], [110, 270], [250, 150], null],
  mount,
});
