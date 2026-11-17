/**
 * Film back: a medium format film magazine standing on its face, a winding
 * knob on top and the dark slide in its slot. The pointer on the back draws
 * the dark slide up out of its slot. At rest the slide sits home with its
 * tab showing, bright. The slider is how far the slide is drawn.
 *
 * The pattern: one part sliding; the hit is the rest pose's outline.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DX = 26, WY = 50, HZ = 50, REST = 5;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-4, -4, 0], [DX + 4, WY + 4, 0], [DX, -4, 0], [-4, WY, 0], [0, 0, HZ + 37], [6, WY, HZ + 37]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-4, -4, DX + 4, WY + 4, 4, 1.4); put(solid(g), prism(P, front, r, i, 0, 3)); }
  { const [r, i] = rings(0, 0, DX, WY, 4, 1.6); put(solid(g), prism(P, front, r, i, 3, HZ)); }
  mk("path", { class: "nf lo", d: poly([[3, 3], [7, 3], [7, WY - 3], [3, WY - 3]].map(([x, y]) => P(x, y, HZ))) }, g);
  const slide = solid(g);
  put(solid(g), prism(P, front, disc(17, 14, 6), disc(17, 14, 4.6), HZ, HZ + 4));
  put(solid(g), prism(P, front, disc(17, 14, 2), null, HZ + 4, HZ + 7));
  const [sr, si] = rings(3.5, 4, 6.5, WY - 4, 1, 0.5);
  const lift = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    put(slide, prism(P, front, sr, si, HZ, HZ + z));
  }
  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  const outline = hull([[0, 0, 0], [DX, 0, 0], [DX, WY, 0], [0, WY, 0], [0, 0, HZ + 6], [DX, 0, HZ + 6], [DX, WY, HZ + 6], [0, WY, HZ + 6]].map((p) => P(...p)));
  function inside([x, y]) {
    let s = 0;
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length], cr = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
      if (cr !== 0) { if (s && Math.sign(cr) !== s) return false; s = Math.sign(cr); }
    }
    return true;
  }
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(lift, o ? max : REST, performance.now(), 0);
    read.textContent = o ? "out " + Math.round(max) : "rest";
    B.wake();
  }
  slide.sil.classList.add("hi");
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "filmloader",
  means: "A medium format film back: the pointer on it draws the dark slide up out of its slot.",
  rules: [1, 4, 5, 8],
  range: [14, 33, 36],
  tour: [[200, 170], [246, 192], [200, 148], null],
  mount,
});
