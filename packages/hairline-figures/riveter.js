/**
 * Hand riveter: a riveter lying on its side, a nose and head at one end and
 * two long handles hinged on the head. The pointer over it spreads the
 * handles wide; the slider is how far. At rest they sit almost closed, the
 * upper handle bright.
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

const L = 80, W = 10;
const F = {
  S: 3.4, rest: 0.15, hz: 10, foot: [-8, -14, L + 8, W + 14], range: [10, 20, 28],
  say: (a) => "open " + Math.round(a) + "°",
  arm: (a) => ({ ax: "y", h: [18, 11], a: (a * Math.PI) / 180 }),
  ext(a) {
    return box([18, 0, 12, L, W, 18]).map((p) => rot(p, F.arm(a))).concat(box([18, 0, 2, L, W, 8]).map((p) => rot(p, F.arm(-a))), box([-8, 0, 0, 20, W, 20]));
  },
  build(g, P) {
    const lo = part(g), head = part(g), nose = part(g), up = part(g);
    draw(P, head, box([4, -1, 1, 22, W + 1, 19]), TOPF, null, 4);
    draw(P, nose, box([-8, 2, 7, 4, W - 2, 13]), null, null, 2);
    return {
      hi: up.sil,
      render(t, a) {
        draw(P, lo, box([18, 1, 2, L, W - 1, 8]), TOPF, F.arm(-t * a), 3);
        draw(P, up, box([18, 1, 12, L, W - 1, 18]), TOPF, F.arm(t * a), 3);
      },
    };
  },
};

hairline({
  name: "riveter",
  means: "A hand riveter: the pointer over it spreads the two long handles apart on their hinge at the head.",
  rules: [3, 4, 5, 6],
  range: [10, 20, 28],
  tour: [[231, 145], [303, 181], [135, 97], null],
  mount: make(F),
});
