/* RECO Data-SalesHub — vẽ thẻ và hàng dự án.
   Dữ liệu lấy từ assets/store.js để bấm Ghim hay Ẩn dự án ở màn này thì màn kia đổi theo. */
(function () {
  'use strict';

  var S = window.RECO.store;

  /* Dự án đang hiển thị — bỏ dự án đã bị người quản trị ẩn */
  function projects() {
    return S.get('projects').filter(function (p) { return !p.hidden; });
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function st(p) {
    var cls = p.status === 'live' ? 'st-live' : p.status === 'soon' ? 'st-wait' : 'st-off';
    return '<span class="st ' + cls + '">' + esc(p.statusText || 'Đang bán') + '</span>';
  }
  function channelChip(p) {
    var ch = (S.channelOf ? S.channelOf(p) : (p && p.channel)) || 'moi';
    if (ch !== 'cn') return '';
    return '<span class="chip chip-cn">' + esc((p && p.channelText) || 'Chuyển nhượng') + '</span>';
  }
  function verifyChip(p) {
    return p.verify ? '<span class="chip">Cần xác nhận lại</span>' : '';
  }
  function pinBtn(p) {
    return '<button type="button" class="pin-btn" data-pj="' + p.id + '" aria-pressed="' + (p.pinned ? 'true' : 'false') +
      '" aria-label="' + (p.pinned ? 'Bỏ ghim ' : 'Ghim ') + esc(p.name) + '">' + RECO.svg('pin') + '</button>';
  }
  /* Màn chi tiết mở đúng dự án được bấm — trước đây mọi thẻ đều về một dự án cố định */
  function href(p) { return 'du-an-chi-tiet.html?pj=' + p.id; }

  function card(p) {
    return '' +
      '<a class="pcard" href="' + href(p) + '">' +
        '<div class="pcard-media">' +
          '<img src="' + RECO.asset(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' +
          (p.featured ? '<span class="top-left hot">Dự án nổi bật</span>' : '') +
          '<span class="top-right">' + pinBtn(p) + '</span>' +
          '<span class="on-media"><h3>' + esc(p.name) + '</h3><span class="place">' + esc(p.place) + '</span></span>' +
        '</div>' +
        '<div class="pcard-body">' +
          '<div class="row-tight">' + st(p) + channelChip(p) + verifyChip(p) + '<span class="chip">' + esc(p.typeName) + '</span></div>' +
          '<div class="pcard-facts">' +
            '<div><div class="k">Khoảng giá</div><div class="v">' + p.priceText + '</div></div>' +
            '<div><div class="k">Diện tích</div><div class="v">' + p.sizeText + '</div></div>' +
          '</div>' +
          '<div class="pcard-foot">' +
            '<span class="micro muted">' + p.docs + ' tài liệu · cập nhật ' + esc(p.updated) + '</span>' +
          '</div>' +
        '</div>' +
      '</a>';
  }

  function row(p) {
    return '' +
      '<a class="prow" href="' + href(p) + '">' +
        '<img src="' + RECO.asset(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' +
        '<div>' +
          '<div class="row-tight mb-1">' + st(p) + channelChip(p) + verifyChip(p) + (p.featured ? '<span class="hot">Nổi bật</span>' : '') + '</div>' +
          '<h3 style="font-size:1.02rem">' + esc(p.name) + '</h3>' +
          '<div class="small muted">' + esc(p.place) + ' · ' + esc(p.typeName) + '</div>' +
          '<div class="row-tight mt-1"><span class="chip">' + p.priceText + '</span><span class="chip">' + p.sizeText + '</span>' +
            '<span class="chip">' + p.docs + ' tài liệu</span></div>' +
        '</div>' +
        '<div class="only-lg" style="text-align:right">' + pinBtn(p) +
          '<div class="micro muted mt-1">' + esc(p.updated) + '</div></div>' +
      '</a>';
  }

  /* Ghim ghi thẳng vào kho, nên Trang đầu và Danh sách dự án luôn khớp nhau.
     Toast kèm nút Hoàn tác vì bỏ ghim nhầm là chuyện hay xảy ra khi bấm trên điện thoại. */
  function bindPins(root) {
    (root || document).querySelectorAll('.pin-btn[data-pj]').forEach(function (b) {
      if (b.dataset.bound) return;
      b.dataset.bound = '1';
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var id = b.getAttribute('data-pj');
        var p = S.find('projects', id);
        if (!p) return;
        var on = !p.pinned;
        S.update('projects', id, { pinned: on });
        RECO.toast(on ? 'Đã ghim ' + p.name + ' vào Trang đầu' : 'Đã bỏ ghim ' + p.name, {
          undo: function () { S.update('projects', id, { pinned: !on }); }
        });
      });
    });
  }

  function paint(sel, list, mode) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return;
    el.innerHTML = list.map(mode === 'list' ? row : card).join('');
    // Gắn lại trạng thái vai trò/thiết bị cho link vừa sinh
    el.querySelectorAll('a[href]').forEach(function (a) { a.setAttribute('href', RECO.link(a.getAttribute('href'))); });
    bindPins(el);
  }

  /* Khối rỗng dùng chung cho mọi danh sách */
  function empty(title, body, actionHtml) {
    return '<div class="empty state-empty"><h3>' + title + '</h3>' +
      '<p class="lead mt-1">' + body + '</p>' +
      (actionHtml ? '<div class="row mt-3" style="justify-content:center">' + actionHtml + '</div>' : '') +
      '</div>';
  }

  function areaTxt(n) { return String(n).replace('.', ',') + ' m²'; }
  function unitHref(u) {
    return 'san-pham.html?pj=' + encodeURIComponent(u.pj) + '&unit=' + encodeURIComponent(u.id);
  }
  function unitCard(u, opts) {
    opts = opts || {};
    var hot = !!opts.hot;
    var st = S.UNIT_STATE[u.state] || S.UNIT_STATE.con;
    var p = S.find('projects', u.pj);
    var cover = S.unitCover(u);
    var line = (u.pitch || '').split(/\n/)[0];
    var meta = hot
      ? esc(u.kind) + ' · ' + areaTxt(u.area) + (u.dir ? ' · ' + esc(u.dir) : '') +
        (u.block ? ' · ' + esc(u.block) + (u.floor ? ' tầng ' + u.floor : '') : '')
      : esc(u.kind) + ' · ' + areaTxt(u.area);
    return '<a class="ucard' + (hot ? ' ucard-hot' : ' ucard-quiet') + '" href="' + unitHref(u) + '">' +
      '<div class="ucard-media">' +
        '<img src="' + RECO.asset(cover) + '" alt="' + esc(u.id) + '" loading="lazy">' +
        (hot ? '<span class="top-left hot">HOT</span>' : '') +
      '</div>' +
      '<div class="ucard-body">' +
        '<div class="row-tight"><span class="ucard-id">' + esc(u.id) + '</span><span class="st ' + st.cls + '">' + esc(st.text) + '</span></div>' +
        '<p class="micro">' + esc(p ? p.name : '') + '</p>' +
        '<p class="micro muted">' + meta + '</p>' +
        (hot && line ? '<p class="ucard-pitch">' + esc(line) + '</p>' : '') +
      '</div></a>';
  }

  function unitRow(u, opts) {
    opts = opts || {};
    var hot = !!opts.hot;
    var st = S.UNIT_STATE[u.state] || S.UNIT_STATE.con;
    var p = S.find('projects', u.pj);
    var cover = S.unitCover(u);
    var meta = esc(u.kind) + ' · ' + areaTxt(u.area) + (u.dir ? ' · ' + esc(u.dir) : '');
    return '<a class="prow" href="' + unitHref(u) + '">' +
      '<img src="' + RECO.asset(cover) + '" alt="' + esc(u.id) + '" loading="lazy">' +
      '<div>' +
        '<div class="row-tight mb-1">' +
          (hot ? '<span class="hot">HOT</span>' : '') +
          '<span class="st ' + st.cls + '">' + esc(st.text) + '</span></div>' +
        '<h3 style="font-size:1.02rem">' + esc(u.id) + '</h3>' +
        '<div class="small muted">' + esc(p ? p.name : '') + ' · ' + meta + '</div>' +
      '</div></a>';
  }

  window.RECO_DATA = {
    projects: projects, card: card, row: row, paint: paint, bindPins: bindPins, empty: empty, esc: esc,
    unitCard: unitCard, unitRow: unitRow, areaTxt: areaTxt, unitHref: unitHref
  };
})();
