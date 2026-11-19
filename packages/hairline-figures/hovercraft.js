/**
 * Hovercraft: a rounded hull riding on its rubber skirt, a deck, a tapered
 * cabin at the bow and a big ducted fan at the stern. The pointer over the
 * craft fills the skirt: the whole hull rises on it, higher the nearer the
 * pointer is to the middle. At rest the craft sits low, its fan duct bright.
 * The slider is how far the skirt lifts the hull.
 *
 * The pattern: a continuous lift on one spring; the hit is on the ground plane.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LIFT = 16, REST = 2, SK = 5, R = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-46, -26, 0], [46, 26, 0], [-46, 26, 0], [46, -26, 0], [-34, 0, SK + LIFT * 1.5 + 6 + 2 * R], [18, 0, SK + LIFT * 1.5 + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const skirt = solid(g), deck = solid(g);
  const duct = mk("path", { class: "sil" }, g), mouth = mk("path", {}, g), blades = mk("path", { class: "nf lo" }, g);
  const rud = solid(g), cabin = solid(g), glass = mk("path", { class: "nf lo" }, g);
  const [skR] = rings(-46, -26, 46, 26, 16, 2), [dR, dI] = rings(-42, -22, 42, 22, 12, 1.6);
  const foot = rrect(-18, -16, 20, 16, 7, 6), top = rrect(-13, -12, 9, 12, 5, 6), inner = rrect(-12, -11, 8, 11, 4, 6);
  const ycz = (x, cz, r) => { const o = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; o.push(P(x, r * Math.cos(t), cz + r * Math.sin(t))); } return o; };
  const sp = spring(REST);
  let drawn = NaN;

  function draw(l) {
    if (Math.abs(l - drawn) < 1e-3) return;
    drawn = l;
    const s = SK + l, d = s + 4, cz = d + R + 1;
    put(skirt, prism(P, front, skR, null, 0, s));
    put(deck, prism(P, front, dR, dI, s, d));
    duct.setAttribute("d", poly(hull(ycz(-38, cz, R).concat(ycz(-30, cz, R)))));
    mouth.setAttribute("d", poly(ycz(-30, cz, R - 2.4)));
    const hub = P(-30, 0, cz), bl = [];
    for (let k = 0; k < 3; k++) { const t = k * 2.094 + 0.4; bl.push("M" + hub.join(",") + "L" + P(-30, (R - 3) * Math.cos(t), cz + (R - 3) * Math.sin(t)).join(",")); }
    blades.setAttribute("d", bl.join("") + poly(ycz(-30, cz, 2)));
    put(rud, prism(P, front, rings(-41, -1, -38, 1, 0.8, 0.3)[0], null, d, d + 2 * R + 3));
    const sil = poly(hull(ringAt(P, foot, d).concat(ringAt(P, top, d + 15))));
    put(cabin, { sil, crease: open(ringAt(P, run(inner, front), d + 15)) });
    glass.setAttribute("d", open([P(19, -13, d + 4), P(19, 13, d + 4)].concat([P(14, 13, d + 11), P(14, -13, d + 11)])));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(on, near) {
    sp.t = on ? REST + (LIFT - REST) * amp * (0.55 + 0.45 * near) : REST;
    duct.classList.toggle("hi", !on);
    skirt.sil.classList.toggle("hi", on);
    read.textContent = on ? "lift " + Math.round(sp.t) : "rest";
    B.wake();
  }
  let last = null;
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      const on = Math.abs(x) < 56 && Math.abs(y) < 38;
      last = on ? 1 - Math.min(1, Math.hypot(x / 46, y / 26)) : null;
      aim(on, last || 0);
    },
    leave: () => { last = null; aim(false, 0); },
  }));
  bag.add(() => svg.replaceChildren());
  aim(false, 0);
  return { set: (v) => { amp = v; if (last !== null) aim(true, last); }, destroy: bag.dispose };
}

hairline({
  name: "hovercraft",
  means: "A hovercraft on its skirt: the pointer over it fills the skirt and the hull rises, highest at the middle.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[200, 213], [235, 250], [170, 190], null],
  mount,
});
