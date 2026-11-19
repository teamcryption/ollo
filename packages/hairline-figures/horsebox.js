/**
 * Horse box: a tall two-wheeled trailer on an A-frame towbar, its rear
 * ramp door hinged at the floor. The pointer's place across the frame lowers
 * the ramp from the doorway down towards the road. At rest it is cracked
 * open a little, bright. The slider is how far it lowers.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, clamp, facing, fit, hull, open, poly, proj, rad, ringAt, rrect, run, seg, spring, stepS, disposer, flatDot, mk, place, pointer, register, solid } = HL;

const L = 100, W = 50, Z0 = 14, H = 82, RL = 64, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-34, W / 2, 0], [L + RL + 2, 0, 0], [L + RL + 2, W, 0], [0, 0, H], [L, W, 0], [0, W, H], [L, 0, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => { const o = []; for (let i = 0; i < 22; i++) { const t = (i / 22) * Math.PI * 2; o.push(P(x + 12 * Math.cos(t), y, 12 + 12 * Math.sin(t))); } return o; };
  mk("path", { d: poly(wheel(52, 2)) }, g);
  mk("path", { d: seg(P(0, 8, Z0 + 4), P(-32, W / 2, Z0 + 2)) + seg(P(0, W - 8, Z0 + 4), P(-32, W / 2, Z0 + 2)), class: "nf lo" }, g);
  const hitch = flatDot(g, C, 2.2, "dot off");
  place(hitch, P(-32, W / 2, Z0 + 2));
  const foot = rrect(0, 0, L, W, 6, 6), top = rrect(4, 4, L - 4, W - 4, 10, 6), inner = rrect(7, 7, L - 7, W - 7, 8, 6);
  const box = solid(g);
  box.sil.setAttribute("d", poly(hull(ringAt(P, foot, Z0).concat(ringAt(P, foot, H - 12), ringAt(P, top, H)))));
  box.cr.setAttribute("d", open(ringAt(P, run(inner, front), H)));
  mk("path", { d: poly([P(14, W, H - 30), P(40, W, H - 30), P(40, W, H - 20), P(14, W, H - 20)]), class: "nf lo" }, g);
  mk("path", { d: poly([P(L, 6, Z0 + 2), P(L, W - 6, Z0 + 2), P(L, W - 6, Z0 + RL - 2), P(L, 6, Z0 + RL - 2)]), class: "nf lo" }, g);
  mk("path", { d: poly(wheel(52, W + 2)) }, g);
  const ramp = mk("path", { class: "sil hi" }, g), slats = mk("path", { class: "nf lo" }, g);

  const ang = spring(REST);
  let last = NaN;
  const rp = (y, l, n, a) => P(L + l * Math.sin(rad(a)) + n * Math.cos(rad(a)), y, Z0 + l * Math.cos(rad(a)) - n * Math.sin(rad(a)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [3, W - 3]) for (const l of [0, RL]) for (const n of [0, 3]) pts.push(rp(y, l, n, a));
    ramp.setAttribute("d", poly(hull(pts)));
    let d = "";
    for (let k = 1; k < 6; k++) d += seg(rp(8, (k * RL) / 6, 3, a), rp(W - 8, (k * RL) / 6, 3, a));
    slats.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 130) / 150, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "horsebox",
  means: "A horse box trailer: the pointer lowers its rear ramp door from the doorway down towards the road on a floor hinge.",
  rules: [1, 3, 5, 6],
  range: [55, 80, 102],
  tour: [[230, 128], [290, 160], [170, 130], null],
  mount,
});
