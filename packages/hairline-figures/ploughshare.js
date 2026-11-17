/**
 * Plough: a hand plough on one wheel, a long beam rising back to two
 * splayed handles, the share hanging under the beam. The pointer's place
 * across the stage pitches the frame about the axle: handles up lifts the
 * share out, handles down digs it in, and the wheel turns along. At rest
 * the share is bright. The slider is the pitch.
 *
 * The pattern: one part answering the pointer's position (spring).
 */
const { Cam, fit, hull, poly, open, proj, clamp, rad, fillet, spring, stepS, disposer, mk, pointer, register } = HL;

const S2 = Math.SQRT1_2, A0 = 46, Z0 = 13, WR = 13;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.6);
  const W = (a, b, z) => [(a + b) * S2, (b - a) * S2, z];
  const rot = ([a, b, z], t) => { const c = Math.cos(t), s = Math.sin(t), da = a - A0, dz = z - Z0; return [A0 + da * c + dz * s, b, Z0 - da * s + dz * c]; };
  const FAR = [[A0, 0, Z0], [20, 0, 26], [-34, -10, 42], [-46, -11, 46]];
  const NEAR = [[20, 0, 26], [-34, 10, 42], [-46, 11, 46]];
  const BEAM = [[A0, 0, Z0], [20, 0, 26]];
  const SHARE = [[24, 0, 24], [16, 0, 24], [8, 0, 6], [-2, 0, -2], [14, 0, 0], [24, 0, 10]];
  const all = (t) => FAR.concat(NEAR, SHARE).map((q) => W(...rot(q, t)));
  const ext = all(rad(-30)).concat(all(rad(30)), [W(A0 + WR, 0, 0), W(A0 + WR, 0, 2 * Z0), W(A0 - WR, 0, 2 * Z0)]);
  fit(C, ext, 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const pp = (q, t) => P(...W(...rot(q, t)));
  const bar = (pts, w) => {
    let d = "";
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = (-(y1 - y0) / L) * w, ny = ((x1 - x0) / L) * w;
      d += poly(fillet([[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]], [w, w, w, w], 3));
    }
    return d;
  };
  const far = mk("path", { class: "sil" }, g);
  const tire = mk("path", { class: "sil" }, g), spokes = mk("path", { class: "lo nf" }, g), hub = mk("path", {}, g);
  const beam = mk("path", { class: "sil" }, g);
  const share = mk("path", { class: "sil hi" }, g);
  const near = mk("path", { class: "sil" }, g);
  const wheel = (r, b, n) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return P(...W(A0 + r * Math.cos(t), b, Z0 + r * Math.sin(t))); });

  tire.setAttribute("d", poly(hull(wheel(WR, -2.5, 40).concat(wheel(WR, 2.5, 40)))) + poly(wheel(WR - 2.6, 2.5, 40)));
  hub.setAttribute("d", poly(hull(wheel(2.6, -4, 16).concat(wheel(2.6, 4, 16)))));
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    far.setAttribute("d", bar(FAR.map((q) => pp(q, t)), 2.6) + bar([pp([-46, -11, 46], t), pp([-56, -12, 50], t)], 4));
    near.setAttribute("d", bar(NEAR.map((q) => pp(q, t)), 2.6) + bar([pp([-46, 11, 46], t), pp([-56, 12, 50], t)], 4));
    beam.setAttribute("d", bar(BEAM.map((q) => pp(q, t)), 3.2) + bar([pp([-34, -10, 42], t), pp([-34, 10, 42], t)], 1.8));
    const sp = SHARE.map((q) => pp(q, t));
    share.setAttribute("d", poly(fillet(sp, [1, 1, 3, 1.5, 3, 1], 3)));
    let s = "";
    for (let k = 0; k < 6; k++) {
      const a = t * 4 + (k / 6) * 2 * Math.PI;
      s += open([P(...W(A0, 2.5, Z0)), P(...W(A0 + (WR - 2.6) * Math.cos(a), 2.5, Z0 + (WR - 2.6) * Math.sin(a)))]);
    }
    spokes.setAttribute("d", s);
  }

  const REST = rad(-8), spr = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(spr, dt); draw(spr.x); return m; });
  bag.add(B.unregister);
  const cx = P(...W(0, 0, 20))[0];
  bag.add(pointer(stage, {
    move: ([sx]) => {
      const t = clamp((cx - sx) / 110, -1, 1) * rad(max);
      spr.t = t;
      const d = Math.round(Math.abs(t) * 180 / Math.PI);
      read.textContent = d < 2 ? "level" : (t > 0 ? "lift " : "dig ") + d + "°";
      B.wake();
    },
    leave: () => { spr.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  draw(REST);
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "ploughshare",
  means: "A hand plough on one wheel: the pointer pitches its handles about the axle, lifting the share out or digging it in.",
  rules: [1, 3, 5, 8],
  range: [10, 20, 30],
  tour: [[60, 141], [390, 160], [200, 160], null],
  mount,
});
