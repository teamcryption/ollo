/**
 * Leadline: a sounding lead, a tapered lead weight with a hollow arming in
 * its foot, hung on a marked line from a rail. The pointer swings the lead
 * across toward it like a pendulum. At rest the lead is caught mid-swing to
 * the left, bright. The slider is how far it may swing.
 */
const { Cam, clamp, fit, hull, open, poly, prism, proj, facing, rings, rad, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const ZP = 150, L1 = 92, L2 = 128, R1 = 5, R2 = 9, REST = -22, UX = Math.SQRT1_2, UY = -Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  const sw = (th, l) => [UX * Math.sin(rad(th)) * l, UY * Math.sin(rad(th)) * l, ZP - Math.cos(rad(th)) * l];
  fit(C, [sw(-45, L2 + 9), sw(45, L2 + 9), [0, 0, ZP + 8], [-8, -26, ZP], [8, 26, ZP]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const rail = solid(g), [rr, ri] = rings(-5, -30, 5, 30, 4, 1.2);
  put(rail, prism(P, front, rr, ri, ZP, ZP + 7));
  const line = mk("path", { class: "nf" }, g);
  const lead = solid(g);
  lead.sil.classList.add("hi");
  const arm = mk("path", { class: "nf lo" }, lead.g);

  function ring(th, l, r) {
    const c = sw(th, l), t = rad(th), o = [];
    const e2 = [UX * Math.cos(t), UY * Math.cos(t), Math.sin(t)];
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2, ca = Math.cos(a) * r * Math.SQRT1_2, sa = Math.sin(a) * r;
      o.push(P(c[0] + ca + e2[0] * sa, c[1] + ca + e2[1] * sa, c[2] + e2[2] * sa));
    }
    return o;
  }
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    let d = seg(P(0, 0, ZP), P(...sw(th, L1 - 3)));
    for (const m of [26, 44, 62]) {
      const t = rad(th), c = sw(th, m);
      d += seg(P(c[0] - 2.5 * UX * Math.cos(t), c[1] - 2.5 * UY * Math.cos(t), c[2] - 2.5 * Math.sin(t)), P(c[0] + 2.5 * UX * Math.cos(t), c[1] + 2.5 * UY * Math.cos(t), c[2] + 2.5 * Math.sin(t)));
    }
    line.setAttribute("d", d);
    const eye = ring(th, L1 - 2, 2.2), top = ring(th, L1, R1), bot = ring(th, L2, R2);
    lead.sil.setAttribute("d", poly(hull(top.concat(bot, eye))));
    lead.cr.setAttribute("d", open(ring(th, L1 + 3, R1 + 0.6).slice(4, 18)));
    arm.setAttribute("d", poly(ring(th, L2, R2 - 3.5)));
    read.textContent = (th >= 0 ? "+" : "") + Math.round(th) + "°";
  }
  const sp = spring(REST);
  let resting = true;
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); if (!m && resting) read.textContent = "rest"; return m; });
  bag.add(B.unregister);
  function aim(p) {
    resting = !p;
    sp.t = p ? clamp((p[0] - 200) / 80, -1, 1) * reach : REST;
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "leadline",
  means: "A sounding lead on its marked line: the lead swings across toward the pointer like a pendulum.",
  rules: [1, 3, 5, 8],
  range: [15, 35, 45],
  tour: [[353, 241], [47, 241], [260, 230], null],
  mount,
});
