/**
 * Quad bike: four fat wheels under a short body, a seat, a front rack and
 * handlebars on a stem. The pointer steers it: the handlebars and both front
 * wheels swing toward the side the pointer is on, further the further out it
 * is. At rest the bars sit a little turned, bright. The slider is how far the
 * front wheels can turn.
 *
 * The pattern: one continuous steering angle on a spring; the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, facing, fit, hull, open, poly, proj, rrect, run, seg, unproj, spring, stepS, rad, clamp,
  disposer, mk, pointer, register, solid,
} = HL;

const MAX = 26, REST = 10, R = 9, W = 7, AX = 22, TY = 17;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-33, -25, 0], [33, 25, 0], [-33, 25, 0], [33, -25, 0], [6, -15, 31], [6, 15, 31], [-22, 0, 27]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y, steer) => {
    const el = solid(g);
    return { x, y, steer, el, hub: mk("path", { class: "nf lo" }, el.g) };
  };
  const RF = wheel(-AX, -TY, false), FF = wheel(AX, -TY, false);
  const body = solid(g), seat = solid(g), rack = solid(g), bars = mk("path", { class: "nf sil" }, g);
  const RN = wheel(-AX, TY, false), FN = wheel(AX, TY, true);
  FF.steer = true;
  const wheels = [RF, FF, RN, FN];
  const tap = (el, foot, top, z0, z1) => {
    const at = (r, z) => r.map((q) => P(q.u, q.v, z));
    const inner = rrect(top[0] + 1, top[1] + 1, top[2] - 1, top[3] - 1, Math.max(0.5, top[4] - 1), 4);
    el.sil.setAttribute("d", poly(hull(at(rrect(...foot, 4), z0).concat(at(rrect(...top, 4), z1)))));
    el.cr.setAttribute("d", open(at(run(inner, front), z1)));
  };
  tap(body, [-26, -12, 27, 12, 6], [-20, -9, 18, 9, 5], 9, 20);
  tap(seat, [-24, -7, 0, 7, 3], [-23, -6, -1, 6, 2.6], 20, 25);
  tap(rack, [17, -15, 30, 15, 2], [17, -15, 30, 15, 2], 19.5, 21);
  let drawn = NaN;

  function draw(a) {
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    for (const w of wheels) {
      const t = w.steer ? a : 0, fx = Math.cos(t), fy = Math.sin(t), ax = -fy, ay = fx;
      const circle = (off, r) => { const o = []; for (let i = 0; i < 32; i++) { const s = (i / 32) * Math.PI * 2; o.push(P(w.x + ax * off + fx * r * Math.cos(s), w.y + ay * off + fy * r * Math.cos(s), R + r * Math.sin(s))); } return o; };
      w.el.sil.setAttribute("d", poly(hull(circle(-W / 2, R).concat(circle(W / 2, R)))));
      w.hub.setAttribute("d", poly(circle(W / 2, R - 4.5)));
    }
    const c = Math.cos(a), s = Math.sin(a), H = (u, v, z) => P(6 + u * c - v * s, u * s + v * c, z);
    bars.setAttribute("d", seg(P(10, 0, 20), H(0, 0, 30)) + seg(H(1, -14, 31), H(0, -5, 30)) + seg(H(0, -5, 30), H(0, 5, 30)) + seg(H(0, 5, 30), H(1, 14, 31)));
  }

  const sp = spring(rad(REST));
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  let last = null;
  function aim(k) {
    const on = k !== null;
    sp.t = rad(on ? MAX * amp * k : REST);
    bars.classList.toggle("hi", !on);
    FN.el.sil.classList.toggle("hi", on);
    FF.el.sil.classList.toggle("hi", on);
    const deg = Math.round((sp.t * 180) / Math.PI);
    read.textContent = on ? (deg < 0 ? "L " : deg > 0 ? "R " : "") + Math.abs(deg) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      last = Math.abs(x) < 48 && Math.abs(y) < 44 ? clamp(y / 28, -1, 1) : null;
      aim(last);
    },
    leave: () => { last = null; aim(null); },
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { amp = v; aim(last); }, destroy: bag.dispose };
}

hairline({
  name: "quadbike",
  means: "A quad bike: the pointer steers it, the handlebars and both front wheels swinging toward its side.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[200, 260], [305, 197], [255, 235], null],
  mount,
});
