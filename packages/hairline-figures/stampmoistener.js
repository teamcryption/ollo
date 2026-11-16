/**
 * Postage meter: a meter on a long feed deck, its print head bridging the deck. The pointer over it feeds the envelope through the slot under the head and out the far side, franked; the slider is how far. At rest the envelope waits at the slot, bright.
 */
const { Cam, clamp, fillet, fit, hull, poly, proj, unproj, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

// a world point turned about an axis along x or y through h, then moved by d
function rot(p, r) {
  if (!r) return p;
  let [x, y, z] = p;
  const c = Math.cos(r.a), s = Math.sin(r.a), d = r.d || [0, 0, 0];
  if (r.ax === "y") { const u = x - r.h[0], w = z - r.h[1]; x = r.h[0] + u * c - w * s; z = r.h[1] + u * s + w * c; }
  else if (r.ax === "x") { const u = y - r.h[0], w = z - r.h[1]; y = r.h[0] + u * c - w * s; z = r.h[1] + u * s + w * c; }
  return [x + d[0], y + d[1], z + d[2]];
}
const box = ([x0, y0, z0, x1, y1, z1]) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const rnd = (pts, r) => fillet(pts, pts.map(() => r), 3);
function part(g, cls) { const p = mk("g", {}, g); return { g: p, sil: mk("path", { class: cls || "sil" }, p), cr: mk("path", { class: "nf lo" }, p) }; }
// a solid from its corners: a rounded hull, and the top face as its one crease
function draw(P, el, pts, top, r, rr) {
  const q = pts.map((p) => P(...rot(p, r)));
  el.sil.setAttribute("d", poly(rnd(hull(q), rr || 2.5)));
  el.cr.setAttribute("d", top ? poly(rnd(top.map((i) => q[i]), 1.5)) : "");
}
const TOPF = [4, 5, 6, 7];

function make(F) {
  return function mount({ stage, svg, read }, value) {
    const bag = disposer();
    let amp = value;
    const C = Cam(45, 0.5, F.S);
    fit(C, F.ext(F.range[2]), 200, 166);
    const P = proj(C), g = mk("g", {}, svg);
    const fig = F.build(g, P), tw = tween(F.rest);
    let last = NaN;
    const B = register(stage, (_dt, now) => {
      const t = tval(tw, now);
      if (t !== last) { last = t; fig.render(t, amp); }
      return !tdone(tw, now);
    });
    bag.add(B.unregister);
    // the hit: the pointer on a fixed plane through the resting body
    function hit([sx, sy]) {
      const [x, y] = unproj(C, sx, sy, F.hz), [x0, y0, x1, y1] = F.foot;
      return x > x0 && x < x1 && y > y0 && y < y1;
    }
    let act = null;
    function set(on) {
      if (on === act) return;
      act = on;
      tset(tw, on ? 1 : F.rest, performance.now(), 0);
      read.textContent = on ? F.say(amp) : "rest";
      B.wake();
    }
    set(false);
    fig.hi.classList.add("hi");
    bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
    bag.add(() => svg.replaceChildren());
    return { set: (v) => { amp = v; last = NaN; if (act) read.textContent = F.say(amp); B.wake(); }, destroy: bag.dispose };
  };
}
const hide = (el) => { el.sil.setAttribute("d", ""); el.cr.setAttribute("d", ""); };

const F = {
  S: 2.5, rest: 0, hz: 6, foot: [-30, -4, 100, 40], range: [56, 76, 84],
  say: (a) => "fed " + Math.round(a),
  env: (t, a) => [-30 + t * a, 3, 4.4, 16 + t * a, 33, 5.6],
  ext: (a) => box([-30, 0, 0, 100, 36, 4]).concat(box([22, 0, 4, 50, 36, 28])),
  build(g, P) {
    const deck = part(g), env = part(g), head = part(g);
    draw(P, deck, box([-30, 0, 0, 100, 36, 4.4]), TOPF, null, 3);
    draw(P, head, box([22, -2, 4.4, 50, 38, 28]), TOPF, null, 4);
    mk("path", { class: "nf lo", d: poly(rnd([P(28, 6, 28), P(44, 6, 28), P(44, 18, 28), P(28, 18, 28)], 1.5)) }, head.g);
    return {
      hi: env.sil,
      render(t, a) {
        const [x0, y0, z0, x1, y1, z1] = F.env(t, a);
        draw(P, env, box([x0, y0, z0, x1, y1, z1]), null, null, 1.5);
        env.cr.setAttribute("d", poly(rnd([P(x1 - 9, y0 + 3, z1), P(x1 - 3, y0 + 3, z1), P(x1 - 3, y0 + 10, z1), P(x1 - 9, y0 + 10, z1)], 1)));
      },
    };
  },
};

hairline({
  name: "stampmoistener",
  means: "A postage meter: the pointer over it slides the envelope through the slot under the print head and out, franked.",
  rules: [3, 4, 5, 6],
  range: [56, 76, 84],
  tour: [[244, 182], [150, 120], [270, 235], null],
  mount: make(F),
});
