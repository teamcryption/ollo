/**
 * Compost tumbler: an eight-sided drum on an axle between two A-frame legs,
 * a hatch on its side. The pointer turns the drum: the further right it
 * stands, the further the drum rolls round, carrying its hatch over the top.
 * At rest the hatch faces up the slope, bright. The slider is how far one
 * sweep of the pointer turns it.
 *
 * The pattern: a continuous aim on one axle (a spring on an angle); the hit
 * is the pointer's screen x, which never moves with the drum.
 */
const { Cam, fit, hull, poly, proj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const HZ = 34, R = 20, W = 15, REST = 50;
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const oct = (y, r) => { const o = []; for (let i = 0; i < 8; i++) { const t = ((i + 0.5) / 8) * Math.PI * 2; o.push([r * Math.cos(t), y, r * Math.sin(t)]); } return o; };
const HATCH = box(R - 1, -9, -6, R + 1.6, 9, 6), HANDLE = box(R + 1.6, -4, -1.2, R + 3.6, 4, 1.2);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-24, -24, 0], [24, 24, 0], [-24, 24, 0], [24, -24, 0], [0, -W, HZ + R + 4], [0, W, HZ + R + 4]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const solid0 = (pts, cls) => mk("path", { d: poly(hull(pts.map((p) => P(...p)))), class: cls }, g);
  mk("path", { d: poly([P(-26, -24, 0), P(26, -24, 0), P(26, 24, 0), P(-26, 24, 0)]), class: "nf dash" }, g);
  const frame = (y) => { solid0([...box(-22, y - 1.5, 0, -18, y + 1.5, 1), ...box(-2, y - 1.5, HZ, 2, y + 1.5, HZ + 2)], "sil"); solid0([...box(18, y - 1.5, 0, 22, y + 1.5, 1), ...box(-2, y - 1.5, HZ, 2, y + 1.5, HZ + 2)], "sil"); };
  frame(-W - 4);
  const drum = mk("g", {}, g);
  const shell = mk("path", { class: "sil" }, drum), end = mk("path", { class: "" }, drum), ribs = mk("path", { class: "lo nf" }, drum);
  const hatch = mk("path", { class: "sil" }, drum), handle = mk("path", { class: "" }, drum);
  frame(W + 4);
  solid0(box(-1.8, W, HZ - 1.8, 1.8, W + 7, HZ + 1.8), "");
  const sp = spring(rad(REST), { k: 80, c: 15 });
  let last = NaN;
  const rot = (a) => { const c = Math.cos(a), s = Math.sin(a); return ([x, y, z]) => P(x * c - z * s, y, HZ + x * s + z * c); };
  const B = register(stage, (dt) => {
    const m = stepS(sp, dt), a = sp.x;
    if (a !== last) {
      last = a;
      const f = rot(a), back = oct(-W, R), near = oct(W, R);
      shell.setAttribute("d", poly(hull([...back, ...near].map(f))));
      end.setAttribute("d", poly(near.map(f)));
      ribs.setAttribute("d", near.map((p, i) => "M" + f(p) + "L" + f(back[i])).join(""));
      // the hatch shows only while it faces the viewer
      const n = [Math.cos(a), Math.sin(a)], vis = n[0] * 0.7 + n[1] * 0.7 > -0.15;
      hatch.setAttribute("d", vis ? poly(hull(HATCH.map(f))) : "");
      handle.setAttribute("d", vis ? poly(hull(HANDLE.map(f))) : "");
    }
    return m;
  });
  bag.add(B.unregister);
  function aim(deg, on) {
    sp.t = rad(deg);
    hatch.classList.toggle("hi", true);
    read.textContent = on ? Math.round(deg) + "\u00b0" : "rest";
    B.wake();
  }
  aim(REST, false);
  bag.add(pointer(stage, {
    move: ([sx]) => aim(REST - clamp((sx - 110) / 190, 0, 1) * (60 + 80 * reach), true),
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "dunghook",
  means: "A compost tumbler on its A-frame: the pointer rolls the eight-sided drum round its axle, carrying the hatch over the top.",
  rules: [1, 3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[287, 209], [160, 150], [320, 170], null],
  mount,
});
