/**
 * Car jack: a scissor jack on its base plate, two pairs of arms meeting at a
 * screw rod, a saddle on top. The pointer's height sets how far the jack is
 * wound up: the arms close in and the saddle rises. At rest it stands half
 * raised, its saddle bright. The slider is the reach.
 *
 * The pattern: one part following the pointer along an axis.
 */
const { Cam, fit, facing, prism, proj, rings, clamp, lerp, poly, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 34, CX = 40, REST = 36, LO = 22, HI = 62;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-4, -4, 0], [84, 24, 0], [84, -4, 0], [-4, 24, 0], [30, 0, HI + 6], [50, 20, HI + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 2, b = 1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, a, i, z0, z1)); return s; };
  const g = mk("g", {}, svg);
  box(g, -4, -4, 84, 24, 0, 4, 3, 1.4);
  const mov = mk("g", {}, g);
  const arm = (par, a, b, y) => {
    const dx = b[0] - a[0], dz = b[1] - a[1], n = Math.hypot(dx, dz), ox = (-dz / n) * 2.2, oz = (dx / n) * 2.2;
    mk("path", { d: poly([P(a[0] + ox, y, a[1] + oz), P(b[0] + ox, y, b[1] + oz), P(b[0] - ox, y, b[1] - oz), P(a[0] - ox, y, a[1] - oz)]) }, par);
  };
  const sp = spring(REST);
  let last = NaN;
  function draw(H) {
    if (H === last) return;
    last = H;
    mov.replaceChildren();
    const zm = (4 + H) / 2, w = Math.sqrt(L * L - ((H - 4) / 2) ** 2);
    const bot = [CX, 6], top = [CX, H - 2], lp = [CX - w, zm], rp = [CX + w, zm];
    box(mov, CX - 10, 2, CX + 10, 18, 4, 8, 2, 0.8);
    for (const y of [3, 5]) { arm(mov, bot, lp, y); arm(mov, lp, top, y); arm(mov, bot, rp, y); arm(mov, rp, top, y); }
    mk("path", { d: seg(P(CX - w - 4, 10, zm), P(CX + w + 12, 10, zm)), class: "nf" }, mov);
    mk("path", { d: poly([P(CX + w + 12, 10, zm - 3), P(CX + w + 12, 10, zm + 3), P(CX + w + 16, 10, zm + 3), P(CX + w + 16, 10, zm - 3)]), class: "nf" }, mov);
    for (const y of [15, 17]) { arm(mov, bot, lp, y); arm(mov, lp, top, y); arm(mov, bot, rp, y); arm(mov, rp, top, y); }
    const sad = box(mov, CX - 11, 0, CX + 11, 20, H - 4, H + 2, 2, 1);
    sad.sil.classList.add("hi");
    box(mov, CX - 4, 6, CX + 4, 14, H + 2, H + 4, 1, 0.5);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const top = LO + (HI - LO) * (0.3 + 0.7 * reach / 100);
    sp.t = clamp(lerp(top, LO, (p[1] - 70) / 180), LO, top);
    read.textContent = "lift " + Math.round(sp.t - LO);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "carjack",
  means: "A scissor jack on its base plate: the higher the pointer, the further it winds up, arms closing in and the saddle rising.",
  rules: [3, 5, 8, 9],
  range: [0, 50, 100],
  tour: [[200, 100], [200, 180], [200, 240], null],
  mount,
});
