/* RECO Data-SalesHub — bản đồ vị trí dự án.
 *
 * Nền là ô ảnh OpenStreetMap đã tải sẵn vào assets/tiles (xem tools/fetch-tiles.mjs), nên
 * bản nhiều trang, bản mở bằng file:// và bản một tệp gửi link đều vẽ được mà không cần mạng —
 * bản một tệp chặn mọi yêu cầu ra máy chủ ngoài.
 *
 *   RECO.map.project(el, 'leparc', { publicOnly: false })
 *   RECO.map.overview(el)
 */
(function () {
  'use strict';

  var L = window.L;
  if (!L) return;

  var S = window.RECO.store;
  var GEO = window.RECO_GEO;

  /* Ô ảnh thiếu thì trả về một ô màu nền đất của OSM — thà liền mạch còn hơn hiện ảnh vỡ */
  var BLANK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E" +
    "%3Crect width='256' height='256' fill='%23f2efe9'/%3E%3C/svg%3E";

  var OSM = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
  var CALM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Vùng ô ảnh đã tải sẵn ----------
     Cùng phép tính với tools/fetch-tiles.mjs. Biết trước ô nào có thì Leaflet không hỏi ô
     nào không có: nó nạp đệm quanh khung nhìn, không chặn là sinh một loạt yêu cầu 404. */
  function xOf(lon, z) { return Math.floor(((lon + 180) / 360) * Math.pow(2, z)); }
  function yOf(lat, z) {
    var r = lat * Math.PI / 180;
    return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Math.pow(2, z));
  }
  function rangeOf(bounds, z) {
    return {
      x0: xOf(bounds[0][1], z), x1: xOf(bounds[1][1], z),
      y0: yOf(bounds[1][0], z), y1: yOf(bounds[0][0], z)
    };
  }
  function has(ranges, c) {
    var r = ranges[c.z];
    return !!r && c.x >= r.x0 && c.x <= r.x1 && c.y >= r.y0 && c.y <= r.y1;
  }

  /* ---------- Nguồn ô ảnh ----------
     Bản gói giữ mỗi ô đúng một lần trong window.RECO_TILES rồi tra lúc chạy, giống cách
     RECO.asset() làm với ảnh — nhúng data URI thẳng vào đánh dấu thì tệp phình gấp bội. */
  var TileLayer = L.TileLayer.extend({
    getTileUrl: function (c) {
      if (!has(this.options.recoRanges, c)) return BLANK;
      var key = c.z + '/' + c.x + '/' + c.y;
      if (window.RECO_TILES) return window.RECO_TILES[key] || BLANK;
      return 'assets/tiles/' + key + '.webp';
    }
  });

  function base(map, minZoom, maxZoom, ranges) {
    new TileLayer('', {
      minZoom: minZoom, maxZoom: maxZoom, tileSize: 256, recoRanges: ranges,
      errorTileUrl: BLANK, attribution: OSM + ' contributors'
    }).addTo(map);
  }

  /* ---------- Ký hiệu điểm ---------- */
  var GLYPH = {
    mall: '<path d="M6 8h12l-1 12H7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    school: '<path d="M3 9l9-4 9 4-9 4Z"/><path d="M7 11v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5"/>',
    transit: '<rect x="6" y="3" width="12" height="14" rx="2"/><path d="M6 11h12"/><path d="M9 21l1.5-4M15 21l-1.5-4"/>',
    health: '<path d="M12 5v14M5 12h14"/>',
    leisure: '<path d="M4 15c2-2 4-2 6 0s4 2 6 0 2-1 4 0"/><circle cx="12" cy="7" r="3"/>',
    home: '<path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/>',
    landmark: '<path d="M6 21V4l10 3-10 3"/>'
  };
  function glyph(cat) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (GLYPH[cat] || GLYPH.landmark) + '</svg>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  /* ---------- Khung tải sẵn ----------
     Mỗi mức phóng có vùng ô ảnh riêng, càng gần càng hẹp, nên khung được phép kéo phải đổi
     theo mức phóng — khoá cứng một khung thì phóng gần rồi kéo ra là thấy nền trống. */
  function boxOf(p, lv) {
    var dLat = lv.ry / 111320;
    var dLng = lv.rx / (111320 * Math.cos(p.lat * Math.PI / 180));
    return [[p.lat - dLat, p.lng - dLng], [p.lat + dLat, p.lng + dLng]];
  }
  function levelAt(p, z) {
    return p.levels.reduce(function (a, b) { return Math.abs(b.z - z) < Math.abs(a.z - z) ? b : a; });
  }
  function boundsAt(p, z) {
    var b = boxOf(p, levelAt(p, z));
    return L.latLngBounds(b[0], b[1]);
  }
  function rangesOf(p) {
    var out = {};
    p.levels.forEach(function (lv) { out[lv.z] = rangeOf(boxOf(p, lv), lv.z); });
    return out;
  }

  /* ---------- Không cướp cuộn trang ----------
     Bản đồ nằm giữa một trang rất dài và demo chạy cả trên khung điện thoại 390px: bật sẵn
     lăn chuột hay kéo một ngón là người xem bị kẹt không cuộn tiếp được. */
  function veil(el, map) {
    var v = L.DomUtil.create('div', 'rmap-veil', el);
    v.innerHTML = '<span>Bấm để xem bản đồ</span>';
    var on = false;
    function enable() {
      if (on) return;
      on = true;
      map.scrollWheelZoom.enable(); map.dragging.enable(); map.touchZoom.enable();
      el.classList.add('is-live');
    }
    v.addEventListener('click', enable);
    v.addEventListener('touchstart', function (e) { e.preventDefault(); enable(); }, { passive: false });
    el.addEventListener('mouseleave', function () { if (on) map.scrollWheelZoom.disable(); });
    el.addEventListener('mouseenter', function () { if (on) map.scrollWheelZoom.enable(); });
  }

  function mapIn(el, opts) {
    var map = L.map(el, Object.assign({
      zoomControl: true, attributionControl: true,
      scrollWheelZoom: false, dragging: false, touchZoom: false,
      doubleClickZoom: true, keyboard: false,
      fadeAnimation: !CALM, zoomAnimation: !CALM, markerZoomAnimation: !CALM
    }, opts));
    /* Thẻ chứa dùng aspect-ratio nên có lúc Leaflet đo trước khi bố cục xong */
    requestAnimationFrame(function () { map.invalidateSize(); });
    return map;
  }

  /* ---------- Nút mở bản đồ ngoài ----------
     Chỉ là liên kết điều hướng, không phải yêu cầu tài nguyên, nên bản một tệp vẫn dùng được. */
  function outLink(map, lat, lng, label) {
    var c = L.control({ position: 'bottomleft' });
    c.onAdd = function () {
      var d = L.DomUtil.create('div', 'rmap-out leaflet-bar');
      d.innerHTML = '<a href="https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng +
        '" target="_blank" rel="noopener">' + esc(label) + '</a>';
      L.DomEvent.disableClickPropagation(d);
      return d;
    };
    c.addTo(map);
  }

  /* ---------- Điểm liên kết vùng của một dự án ----------
     Toạ độ nằm ở geo.js, mô tả và nhãn quyền nằm ở store — khớp nhau theo id bản ghi.
     Điểm quá xa khung đã tải (sân bay, phố cổ) chỉ hiện trong danh sách, không ghim. */
  function pois(pj, publicOnly) {
    return S.get('sections').filter(function (s) {
      return s.pj === pj && s.kind === 'place';
    }).map(function (s) {
      var g = GEO.pois[s.id];
      if (!g || g.far) return null;
      var seen = publicOnly ? s.label === 'public' : S.canSee(s.label, window.RECO.role);
      if (!seen) return null;
      return { id: s.id, title: s.title, body: s.body, lat: g.lat, lng: g.lng, cat: g.cat };
    }).filter(Boolean);
  }

  /* ---------- Bản đồ một dự án ---------- */
  function project(el, pjId, opts) {
    opts = opts || {};
    var g = GEO.projects[pjId];
    var p = S.find('projects', pjId);
    if (!el || !g) return null;
    if (el._map) { el._map.remove(); el.innerHTML = ''; el.classList.remove('is-live'); }

    var zs = g.levels.map(function (l) { return l.z; });
    var minZ = Math.min.apply(null, zs), maxZ = Math.max.apply(null, zs);
    var name = (p && p.name) || 'Dự án';

    el.classList.add('rmap');
    el.setAttribute('aria-label', 'Bản đồ vị trí ' + name + (p ? ' tại ' + p.place : ''));

    var z0 = Math.min(Math.max(g.zoom, minZ), maxZ);
    var map = mapIn(el, {
      center: [g.lat, g.lng], zoom: z0,
      minZoom: minZ, maxZoom: maxZ,
      /* Dự án chỉ nướng sẵn một mức thì bỏ nút phóng và khoá phóng bằng cử chỉ —
         để nút đó nằm im không bấm được thì trông như hỏng. */
      zoomControl: minZ !== maxZ, doubleClickZoom: minZ !== maxZ,
      maxBounds: boundsAt(g, z0), maxBoundsViscosity: 1
    });
    map.on('zoomend', function () { map.setMaxBounds(boundsAt(g, map.getZoom())); });
    base(map, minZ, maxZ, rangesOf(g));

    /* Ghim dự án — pin cam lớn kèm nhãn tên, khác hẳn các điểm quanh vùng */
    L.marker([g.lat, g.lng], {
      zIndexOffset: 1000, keyboard: false,
      icon: L.divIcon({
        className: 'rmap-self', iconSize: null,
        html: '<i></i><b>' + esc(name) + '</b>'
      })
    }).addTo(map);

    var marks = {};
    pois(pjId, opts.publicOnly).forEach(function (x) {
      var m = L.marker([x.lat, x.lng], {
        keyboard: false,
        icon: L.divIcon({
          className: 'rmap-poi rmap-poi-' + x.cat, iconSize: [26, 26], iconAnchor: [13, 13],
          html: glyph(x.cat)
        })
      }).addTo(map);
      m.bindTooltip('<b>' + esc(x.title) + '</b><br>' + esc(x.body), { direction: 'top', offset: [0, -12] });
      marks[x.id] = m;
      /* Bấm ghim thì cuộn tới đúng ô trong danh sách liên kết vùng — hai bên nói cùng một chuyện */
      m.on('click', function () {
        var cell = document.querySelector('[data-poi="' + x.id + '"]');
        if (!cell) return;
        cell.scrollIntoView({ block: 'center', behavior: CALM ? 'auto' : 'smooth' });
        cell.classList.add('is-hi');
        setTimeout(function () { cell.classList.remove('is-hi'); }, 1600);
      });
    });

    /* Trỏ vào một ô trong danh sách thì ghim tương ứng nhảy lên và mở nhãn */
    document.querySelectorAll('[data-poi]').forEach(function (cell) {
      var m = marks[cell.getAttribute('data-poi')];
      if (!m) return;
      function on() { L.DomUtil.addClass(m.getElement(), 'is-hi'); m.openTooltip(); }
      function off() { L.DomUtil.removeClass(m.getElement(), 'is-hi'); m.closeTooltip(); }
      cell.addEventListener('mouseenter', on);
      cell.addEventListener('mouseleave', off);
      cell.addEventListener('focusin', on);
      cell.addEventListener('focusout', off);
    });

    outLink(map, g.lat, g.lng, 'Mở trên Google Maps');
    veil(el, map);
    el._map = map;
    return map;
  }

  /* ---------- Bản đồ tổng quan giao dịch theo khu vực (xem trước Giai đoạn 2) ---------- */
  function overview(el) {
    var ov = GEO.overview;
    if (!el || !ov) return null;
    if (el._map) { el._map.remove(); el.innerHTML = ''; }

    var zs = ov.levels.map(function (l) { return l.z; });
    var minZ = Math.min.apply(null, zs), maxZ = Math.max.apply(null, zs);

    el.classList.add('rmap', 'rmap-ov');
    el.setAttribute('aria-label', 'Bản đồ giao dịch theo khu vực địa lý');

    var map = mapIn(el, {
      center: ov.center, zoom: ov.zoom, minZoom: minZ, maxZoom: maxZ,
      maxBounds: L.latLngBounds(ov.bounds[0], ov.bounds[1]), maxBoundsViscosity: 1
    });
    /* Canh khung theo chính các khu vực có số liệu, không theo tâm viết cứng: khung cao thấp
       khác nhau giữa điện thoại và máy tính, viết cứng là bong bóng Hà Nội bị cắt mất. */
    map.fitBounds(L.latLngBounds(ov.regions.map(function (r) { return [r.lat, r.lng]; })).pad(0.25));
    var ranges = {};
    ov.levels.forEach(function (lv) { ranges[lv.z] = rangeOf(ov.bounds, lv.z); });
    base(map, minZ, maxZ, ranges);

    var top = ov.regions.reduce(function (a, r) { return Math.max(a, r.revenue); }, 0);
    ov.regions.forEach(function (r) {
      /* Diện tích bong bóng tỉ lệ với doanh thu — bán kính theo căn bậc hai, không theo giá trị */
      var d = Math.round(20 + 26 * Math.sqrt(r.revenue / top));
      L.marker([r.lat, r.lng], {
        keyboard: false,
        icon: L.divIcon({
          className: 'rmap-bub rmap-bub-' + (r.side || 'bottom'), iconSize: [d, d], iconAnchor: [d / 2, d / 2],
          html: '<i style="width:' + d + 'px;height:' + d + 'px"><span>' + r.deals + '</span></i>' +
            '<b>' + esc(r.name) + '</b>'
        })
      }).addTo(map).bindTooltip(
        '<b>' + esc(r.name) + '</b><br>' + r.deals + ' giao dịch · doanh thu ' +
        String(r.revenue).replace('.', ',') + ' tỷ',
        { direction: 'top', offset: [0, -d / 2] }
      );
    });

    veil(el, map);
    el._map = map;
    return map;
  }

  window.RECO.map = { project: project, overview: overview };
})();
