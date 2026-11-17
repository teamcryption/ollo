/**
 * Quill knife: a folding pen knife lying on its side, a slim rounded handle
 * with a pivot pin at one end and the blade swung part open. The pointer
 * swings the blade about its pin, toward wherever it stands, open past the
 * handle's end or folded back over it. At rest the blade is half open, bright.
 * The slider is how far the blade may open.
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rings, rad, clamp, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HL_ = 92, HW = 18, HZ = 10, PX = 84, PY = 9, BZ = 1.6, REST = 72;
const BLADE = fillet([[-7, -7], [58, -7], [84, -1], [64, 6], [12, 8], [-7, 7]], [5, 4, 1.5, 6, 6, 5], 3);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxOpen = value;
  const C = Cam(45, 0.5, 2.65);
  const ext = [[-2, -2, 0], [HL_ + 2, HW + 2, 0], [-2, HW + 2, 0], [HL_ + 2, -2, 0]]; for (let a = 0; a <= 180; a += 15) ext.push([PX + 85 * Math.cos(rad(a)), PY + 85 * Math.sin(rad(a)), HZ]);
  fit(C, ext, 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [hr, hi] = rings(0, 0, HL_, HW, 9, 1.8);
  put(solid(g), prism(P, front, hr, hi, 0, HZ));
  // liner groove along the handle top and the two pins
  mk("path", { d: open([P(10, HW / 2, HZ), P(PX - 10, HW / 2, HZ)]), class: "nf lo" }, g);
  const pin = (x) => { const r = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; r.push(P(x + 2.4 * Math.cos(a), PY + 2.4 * Math.sin(a), HZ)); } return r; };
  mk("path", { d: poly(pin(8)), class: "nf lo" }, g);
  const bl = solid(g);
  bl.sil.classList.add("hi");
  const nick = mk("path", { class: "nf lo" }, g);
  mk("path", { d: poly(pin(PX)), class: "nf" }, g);

  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const w = ([u, v]) => [PX + u * c - v * s, PY + u * s + v * c];
    const top = BLADE.map((q) => { const [x, y] = w(q); return P(x, y, HZ + BZ); });
    const bot = BLADE.map((q) => { const [x, y] = w(q); return P(x, y, HZ); });
    put(bl, { sil: poly(hull(top.concat(bot))), crease: open(top.concat([top[0]])) });
    const n = []; for (let i = 0; i <= 6; i++) { const t = Math.PI * (i / 6); const [x, y] = w([44 + 4 * Math.cos(t), -3 + 2.5 * Math.sin(t)]); n.push(P(x, y, HZ + BZ)); }
    nick.setAttribute("d", open(n));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [gx, gy] = unproj(C, sx, sy, 0);
    const dx = gx - PX, dy = gy - PY;
    if (Math.hypot(dx, dy) > 150 || Math.hypot(dx, dy) < 4) return leave();
    let th = Math.atan2(dy, dx) * 180 / Math.PI;
    if (th < 0) th = th > -90 ? 0 : 180;
    const lo = 180 - maxOpen;
    ang.t = clamp(th, lo, 180);
    const open_ = Math.round(180 - ang.t);
    read.textContent = open_ < 8 ? "shut" : "open " + open_ + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxOpen = v; }, destroy: bag.dispose };
}

hairline({
  name: "quillknife",
  means: "A folding pen knife on its side: the blade swings about its pin toward the pointer, open past the handle or folded back over it.",
  rules: [1, 3, 5, 8],
  range: [90, 150, 180],
  tour: [[355, 241], [261, 288], [36, 232], null],
  mount,
});
