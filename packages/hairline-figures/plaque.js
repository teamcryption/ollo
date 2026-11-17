/**
 * Plaque stand: a tall award plaque standing in a slot on a weighted base.
 * The plaque turns on its base to face the pointer, following it as it
 * moves across. At rest it stands turned a little, bright. The slider is
 * how far it can turn.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BW = 100, BD = 46, BH = 14, PW = 74, PH = 96, PT = 3.5;
const CX = BW / 2, CY = BD / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [BW, BD, 0], [BW, 0, 0], [0, BD, 0], [CX - 40, CY, BH + PH], [CX + 40, CY, BH + PH], [CX, CY - 40, BH + PH], [CX, CY + 40, BH + PH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BW, BD, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  const [sr] = rings(CX - PW / 2 - 4, CY - 5, CX + PW / 2 + 4, CY + 5, 3, 1);
  const slot = mk("path", { class: "nf lo" }, g);
  slot.setAttribute("d", poly(sr.map((q) => P(q.u, q.v, BH))));
  const pg = mk("g", {}, g);
  const sil = mk("path", { class: "sil" }, pg), face = mk("path", { class: "nf lo" }, pg), boss = mk("path", { class: "nf" }, pg), plate = mk("path", { class: "nf lo" }, pg);

  const outer = rrect(-PW / 2, 0, PW / 2, PH, 10, 4), inner = rrect(-PW / 2 + 6, 6, PW / 2 - 6, PH - 6, 6, 4);
  const medal = rrect(-13, PH - 48, 13, PH - 22, 13, 6), bar = rrect(-20, 14, 20, 26, 3, 3);
  const at = (q, yaw, t) => { const c = Math.cos(yaw), s = Math.sin(yaw); return P(CX + q.u * c - t * s, CY + q.u * s + t * c, BH + q.v); };
  const area = (p) => { let s = 0; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
  const s0 = Math.sign(area(inner.map((q) => at(q, 0, PT))));
  const REST = 18;
  const sp = spring(REST);
  let last = NaN;

  function draw(deg) {
    const d = Math.round(deg * 20) / 20;
    if (d === last) return;
    last = d;
    const yaw = (d * Math.PI) / 180;
    sil.setAttribute("d", poly(hull(outer.map((q) => at(q, yaw, -PT)).concat(outer.map((q) => at(q, yaw, PT))))));
    const ft = Math.sign(area(inner.map((q) => at(q, yaw, PT)))) === s0 ? PT : -PT;
    face.setAttribute("d", poly(inner.map((q) => at(q, yaw, ft))));
    const ft2 = ft + Math.sign(ft) * 1.6;
    boss.setAttribute("d", poly(hull(medal.map((q) => at(q, yaw, ft)).concat(medal.map((q) => at(q, yaw, ft2))))));
    plate.setAttribute("d", poly(bar.map((q) => at(q, yaw, ft))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const mid = P(CX, CY, BH + PH / 2);
  let act = null;
  function aim(p) {
    const on = !!p && Math.abs(p[0] - mid[0]) < 150 && Math.abs(p[1] - mid[1]) < 130;
    sp.t = on ? clamp(((p[0] - mid[0]) / 110) * reach, -reach, reach) : REST;
    if (on !== act) { act = on; sil.classList.toggle("hi", !on); boss.classList.toggle("hi", on); }
    read.textContent = on ? Math.round(sp.t) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "plaque",
  means: "An award plaque standing in a weighted base: it turns in its slot to face the pointer as the pointer moves across.",
  rules: [1, 3, 5, 8],
  range: [20, 50, 70],
  tour: [[151, 123], [255, 130], [200, 150], null],
  mount,
});
