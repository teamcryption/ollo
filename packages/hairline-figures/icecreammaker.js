/**
 * Ice cream maker: a round motor base, a freezer bowl on it, and a lid with
 * its motor hood and the churn paddle hanging under it. The lid swings up
 * on its back hinge and lifts the paddle out of the bowl; how far follows
 * the pointer from back to front. At rest the lid is just cracked, bright.
 * The slider is the widest opening.
 *
 * The pattern: one part swinging on a hinge, hit on the ground plane.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 20, ZB = 12, ZR = 36, HY = -R, REST = 0.22;
const disc = (r, n = 40) => circ(r, n);
const ring3 = (r, z, n = 40) => disc(r, n).map((q) => [q.u, q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxa = 0.5 + (value / 100) * 1.1;
  const C = Cam(45, 0.5, 3.37);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, -R - 14, ZR + 46], [0, R, ZR + 10]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, rrd(R + 2), rrd(R + 0.6), 0, ZB));
  const bowl = solid(g);
  put(bowl, prism(P, front, rrd(R), rrd(R - 2), ZB, ZR));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrd(R), ZB + 6)) }, bowl.g);
  const lidG = mk("g", {}, g), padG = mk("g", {}, g), hoodG = mk("g", {}, g);
  const lid = mk("path", { class: "sil hi" }, lidG), lidCr = mk("path", { class: "nf lo" }, lidG), hood = mk("path", { class: "sil" }, hoodG);
  const pad = mk("path", { class: "sil" }, padG), padCr = mk("path", { class: "nf lo" }, padG);
  function rrd(r) { return disc(r); }
  const rot = ([x, y, z], a) => {
    const dy = y - HY, dz = z - ZR;
    return [x, HY + dy * Math.cos(a) - dz * Math.sin(a), ZR + dy * Math.sin(a) + dz * Math.cos(a)];
  };
  const lidPts = ring3(R + 1, ZR).concat(ring3(R + 1, ZR + 5), ring3(R - 1, ZR + 7));
  const lidIn = ring3(R - 2, ZR + 7);
  const hoodPts = [];
  for (const z of [ZR + 7, ZR + 17]) for (const q of rings(-9, -15, 9, 3, 5, 1)[0]) hoodPts.push([q.u, q.v, z]);
  // the paddle: a flat blade in the x = 0 plane, hanging from the lid's middle
  const blade = fillet([[0, -10, ZR], [0, 10, ZR], [0, 8, ZB + 4], [0, -8, ZB + 4]].map(([x, y, z]) => [y, z]), [1, 1, 5, 5], 4).map(([y, z]) => [0, y, z]);
  const slot = [[0, -3, ZR - 4], [0, 3, ZR - 4], [0, 3, ZB + 10], [0, -3, ZB + 10]];
  function clip(pts) {
    const out = [], up = (p) => p[2] >= ZR + 0.5;
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      if (up(p)) out.push(p);
      if (up(p) !== up(q)) { const t = (ZR + 0.5 - p[2]) / (q[2] - p[2]); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1]), ZR + 0.5]); }
    });
    return out;
  }
  const ang = spring(REST);
  let last = NaN, after = null;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pr = (p) => P(...rot(p, a));
    lid.setAttribute("d", poly(hull(lidPts.map(pr))));
    lidCr.setAttribute("d", poly(lidIn.map(pr)));
    hood.setAttribute("d", poly(hull(hoodPts.map(pr))));
    const b = clip(blade.map((p) => rot(p, a))), s = clip(slot.map((p) => rot(p, a)));
    pad.setAttribute("d", b.length > 2 ? poly(b.map((p) => P(...p))) : "");
    padCr.setAttribute("d", s.length > 2 ? poly(s.map((p) => P(...p))) : "");
    const ahead = a > 0.68;
    if (ahead !== after) { after = ahead; if (ahead) g.append(hoodG, lidG, padG); else g.append(padG, lidG, hoodG); }
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.abs(x) > R + 14 || Math.abs(y) > R + 16) return leave();
    const t = clamp((y + R + 16) / (2 * R + 32), 0, 1);
    ang.t = REST + (0.3 + 0.7 * t) * (maxa - REST);
    read.textContent = "lid " + Math.round((ang.t * 180) / Math.PI) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxa = 0.5 + (v / 100) * 1.1; }, destroy: bag.dispose };
}

hairline({
  name: "icecreammaker",
  means: "An ice cream maker: the lid swings up on its back hinge and lifts the churn paddle out of the bowl, further toward the front.",
  rules: [1, 3, 5, 8],
  range: [0, 100, 100],
  tour: [[250, 252], [164, 296], [130, 312], null],
  mount,
});
