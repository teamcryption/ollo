/**
 * Suction lifter: a glazier's twin-cup lifter gripping a pane that rests on
 * two setting blocks. The pointer lifts it: the higher the pointer stands
 * over the pane, the higher the lifter raises the glass off the blocks. At
 * rest the handle is bright. The slider is how high it may lift.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const BK = 7, GL = 3, LIFT = 46, REST = 0.06;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-52, -36, 0], [52, 36, 0], [-30, 0, BK + GL + LIFT + 26], [30, 0, BK + GL + LIFT + 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const x of [-34, 30]) { const [r, i] = rings(x, -12, x + 8, 12, 2, 1); put(solid(g), prism(P, front, r, i, 0, BK)); }
  const [pr, pi] = rings(-50, -34, 50, 34, 3, 2);
  const pane = solid(g);
  const cups = [solid(g), solid(g)];
  const stems = [mk("path", { class: "sil" }, g), mk("path", { class: "sil" }, g)];
  const bar = mk("path", { class: "sil" }, g), grip = mk("path", { class: "sil" }, g);
  const rod = (a, b, r) => poly(hull(ringAt(P, disc(a[0], a[1], r, 12), a[2]).concat(ringAt(P, disc(b[0], b[1], r, 12), b[2]))));

  const lift = spring(REST);
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const z = BK + l * LIFT, t = z + GL;
    put(pane, prism(P, front, pr, pi, z, t));
    [-18, 18].forEach((x, i) => {
      const sil = poly(hull(ringAt(P, disc(x, 0, 12), t).concat(ringAt(P, disc(x, 0, 7), t + 5))));
      const cr = poly(ringAt(P, disc(x, 0, 6), t + 5));
      cups[i].sil.setAttribute("d", sil);
      cups[i].cr.setAttribute("d", cr);
      stems[i].setAttribute("d", rod([x, 0, t + 5], [x, 0, t + 17], 3));
    });
    bar.setAttribute("d", rod([-22, 0, t + 19], [22, 0, t + 19], 3.4));
    grip.setAttribute("d", rod([-12, 0, t + 22], [12, 0, t + 22], 4.4));
  }
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  const cx = P(0, 0, 0)[0], cy = P(0, 0, BK)[1];
  let on = null;
  function aim(p) {
    const inside = p && Math.abs(p[0] - cx) < 140 && p[1] > cy - 170 && p[1] < cy + 90;
    const l = inside ? clamp((cy + 60 - p[1]) / 170, 0.2, 1) * reach : REST;
    lift.t = l;
    const act = !!inside;
    if (act !== on) {
      on = act;
      grip.classList.toggle("hi", !act);
      bar.classList.toggle("hi", !act);
      pane.sil.classList.toggle("hi", act);
    }
    read.textContent = act ? Math.round(l * LIFT) + "cm" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "suctionlifter",
  means: "A twin-cup suction lifter gripping a pane on two blocks: the higher the pointer, the higher it lifts the glass.",
  rules: [1, 3, 4, 5],
  range: [40, 100, 100],
  tour: [[200, 145], [200, 90], [210, 228], null],
  mount,
});
