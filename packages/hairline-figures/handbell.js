/**
 * Handbell: a brass hand bell hanging from its wooden handle. The pointer's
 * place across the stage swings the bell about the top of its handle, so the
 * mouth tips toward or away from you. At rest it hangs with a slight lean and
 * its silhouette is bright. The slider is the swing's reach.
 */
const { Cam, circ, fit, hull, poly, proj, spring, stepS, clamp, mk, pointer, register, disposer } = HL;

const PZ = 100, REST = 0.22;
const BELL = [[9, 66], [12, 62], [15, 54], [18, 44], [22, 36], [28, 30]];
const HANDLE = [[4, 96], [4, 72], [6, 69], [7, 100]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-60, -30, 40], [60, 30, 40], [0, 0, PZ + 2], [0, 0, 20]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const bell = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g), handle = mk("path", { class: "sil" }, g), knob = mk("path", {}, g);
  const c24 = circ(1, 28);
  const A = spring(REST);
  let last = NaN;
  function rot(th, x, y, z) {
    const c = Math.cos(th), s = Math.sin(th), dz = z - PZ;
    return P(x * c - dz * s, y, PZ + x * s + dz * c);
  }
  const ringPts = (th, r, z) => c24.map((q) => rot(th, q.u * r, q.v * r, z));
  function draw(th) {
    if (th === last) return;
    last = th;
    bell.setAttribute("d", poly(hull(BELL.flatMap(([r, z]) => ringPts(th, r, z)))));
    lip.setAttribute("d", th < -0.4 ? poly(ringPts(th, 25, 33)) : "");
    handle.setAttribute("d", poly(hull([[4.5, 70], [5.5, 90]].flatMap(([r, z]) => ringPts(th, r, z)))));
    knob.setAttribute("d", poly(hull([[3, 89], [6.5, 92], [6.5, 97], [3, 100]].flatMap(([r, z]) => ringPts(th, r, z)))));
  }
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(A.x); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx]) => { A.t = clamp((sx - 200) / 90, -1, 1) * 0.75 * reach; read.textContent = "swing " + Math.round((A.t * 180) / Math.PI) + "°"; B.wake(); },
    leave: () => { A.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "handbell",
  means: "A hand bell hanging from its handle: the pointer swings it about the handle's top, tipping the mouth toward or away from you.",
  rules: [3, 5, 8],
  range: [0, 100, 100],
  tour: [[200, 191], [109, 121], [300, 170], null],
  mount,
});
