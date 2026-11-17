/**
 * Rural mailbox: a round-topped box on a post, a door at its front and a flag
 * on its side. The pointer over the figure drops the door open and raises the
 * flag. At rest the flag lies down, bright. The slider is how far they go.
 */
const { Cam, fit, hull, poly, proj, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const L = 46, HW = 11, ZB = 50, HZ = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[14, -6, 0], [30, 8, 0], [0, -HW, ZB + HZ + HW], [L + 26, 0, ZB - 4], [L, HW, ZB], [12, HW + 2, ZB + 40]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const face = (pts, cls = "") => mk("path", { d: poly(pts.map((p) => P(...p))), class: cls }, g);
  // the post
  face([[26, -3, 0], [26, 3, 0], [26, 3, ZB], [26, -3, ZB]]);
  face([[20, 3, 0], [26, 3, 0], [26, 3, ZB], [20, 3, ZB]]);
  // the cross-section: straight sides, a round top
  const sec = [[-HW, 0], [HW, 0], [HW, HZ]];
  for (let i = 1; i < 12; i++) { const a = (i / 12) * Math.PI; sec.push([HW * Math.cos(a), HZ + HW * Math.sin(a)]); }
  sec.push([-HW, HZ]);
  const body = [];
  for (const x of [0, L]) for (const [y, z] of sec) body.push(P(x, y, ZB + z));
  mk("path", { d: poly(hull(body)), class: "" }, g);
  const mouth = mk("path", { class: "nf lo" }, g);
  mouth.setAttribute("d", poly(sec.map(([y, z]) => P(L, y * 0.82, ZB + 1.5 + z * 0.86))));
  const door = mk("path", { class: "" }, g), flag = mk("path", { class: "sil" }, g);
  const s = spring(0, { k: 100, c: 18 });
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const a = o * 1.6, ca = Math.cos(a), sa = Math.sin(a);
    const dp = sec.map(([y, z]) => P(L + 1 + z * sa, y, ZB + z * ca));
    const dq = sec.map(([y, z]) => P(L + 1 + z * sa + 1.5 * ca, y, ZB + z * ca - 1.5 * sa));
    door.setAttribute("d", poly(hull(dp.concat(dq))) + poly(dp));
    const b = 0.15 + o * 1.35, cb = Math.cos(b), sb = Math.sin(b), pv = [8, ZB + 9], Y = HW + 1.5;
    const at = (t, w) => P(pv[0] + t * cb - w * sb, Y, pv[1] + t * sb + w * cb);
    flag.setAttribute("d", poly([at(-2, -1.5), at(26, -1.5), at(26, 8), at(17, 8), at(17, 1.5), at(-2, 1.5)]));
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    s.t = v ? clamp(amt, 0.3, 1) : 0;
    read.textContent = v ? "mail" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: () => setOn(true), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { s.t = clamp(amt, 0.3, 1); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "mailbox",
  means: "A rural mailbox on a post: the pointer drops its front door open and raises the flag on its side.",
  rules: [1, 3, 5, 6],
  range: [30, 100, 100],
  tour: [[175, 86], [175, 150], [215, 115], null],
  mount,
});
