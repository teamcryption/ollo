/**
 * Toilet lid: a toilet with its cistern, bowl, seat ring and lid. At rest the
 * lid sits a little ajar, bright. Over the toilet the lid swings up on its
 * hinge towards the cistern. The slider is how far it opens.
 */
const { Cam, fit, hull, poly, proj, ringAt, rrect, open, run, facing, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const BZ = 30, L = 46, W = 18, HX = 4, REST = 14;
const toR = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-15, -22, 0], [-15, 22, 66], [L + 2, W, 0], [L + 2, -W, 0], [HX - 4, 0, BZ + 3 + L]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function taper(foot, top, inner, z0, z1) {
    return { sil: poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))), crease: open(ringAt(P, run(inner, front), z1)) };
  }
  // the cistern, then the bowl, then the seat ring
  put(solid(g), taper(rrect(-15, -20, 0, 20, 4, 6), rrect(-15, -21, 0, 21, 4, 6), rrect(-13.5, -19.5, -1.5, 19.5, 3, 6), BZ + 2, 64));
  put(solid(g), taper(rrect(-15, -20, 0, 20, 4, 6), rrect(-15.5, -21.5, 0.5, 21.5, 4.5, 6), rrect(-14, -20, -1, 20, 3.5, 6), 64, 66));
  put(solid(g), taper(rrect(6, -11, 36, 11, 10, 8), rrect(0, -W, L, W, 17, 10), rrect(2, -W + 2, L - 2, W - 2, 15, 10), 0, BZ));
  put(solid(g), taper(rrect(1, -W + 1, L - 1, W - 1, 16, 10), rrect(1, -W + 1, L - 1, W - 1, 16, 10), rrect(7, -W + 6, L - 7, W - 6, 11, 10), BZ, BZ + 2));
  const lid = solid(g);
  lid.sil.classList.add("hi");
  const lr = rrect(0, -W + 0.5, L - 1, W - 0.5, 16, 10), li = rrect(2, -W + 2.5, L - 3, W - 2.5, 14, 10);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const th = toR(a), c = Math.cos(th), s = Math.sin(th);
    const Tf = (u, v, w) => [HX + (u - HX) * c - w * s, v, BZ + 2.2 + (u - HX) * s + w * c];
    const lo = lr.map((q) => P(...Tf(q.u + HX, q.v, 0))), hi = lr.map((q) => P(...Tf(q.u + HX, q.v, 2.6)));
    const face = -s + 1.4 * c > 0;
    put(lid, { sil: poly(hull(lo.concat(hi))), crease: poly(li.map((q) => P(...Tf(q.u + HX, q.v, face ? 2.6 : 0)))) });
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(L / 2, 0, BZ);
  let on = false;
  function setOn(v) {
    on = v;
    tset(ang, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 140 && Math.abs(y - mid[1]) < 120; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "grabbar",
  means: "A toilet with its cistern, bowl and seat: over it, the lid swings up on its hinge towards the cistern.",
  rules: [1, 3, 5, 8],
  range: [45, 88, 94],
  tour: [[228, 178], [289, 182], [224, 215], null],
  mount,
});
