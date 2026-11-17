/**
 * Staple gun: a heavy-duty staple gun, a squat body with the staple track
 * along its foot and a long lever hinged at the back. The pointer over it
 * squeezes the lever open and shut; the slider is how far it swings. At rest
 * the lever sits a little open, bright.
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

const L = 62, W = 12;
const F = {
  S: 3.7, rest: 0.25, hz: 14, foot: [-6, -14, L + 6, W + 14], range: [20, 38, 50],
  say: (a) => "lever " + Math.round(a) + "°",
  arm: (a) => ({ ax: "y", h: [4, 24], a: (a * Math.PI) / 180 }),
  ext(a) {
    return box([0, 0, 0, L - 18, W, 22]).concat(box([2, 0, 24, L, W, 31]).map((p) => rot(p, F.arm(a))));
  },
  build(g, P) {
    const body = part(g), nose = part(g), track = part(g), lev = part(g);
    draw(P, body, box([0, 0, 4, L - 18, W, 22]), TOPF, null, 4);
    draw(P, track, box([L - 30, 1, 0, L - 14, W - 1, 4]), null, null, 1.5);
    draw(P, nose, box([L - 22, -1, 0, L - 12, W + 1, 18]), TOPF, null, 2.5);
    return {
      hi: lev.sil,
      render(t, a) {
        draw(P, lev, box([2, 0.5, 24, L, W - 0.5, 31]), TOPF, F.arm(t * a), 3.5);
      },
    };
  },
};

hairline({
  name: "staplegun",
  means: "A heavy-duty staple gun: the pointer over it swings the long lever open on its back hinge.",
  rules: [3, 4, 5, 6],
  range: [20, 38, 50],
  tour: [[224, 225], [303, 264], [159, 192], null],
  mount: make(F),
});
