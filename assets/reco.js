/* RECO Data-SalesHub — prototype runtime
   Dựng vỏ giao diện dùng chung, đổi vai trò, khung thiết bị, drawer, tab, modal, toast.

   Chạy được ở hai chế độ:
   · nhiều trang — mỗi màn một file .html, trạng thái nằm ở query (?role=&dev=)
   · một trang   — cả 20 màn gói vào một file (bản Artifact), trạng thái nằm ở hash (#trang?role=)
   Cả hai đều giữ trạng thái trong URL để chạy được khi mở bằng file:// — không phụ thuộc localStorage. */
(function () {
  'use strict';

  /* Bản gói một trang khai báo hai biến này trước khi nạp tệp này. */
  var BUNDLE = !!window.RECO_BUNDLE;
  var PAGES = window.RECO_PAGES || {};

  /* ---------- Vai trò ---------- */
  var ROLES = [
    { id: 'gd', name: 'Tổng giám đốc', short: 'TGĐ', scope: 'Toàn bộ dự án', who: 'Trần Minh Quang' },
    { id: 'gddu', name: 'Giám đốc dự án', short: 'GĐDA', scope: '3 dự án phụ trách', who: 'Hoàng Anh Tuấn' },
    { id: 'tkkd', name: 'Thư ký kinh doanh', short: 'TKKD', scope: '3 dự án phụ trách', who: 'Trịnh Mai Lan' },
    { id: 'qlkd', name: 'Quản lý kinh doanh', short: 'QLKD', scope: 'Đội Miền Bắc', who: 'Phạm Hải Đăng' },
    { id: 'nvbh', name: 'Nhân viên bán hàng', short: 'NVBH', scope: 'Nội dung được phép xem', who: 'Lê Thu Hà' },
    { id: 'hcns', name: 'Hành chính nhân sự', short: 'HCNS', scope: 'Tài khoản & hồ sơ nhân sự', who: 'Vũ Kim Chi' },
    { id: 'ktoan', name: 'Kế toán', short: 'KT', scope: 'Số liệu giao dịch & hoa hồng', who: 'Ngô Thanh Bình' },
    { id: 'mkt', name: 'Marketing', short: 'MKT', scope: 'Nội dung & dự án được giao', who: 'Đỗ Bảo Ngọc' },
    /* Vai trò thứ chín (QD-053) — tài khoản Khách hàng là hạng mục bổ sung ngoài gói đã báo giá.
       Trong bản mô phỏng, chọn vai trò này chỉ mở đúng phần khách được phép thấy. */
    { id: 'khach', name: 'Khách hàng', short: 'KH', scope: 'Nội dung được nhân viên chia sẻ', who: 'Khách của Lê Thu Hà', outside: true }
  ];
  var DEFAULT_ROLE = 'nvbh';

  function roleOf(id) {
    for (var i = 0; i < ROLES.length; i++) if (ROLES[i].id === id) return ROLES[i];
    return ROLES[0];
  }

  var qs, role, device, bare, page, R;

  function readState() {
    if (BUNDLE) {
      var h = location.hash.replace(/^#/, '');
      var i = h.indexOf('?');
      page = (i < 0 ? h : h.slice(0, i)) || 'index';
      if (!PAGES[page]) page = 'index';
      qs = new URLSearchParams(i < 0 ? '' : h.slice(i + 1));
    } else {
      qs = new URLSearchParams(location.search);
      page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
    }
    role = qs.get('role');
    if (!ROLES.some(function (r) { return r.id === role; })) role = DEFAULT_ROLE;
    var d = qs.get('dev');
    device = (d === 'm' || d === 't') ? d : 'd';
    bare = qs.get('bare') === '1';   // ẩn thanh demo (dùng khi chụp ảnh / nhúng khung thiết bị)
    R = roleOf(role);
  }
  readState();

  /* Tên tệp của màn đang xem — bản gói không có đường dẫn thật nên suy từ hash. */
  function currentFile() {
    return BUNDLE ? page + '.html' : (location.pathname.split('/').pop() || 'index.html');
  }

  /* ---------- Ảnh ----------
     Bản nhiều trang đọc từ ASSET_BASE/img (root = assets/, trang trong gd01/gd02 = ../assets/).
     Bản gói giữ mỗi ảnh đúng một lần trong window.RECO_IMG rồi thay vào lúc dựng. */
  function assetBase() {
    if (window.RECO_ASSET_BASE != null) return window.RECO_ASSET_BASE;
    if (BUNDLE) return '';
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var abs = scripts[i].src || '';
      if (/\/reco\.js(\?|$)/.test(abs)) return abs.replace(/reco\.js(\?.*)?$/, '');
    }
    return 'assets/';
  }
  var ASSET_BASE = assetBase();
  function asset(name) {
    return (window.RECO_IMG && window.RECO_IMG[name]) || (ASSET_BASE + 'img/' + name);
  }
  function expand(s) {
    if (!BUNDLE || !s) return s;
    return s.replace(/@@i:([^@]+)@@/g, function (_, n) { return asset(n); });
  }

  /* Ghép tham số trạng thái vào một đường dẫn nội bộ */
  function link(href, opts) {
    opts = opts || {};
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
    var parts = href.split('#');
    var base = parts[0];
    var frag = parts[1] || '';
    var p = [];
    var rl = opts.role || role;
    if (rl !== DEFAULT_ROLE) p.push('role=' + rl);
    var dv = opts.dev || device;
    if ((dv === 'm' || dv === 't') && !opts.dropDev) p.push('dev=' + dv);
    if (opts.bare === undefined ? bare : opts.bare) p.push('bare=1');

    if (BUNDLE) {
      // Bản gói không có tệp riêng: mỗi màn là một hash, mục trên trang đi kèm tham số at=
      var qi = base.indexOf('?');
      var own = qi >= 0 ? base.slice(qi + 1) : '';        // tham số trang tự viết, ví dụ ?q=celestine
      var file = qi >= 0 ? base.slice(0, qi) : base;
      var name = file.replace(/\.html$/, '') || 'index';
      if (own) p.push(own);
      if (frag) p.push('at=' + frag);
      return '#' + name + (p.length ? '?' + p.join('&') : '');
    }
    var sep = base.indexOf('?') >= 0 ? '&' : '?';
    return base + (p.length ? sep + p.join('&') : '') + (frag ? '#' + frag : '');
  }

  /* ---------- Icon ---------- */
  var I = {
    search: '<path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="m21 21-4.35-4.35"/>',
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    dots: '<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
    users: '<path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 20v-2a4 4 0 0 0-3-3.87"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    sheet: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
    alert: '<path d="M12 9v4"/><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 17h.01"/>',
    down: '<path d="M12 3v12"/><path d="m7 12 5 5 5-5"/><path d="M4 21h16"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    pin: '<path d="M12 17v5"/><path d="M9 3h6l-1 6 3.5 3.5H6.5L10 9Z"/>',
    caret: '<path d="m9 6 6 6-6 6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 18h.01"/>',
    desktop: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6h.01"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>'
  };
  function svg(name, cls) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"' +
      (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true">' + (I[name] || '') + '</svg>';
  }

  /* ---------- Nav ---------- */
  function inGd01() {
    if (window.RECO_PHASE === 'gd01') return true;
    try { return /(?:^|\/)gd01\//.test(location.pathname || ''); } catch (e) { return false; }
  }

  var NAV = inGd01() ? [
    { href: 'trang-dau.html', label: 'Trang đầu', key: 'trang-dau', icon: 'home' },
    { href: 'du-an.html', label: 'Dự án', key: 'du-an', icon: 'layers' },
    { href: 'danh-muc-san-pham.html', label: 'Sản phẩm', key: 'san-pham', icon: 'grid' },
    { href: 'cay-thu-muc.html', label: 'Tài liệu', key: 'tai-lieu', icon: 'folder' },
    { href: 'chia-se.html', label: 'Chia sẻ', key: 'chia-se', icon: 'share' },
    { href: 'quan-tri.html', label: 'Quản trị', key: 'quan-tri', icon: 'shield', roles: 'gd gddu tkkd mkt hcns ktoan' }
  ] : [
    { href: 'trang-dau.html', label: 'Trang đầu', key: 'trang-dau', icon: 'home' },
    { href: 'du-an.html', label: 'Dự án', key: 'du-an', icon: 'layers' },
    /* Tài liệu mở thẳng vào cây thư mục — đó là cách RECO tổ chức tài liệu thật.
       Danh sách phẳng là chế độ xem thứ hai, đổi bằng cặp nút ở đầu màn. */
    { href: 'cay-thu-muc.html', label: 'Tài liệu', key: 'tai-lieu', icon: 'folder' },
    { href: 'chia-se.html', label: 'Chia sẻ', key: 'chia-se', icon: 'share' },
    { href: 'quan-tri.html', label: 'Quản trị', key: 'quan-tri', icon: 'shield', roles: 'gd gddu tkkd mkt hcns ktoan' },
    /* Danh mục tính năng và báo giá — nội dung thương mại nội bộ, vai trò Khách hàng không thấy.
       Đặt cuối NAV nên không lọt vào dock (dock chỉ lấy 4 mục đầu). */
    { href: 'tinh-nang-gd1.html', label: 'Tính năng & báo giá', key: 'tinh-nang', icon: 'sheet', roles: 'gd gddu tkkd qlkd nvbh hcns ktoan mkt' }
  ];
  var MORE = inGd01() ? [
    { href: 'de-nghi-sua.html', label: 'Đề nghị sửa nội dung' },
    { href: 'nguoi-dung.html', label: 'Người dùng và quyền', roles: 'gd hcns' },
    /* Giá và phạm vi — không lên NAV, chỉ menu Thêm / drawer của GĐ và TKKD. */
    { href: 'tinh-nang-gd1.html', label: 'Tính năng & báo giá', key: 'tinh-nang', roles: 'gd gddu tkkd' },
    { href: 'sitemap.html', label: 'Bản đồ hệ thống · đối chiếu SaleHUB', key: 'sitemap', roles: 'gd gddu tkkd' },
    { href: 'bao-tri.html', label: 'Lịch bàn giao và bảo trì', roles: 'gd gddu tkkd' },
    { href: 'ha-tang.html', label: 'Hạ tầng và chi phí vận hành', roles: 'gd gddu tkkd' },
    { href: '../index.html', label: 'Cổng Giai đoạn 1 / 2' }
  ] : [
    { href: 'thu-vien-tai-lieu.html', label: 'Danh sách tài liệu · tìm theo bộ lọc' },
    { href: 'soan-noi-dung.html', label: 'Chuẩn bị nội dung bán hàng', roles: 'gd gddu tkkd qlkd nvbh mkt' },
    { href: 'de-nghi-sua.html', label: 'Đề nghị sửa nội dung' },
    { href: 'nguoi-dung.html', label: 'Người dùng và quyền', roles: 'gd hcns' },
    /* Bản đồ hệ thống đối chiếu từng mục SaleHUB của RECO với màn hình — nội dung nội bộ,
       vai trò Khách hàng không thấy, giống mục Tính năng & báo giá. */
    { href: 'sitemap.html', label: 'Bản đồ hệ thống · đối chiếu SaleHUB', roles: 'gd gddu tkkd qlkd nvbh hcns ktoan mkt' },
    /* Cùng nhóm nội dung thương mại với Tính năng & báo giá nên dùng chung danh sách vai trò. */
    { href: 'ha-tang.html', label: 'Hạ tầng và chi phí vận hành', roles: 'gd gddu tkkd qlkd nvbh hcns ktoan mkt' },
    { href: 'index.html', label: 'Bản đồ prototype' }
  ];
  function allowed(item) { return !item.roles || item.roles.split(' ').indexOf(role) >= 0; }

  /* ---------- Dựng vỏ ---------- */
  function buildProto() {
    if (bare) return '';
    var opts = ROLES.map(function (r) {
      return '<option value="' + r.id + '"' + (r.id === role ? ' selected' : '') + '>' + r.name + '</option>';
    }).join('');
    /* Đường về bản đồ prototype. Thanh này có ở mọi màn nên đây là chỗ duy nhất
       người xem luôn quay lại được trang mở đầu — khác với chữ RECO trên thanh
       trên cùng, vốn phải trỏ về Trang đầu của ứng dụng.
       Nút thế chỗ nhãn chứ không thêm vào: thêm một phần tử nữa thì thanh xuống
       hai dòng ở 1440px, và --proto-h là thứ .sec dùng để chừa chỗ khi nhảy neo. */
    var homeHref = inGd01() ? '../index.html' : 'index.html';
    var home = (currentFile() === 'index.html' && !inGd01())
      ? '<span class="proto-tag">Prototype · duyệt thiết kế</span>'
      : '<a class="proto-btn" href="' + link(homeHref) + '">◄ Cổng prototype</a>';
    return '' +
      '<div class="proto">' +
        '<div class="proto-in">' +
          home +
          '<label for="proto-role">Đang xem với vai trò</label>' +
          '<select id="proto-role" aria-label="Chọn vai trò đang xem">' + opts + '</select>' +
          '<span class="micro muted no-lg proto-desk" style="flex-basis:100%">Phạm vi: ' + R.scope + '</span>' +
          '<span class="micro only-lg muted">Phạm vi: ' + R.scope + '</span>' +
          '<span class="proto-spacer"></span>' +
          '<span class="proto-devs proto-desk" role="group" aria-label="Khung xem">' +
            '<button type="button" class="proto-btn proto-icon" data-dev="m" aria-pressed="' + (device === 'm') + '" aria-label="Xem bản điện thoại" title="Điện thoại">' + svg('phone') + '</button>' +
            '<button type="button" class="proto-btn proto-icon" data-dev="t" aria-pressed="' + (device === 't') + '" aria-label="Xem bản máy tính bảng" title="Máy tính bảng">' + svg('tablet') + '</button>' +
            '<button type="button" class="proto-btn proto-icon" data-dev="d" aria-pressed="' + (device === 'd') + '" aria-label="Xem bản máy tính" title="Máy tính">' + svg('desktop') + '</button>' +
          '</span>' +
          '<button type="button" class="proto-btn proto-desk" id="proto-reset">Đặt lại dữ liệu demo</button>' +
          '<button type="button" class="proto-btn proto-desk" id="proto-bare">Ẩn thanh demo</button>' +
        '</div>' +
      '</div>';
  }

  function buildTopbar(active) {
    var nav = NAV.filter(allowed).map(function (n) {
      return '<a href="' + link(n.href) + '"' + (n.key === active ? ' aria-current="page"' : '') + '>' + n.label + '</a>';
    }).join('');
    return '' +
      '<header class="topbar">' +
        '<div class="topbar-in">' +
          '<button type="button" class="icon-btn burger" id="nav-open" aria-label="Mở menu">' + svg('menu') + '</button>' +
          '<a class="brand" href="' + link('trang-dau.html') + '"><b>RECO</b><span>Sales Hub</span></a>' +
          '<nav class="nav" aria-label="Điều hướng chính">' + nav + '</nav>' +
          '<div class="topbar-end">' +
            '<button type="button" class="icon-btn nav-more-top" id="nav-more-top" aria-label="Thêm">' + svg('dots') + '</button>' +
            '<div class="gs">' +
              '<div class="searchbox">' + svg('search') +
                '<input type="search" id="gs-input" placeholder="Tìm dự án, tài liệu, mã căn…" aria-label="Tìm kiếm" autocomplete="off">' +
              '</div>' +
              '<div class="gs-panel" id="gs-panel" hidden></div>' +
            '</div>' +
            '<button type="button" class="icon-btn gs-open" id="gs-open" aria-label="Tìm kiếm">' + svg('search') + '</button>' +
            '<div class="gs">' +
              '<button type="button" class="icon-btn" id="bell" aria-label="Thông báo" aria-expanded="false">' + svg('bell') + '<i class="dot" hidden></i></button>' +
              '<div class="gs-panel gs-right" id="bell-panel" hidden></div>' +
            '</div>' +
            '<div class="people">' +
              '<span class="avatar" aria-hidden="true">' + R.short + '</span>' +
              '<span class="who only-lg"><b>' + R.who + '</b><span>' + R.name + '</span></span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function buildDrawer(active) {
    var main = NAV.filter(allowed).map(function (n) {
      return '<a href="' + link(n.href) + '"' + (n.key === active ? ' aria-current="page"' : '') + '>' + n.label + '</a>';
    }).join('');
    var more = MORE.filter(allowed).map(function (n) {
      return '<a href="' + link(n.href) + '"' + (n.key && n.key === active ? ' aria-current="page"' : '') + '>' + n.label + '</a>';
    }).join('');
    return '' +
      '<div class="scrim" id="nav-scrim"></div>' +
      '<aside class="drawer" id="nav-drawer" role="dialog" aria-modal="true" aria-label="Menu" tabindex="-1">' +
        '<div class="drawer-head">' +
          '<div class="people"><span class="avatar">' + R.short + '</span><span class="who"><b>' + R.who + '</b><span>' + R.name + '</span></span></div>' +
          '<button type="button" class="icon-btn" id="nav-close" aria-label="Đóng menu">' + svg('x') + '</button>' +
        '</div>' +
        '<nav aria-label="Điều hướng">' + main + '</nav>' +
        '<div style="padding:6px 20px 4px" class="micro muted" role="presentation">Khác</div>' +
        '<nav aria-label="Mục khác">' + more + '</nav>' +
      '</aside>';
  }

  function buildDock(active) {
    var pool = NAV.filter(allowed);
    var keys = inGd01() ? ['trang-dau', 'du-an', 'san-pham', 'chia-se'] : null;
    var pick = keys
      ? keys.map(function (k) {
          return pool.filter(function (n) { return n.key === k; })[0];
        }).filter(Boolean)
      : pool.slice(0, 4);
    var items = pick.map(function (n) {
      return '<a href="' + link(n.href) + '"' + (n.key === active ? ' aria-current="page"' : '') + '>' + svg(n.icon) + '<span>' + n.label + '</span></a>';
    }).join('');
    return '<nav class="dock" aria-label="Điều hướng nhanh">' + items +
      '<a href="#" id="dock-more">' + svg('dots') + '<span>Thêm</span></a></nav>';
  }

  /* Khung nhúng: điện thoại 390×780, máy tính bảng 834×1112 (iPad 11 dọc). */
  function framed() {
    return (device === 'm' || device === 't') && !bare;
  }
  function deviceFrame() {
    var spec = device === 't'
      ? { w: 834, h: 1112, r: 22, pad: 12, cap: 'Bản máy tính bảng · khung 834 × 1112', title: 'Xem trên máy tính bảng' }
      : { w: 390, h: 780, r: 38, pad: 10, cap: 'Bản điện thoại · khung 390 × 780', title: 'Xem trên điện thoại' };
    var to = link(currentFile(), { dev: 'd', dropDev: true, bare: true });
    var src = BUNDLE ? location.href.split('#')[0] + to : to;
    var shell = spec.w + spec.pad * 2;
    var innerR = Math.max(spec.r - 10, 12);
    return '' +
      '<div style="background:#0c1d2b;min-height:calc(100vh - 56px);padding:24px 16px 40px;display:flex;flex-direction:column;align-items:center;gap:14px">' +
        '<p style="color:#9fb3c4;font-size:.82rem;margin:0">' + spec.cap + '</p>' +
        '<div style="width:' + shell + 'px;max-width:100%;background:#0a1620;border-radius:' + spec.r + 'px;padding:' + spec.pad + 'px;box-shadow:0 30px 80px rgba(0,0,0,.5)">' +
          '<iframe id="dev-frame" src="' + src + '" title="' + spec.title + '" style="width:100%;height:' + spec.h + 'px;border:0;border-radius:' + innerR + 'px;background:#f8f7f3;display:block"></iframe>' +
        '</div>' +
        '<p id="dev-fallback" hidden style="color:#9fb3c4;font-size:.86rem;max-width:44ch;text-align:center;margin:0">' +
          'Không nhúng được khung thiết bị ở môi trường này. Anh/chị thu hẹp cửa sổ trình duyệt, ' +
          'hoặc mở trang trên điện thoại / máy tính bảng — giao diện tự co theo.</p>' +
      '</div>';
  }

  /* ---------- Tìm kiếm toàn cục ----------
     Ô tìm trên thanh trên cùng có mặt ở mọi màn, nên đây là thứ người xem thử đầu tiên.
     Chỉ tìm trên thông tin đã sắp xếp, không tìm sâu bên trong tệp — đúng BR-TX-06. */
  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }
  function search(q) {
    var S = window.RECO.store;
    if (!S) return [];
    var t = norm(q.trim());
    if (!t) return [];
    var out = [];
    function push(kind, icon, title, sub, href) {
      if (out.length < 12) out.push({ kind: kind, icon: icon, title: title, sub: sub, href: href });
    }
    S.get('projects').forEach(function (p) {
      if (p.hidden) return;
      if (norm(p.name + ' ' + p.place + ' ' + p.typeName).indexOf(t) < 0) return;
      push('Dự án', 'layers', p.name, p.place + ' · ' + p.typeName, 'du-an-chi-tiet.html?pj=' + p.id);
    });
    S.get('units').forEach(function (u) {
      if (norm(u.id + ' ' + u.kind).indexOf(t) < 0) return;
      var href = S.unitView && S.unitView(u.id) && S.unitView(u.id).catalog
        ? 'san-pham.html?pj=' + u.pj + '&unit=' + encodeURIComponent(u.id)
        : 'du-an-chi-tiet.html?pj=' + u.pj + '#kv5';
      push('Căn/lô', 'grid', u.id + ' · ' + u.kind,
        S.projectName(u.pj) + ' · ' + u.area + ' m² · ' + S.UNIT_STATE[u.state].text,
        href);
    });
    S.get('documents').forEach(function (d) {
      if (!S.canSee(d.label, role)) return;
      if (norm(d.name).indexOf(t) < 0) return;
      push('Tài liệu', 'file', d.name, S.projectName(d.pj) + ' · ' + S.LABELS[d.label].text, 'thu-vien-tai-lieu.html');
    });
    if (!inGd01()) {
      S.get('qas').forEach(function (qa) {
        if (!S.canSee(qa.label, role)) return;
        if (qa.state !== 'approved' && qa.state !== 'pending_info') return;
        if (norm(qa.q + ' ' + qa.a).indexOf(t) < 0) return;
        push('Hỏi đáp', 'file', qa.q, S.projectName(qa.pj) + ' · ' + (S.TOPICS[qa.topic] || ''),
          'du-an-chi-tiet.html?pj=' + qa.pj + '#kv7');
      });
    }
    return out;
  }

  function renderSearch(q) {
    var panel = document.getElementById('gs-panel');
    if (!panel) return;
    var S = window.RECO.store;
    var html = '';
    if (!q.trim()) {
      var rec = S ? S.get('recent') : [];
      html = '<p class="gs-head">' + (rec.length ? 'Gần đây' : 'Gõ để tìm dự án, mã căn hoặc tài liệu') + '</p>';
      rec.slice(0, 5).forEach(function (r) {
        html += '<a class="gs-item" href="' + link(r.href) + '">' + svg(r.icon || 'clock') +
          '<span><b>' + r.title + '</b><small>' + (r.sub || '') + '</small></span></a>';
      });
    } else {
      var res = search(q);
      if (!res.length) {
        html = '<p class="gs-head">Không tìm thấy “' + q + '”</p>' +
          '<p class="gs-none">Thử tên dự án, mã căn như T1-08.02, hoặc tên tài liệu.</p>';
      } else {
        html = '<p class="gs-head">' + res.length + ' kết quả</p>';
        res.forEach(function (r) {
          html += '<a class="gs-item" href="' + link(r.href) + '">' + svg(r.icon) +
            '<span><b>' + r.title + '</b><small>' + r.kind + ' · ' + r.sub + '</small></span></a>';
        });
      }
    }
    panel.innerHTML = html;
  }

  /* ---------- Thông báo ---------- */
  function myNotifications() {
    var S = window.RECO.store;
    if (!S) return [];
    return S.get('notifications').filter(function (n) {
      return !n.to || n.to.split(' ').indexOf(role) >= 0;
    });
  }
  function renderBell() {
    var panel = document.getElementById('bell-panel');
    var dot = document.querySelector('#bell .dot');
    if (!panel) return;
    var list = myNotifications();
    var unread = list.filter(function (n) { return !n.read; }).length;
    if (dot) dot.hidden = unread === 0;
    var html = '<p class="gs-head">Thông báo' + (unread ? ' · ' + unread + ' chưa đọc' : '') +
      (unread ? '<button type="button" class="gs-act" id="bell-all">Đánh dấu đã đọc</button>' : '') + '</p>';
    if (!list.length) {
      html += '<p class="gs-none">Chưa có thông báo nào cho vai trò này.</p>';
    } else {
      list.forEach(function (n) {
        html += '<a class="gs-item' + (n.read ? '' : ' unread') + '" href="' + link(n.go) + '" data-nid="' + n.id + '">' +
          svg(n.kind === 'ok' ? 'check' : n.kind === 'expire' ? 'clock' : n.kind === 'req' ? 'edit' : 'alert') +
          '<span><b>' + n.title + '</b><small>' + n.body + '</small><small class="gs-at">' + n.at + '</small></span></a>';
      });
    }
    panel.innerHTML = html;
    var all = document.getElementById('bell-all');
    if (all) all.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      myNotifications().forEach(function (n) {
        if (n.kind === 'alert') return;
        window.RECO.store.update('notifications', n.id, { read: true });
      });
      renderBell();
      toast('Đã đánh dấu tất cả là đã đọc');
    });
    panel.querySelectorAll('[data-nid]').forEach(function (a) {
      a.addEventListener('click', function () {
        var rec = window.RECO.store.find('notifications', a.getAttribute('data-nid'));
        /* Cảnh báo ticker: đóng popup / mở chuông không đánh dấu đã đọc — tin vẫn nằm trong chuông. */
        if (rec && rec.kind === 'alert') return;
        window.RECO.store.update('notifications', a.getAttribute('data-nid'), { read: true });
      });
    });
  }

  /* Ghi lại màn vừa xem để mục "Gần đây" có nội dung */
  function trackRecent(title, sub, href, icon) {
    var S = window.RECO.store;
    if (!S || !title) return;
    var list = S.get('recent');
    for (var i = list.length - 1; i >= 0; i--) if (list[i].href === href) list.splice(i, 1);
    list.unshift({ title: title, sub: sub, href: href, icon: icon || 'clock' });
    if (list.length > 8) list.length = 8;
    S.save();
  }

  function initTopbarPanels() {
    var input = document.getElementById('gs-input');
    var panel = document.getElementById('gs-panel');
    var openBtn = document.getElementById('gs-open');
    var bell = document.getElementById('bell');
    var bellPanel = document.getElementById('bell-panel');

    function closeAll(except) {
      if (panel && panel !== except) panel.hidden = true;
      if (bellPanel && bellPanel !== except) { bellPanel.hidden = true; if (bell) bell.setAttribute('aria-expanded', 'false'); }
    }

    if (input && panel) {
      input.addEventListener('focus', function () { renderSearch(input.value); panel.hidden = false; closeAll(panel); });
      input.addEventListener('input', function () { renderSearch(input.value); panel.hidden = false; });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { panel.hidden = true; input.blur(); }
        if (e.key === 'Enter') {
          var first = panel.querySelector('.gs-item');
          if (first) { e.preventDefault(); first.click(); }
        }
      });
    }
    if (openBtn && input) {
      openBtn.addEventListener('click', function () {
        document.querySelector('.gs').classList.add('gs-mobile-open');
        input.focus();
      });
    }
    if (bell && bellPanel) {
      renderBell();
      bell.addEventListener('click', function () {
        var open = bellPanel.hidden;
        closeAll(bellPanel);
        bellPanel.hidden = !open;
        bell.setAttribute('aria-expanded', String(open));
        if (open) renderBell();
      });
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.gs')) return;
      closeAll(null);
      var g = document.querySelector('.gs-mobile-open');
      if (g) g.classList.remove('gs-mobile-open');
    });
  }

  /* ---------- Áp quyền theo vai trò ---------- */
  function applyRoles(root) {
    (root || document).querySelectorAll('[data-roles]').forEach(function (el) {
      var ok = el.getAttribute('data-roles').split(/\s+/).indexOf(role) >= 0;
      el.hidden = !ok;
      if (!ok) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden');
    });
    (root || document).querySelectorAll('[data-roles-not]').forEach(function (el) {
      var hit = el.getAttribute('data-roles-not').split(/\s+/).indexOf(role) >= 0;
      el.hidden = hit;
    });
  }

  /* ---------- Drawer ---------- */
  var lastFocus = null;
  function openDrawer() {
    var d = document.getElementById('nav-drawer'), s = document.getElementById('nav-scrim');
    if (!d) return;
    lastFocus = document.activeElement;
    d.classList.add('open'); s.classList.add('open');
    document.body.style.overflow = 'hidden';
    d.focus();
  }
  function closeDrawer() {
    var d = document.getElementById('nav-drawer'), s = document.getElementById('nav-scrim');
    if (!d) return;
    d.classList.remove('open'); s.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- Modal ---------- */
  var modalReturn = null;
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    modalReturn = document.activeElement;
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    var f = m.querySelector('input,textarea,select,button');
    if (f) f.focus();
  }
  /* Chỉ trả lại cuộn nền khi không còn hộp thoại nào đang mở —
     nếu không, đóng hộp xác nhận chồng lên hộp nhập liệu sẽ làm nền cuộn sau lưng. */
  function releaseScroll() {
    if (document.querySelector('.modal:not([hidden])')) return;
    document.body.style.overflow = '';
  }
  function closeModal(el) {
    var m = typeof el === 'string' ? document.getElementById(el) : el;
    if (!m) return;
    m.hidden = true;
    releaseScroll();
    if (modalReturn && modalReturn.isConnected) modalReturn.focus();
  }

  /* ---------- Toast ---------- */
  function toast(msg, opts) {
    opts = opts || {};
    var box = document.querySelector('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
    var t = document.createElement('div');
    t.className = 'toast' + (opts.danger ? ' toast-danger' : '');
    t.setAttribute('role', 'status');
    t.innerHTML = svg(opts.danger ? 'alert' : 'check') + '<span></span>';
    t.querySelector('span').textContent = msg;
    if (opts.undo) {
      var u = document.createElement('button');
      u.type = 'button';
      u.className = 'toast-undo';
      u.textContent = 'Hoàn tác';
      u.addEventListener('click', function () { opts.undo(); t.remove(); });
      t.appendChild(u);
    }
    box.appendChild(t);
    var ms = opts.undo ? 5200 : 2600;
    setTimeout(function () {
      if (!t.isConnected) return;
      t.style.transition = 'opacity .3s'; t.style.opacity = '0';
      setTimeout(function () { t.remove(); }, 320);
    }, ms);
    return t;
  }

  /* ---------- Sao chép vào bộ nhớ tạm ----------
     navigator.clipboard chỉ chạy trên trang bảo mật, mở bằng file:// là trình duyệt chặn.
     Phải có đường lùi, và toast phải nói đúng sự thật thay vì luôn báo "đã sao chép". */
  function copy(text) {
    return new Promise(function (resolve) {
      var done = false;
      function finish(ok) { if (!done) { done = true; resolve(ok); } }
      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand('copy');
          ta.remove();
          finish(ok);
        } catch (e) { finish(false); }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // Khi trang không giữ focus, lời hứa của clipboard có thể không bao giờ kết thúc.
        // Không đặt hạn thì người dùng bấm xong chẳng nhận được phản hồi nào.
        setTimeout(function () { if (!done) fallback(); }, 350);
        navigator.clipboard.writeText(text).then(function () { finish(true); }, fallback);
      } else fallback();
    });
  }
  /* Sao chép kèm toast báo đúng kết quả */
  function copyWithToast(text, okMsg) {
    return copy(text).then(function (ok) {
      toast(ok ? (okMsg || 'Đã sao chép vào bộ nhớ tạm')
               : 'Trình duyệt chặn sao chép tự động. Anh/chị bôi đen rồi nhấn Ctrl+C.',
            { danger: !ok });
      return ok;
    });
  }

  function confirmBar(msg, opts) {
    opts = opts || {};
    var bar = document.getElementById('reco-confirm');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'reco-confirm';
      bar.className = 'confirm-bar';
      bar.setAttribute('role', 'status');
      document.body.appendChild(bar);
    }
    bar.innerHTML = '<span></span>';
    bar.querySelector('span').textContent = msg;
    if (opts.href && opts.cta) {
      var a = document.createElement('a');
      a.className = 'btn btn-primary btn-sm';
      a.href = opts.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = opts.cta;
      bar.appendChild(a);
    }
    bar.hidden = false;
    clearTimeout(bar._t);
    bar._t = setTimeout(function () { bar.hidden = true; }, opts.ms || 4200);
    return bar;
  }

  function initFilterSheets() {
    document.querySelectorAll('[data-filter-sheet]').forEach(function (bar) {
      if (bar.querySelector('.filter-extras')) return;
      var extras = [];
      Array.prototype.forEach.call(bar.children, function (el) {
        if (el.classList && el.classList.contains('searchbox')) return;
        if (el.tagName === 'INPUT' && (el.type === 'search' || el.id && el.id.indexOf('-q') >= 0)) return;
        extras.push(el);
      });
      if (!extras.length) return;
      var wrap = document.createElement('div');
      wrap.className = 'filter-extras';
      extras.forEach(function (el) { wrap.appendChild(el); });
      var head = document.createElement('div');
      head.className = 'spread fsheet-head';
      head.innerHTML = '<b>Lọc</b>';
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'icon-btn';
      closeBtn.setAttribute('aria-label', 'Đóng');
      closeBtn.innerHTML = svg('x');
      head.appendChild(closeBtn);
      wrap.insertBefore(head, wrap.firstChild);
      var open = document.createElement('button');
      open.type = 'button';
      open.className = 'btn btn-outline btn-sm fsheet-open';
      open.textContent = 'Lọc';
      bar.appendChild(open);
      bar.appendChild(wrap);
      var scrim = document.getElementById('fsheet-scrim');
      if (!scrim) {
        scrim = document.createElement('div');
        scrim.id = 'fsheet-scrim';
        scrim.className = 'fsheet-scrim';
        scrim.hidden = true;
        document.body.appendChild(scrim);
      }
      function count() {
        var n = 0;
        wrap.querySelectorAll('select').forEach(function (s) { if (s.value) n++; });
        wrap.querySelectorAll('input[type="search"], input[type="text"]').forEach(function (s) {
          if (s.value && s.value.trim()) n++;
        });
        open.textContent = n ? 'Lọc (' + n + ')' : 'Lọc';
      }
      function close() {
        wrap.classList.remove('open');
        scrim.hidden = true;
        releaseScroll();
      }
      function show() {
        wrap.classList.add('open');
        scrim.hidden = false;
        document.body.style.overflow = 'hidden';
      }
      open.addEventListener('click', show);
      closeBtn.addEventListener('click', close);
      scrim.addEventListener('click', close);
      wrap.addEventListener('change', count);
      wrap.addEventListener('input', count);
      count();
    });
  }

  /* ---------- Tải tệp về máy ----------
     Mở bằng file:// hoặc máy chủ thường thì tạo Blob rồi bấm thẻ <a download>.
     Nhưng khi trang chạy trong khung xem Artifact, mọi lối tải do trang tự khởi động đều bị
     chặn — nút sẽ im lặng không làm gì. Ở đó phải đi qua khả năng "downloads" của khung xem,
     và người xem còn phải bấm đồng ý. */
  function download(filename, text) {
    return new Promise(function (resolve) {
      function viaBlob() {
        try {
          var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
          resolve('saved');
        } catch (e) { resolve('fail'); }
      }
      var host = (typeof claude !== 'undefined' && claude) ? claude : null;
      if (host && typeof host.use === 'function') {
        // Đang chạy trong khung xem Artifact. Ở đây thẻ <a download> bị chặn im lặng,
        // nên nếu không xin được khả năng tải tệp thì phải nói thật, tuyệt đối không
        // rơi về Blob rồi báo "đã tải" — đó là báo khống.
        host.use('downloads').then(function (d) {
          if (!d) return resolve('blocked');
          d.save({ filename: filename, data: text }).then(
            function () { resolve('saved'); },
            function (err) { resolve(err && err.code === 'declined' ? 'declined' : 'blocked'); }
          );
        }, function () { resolve('blocked'); });
      } else viaBlob();
    });
  }
  function downloadWithToast(filename, text, okMsg) {
    return download(filename, text).then(function (r) {
      if (r === 'saved') toast(okMsg || 'Đã tải ' + filename);
      else if (r === 'declined') toast('Anh/chị đã từ chối lưu tệp');
      else if (r === 'blocked') toast('Bản xem trên web không cho trang tự tải tệp. Anh/chị bấm Sao chép nội dung rồi dán vào tệp.', { danger: true });
      else toast('Không tạo được tệp. Anh/chị dùng nút Sao chép nội dung.', { danger: true });
      return r;
    });
  }

  /* ---------- Ngày giờ ----------
     Bản mô phỏng chốt "hôm nay" trùng với dữ liệu mẫu để mọi số ngày còn lại khớp nhau
     giữa các màn, thay vì mỗi màn tự lấy ngày hệ thống rồi lệch nhau. */
  var TODAY = '14/08/2026';
  function today() { return TODAY; }
  function now() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  /* Hạ nhãn xuống Công khai là thao tác dễ lộ thông tin nội bộ nhất trong ba cấp nhãn —
     MH-09 bắt buộc cảnh báo và xác nhận lại. Gom vào một chỗ để mọi biểu mẫu có ô chọn
     nhãn đều hỏi cùng một câu, thay vì nơi hỏi nơi không. */
  function guardLabel(o) {
    var S = window.RECO.store;
    var down = o.to === 'public' && o.from && o.from !== 'public';
    if (!down) { o.onOk(); return; }
    confirmBox({
      eyebrow: 'Hạ nhãn quyền',
      title: 'Chuyển “' + (o.name || 'nội dung này') + '” sang Công khai?',
      body: '<p class="small">Đang mang nhãn ' + S.label(o.from) + '. Chuyển sang ' + S.label('public') +
            ' là <strong>đưa nội dung ra tới khách hàng, không cần đăng nhập</strong> — mọi trang gửi khách ' +
            'của dự án đều lấy được nội dung này.</p>' +
            '<p class="small muted mt-2">Nhắc lại năm nhóm không bao giờ được công khai: chính sách hoa hồng; ' +
            'bảng hàng, giá hoặc chính sách chưa công bố; kịch bản bán hàng và ghi chú nội bộ; báo cáo, KPI và ' +
            'số liệu tài chính; tài liệu chưa duyệt hoặc đã hết hiệu lực.</p>',
      okText: 'Công khai nội dung',
      danger: true,
      onOk: o.onOk
    });
  }

  /* ---------- Hộp xác nhận ----------
     Mọi hành động khó hoàn tác (thu hồi đường dẫn, ngừng tài khoản, công bố nội dung ra
     ngoài, hạ nhãn quyền) phải đi qua đây, không được chỉ hiện toast rồi coi như xong. */
  function confirmBox(o) {
    var id = 'm-confirm';
    var old = document.getElementById(id);
    if (old) old.remove();
    var m = document.createElement('div');
    m.className = 'modal';
    m.id = id;
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.innerHTML =
      '<div class="modal-box" style="max-width:480px">' +
        '<div class="modal-head"><div>' +
          (o.eyebrow ? '<span class="eyebrow">' + o.eyebrow + '</span>' : '') +
          '<h3>' + o.title + '</h3></div>' +
          '<button class="icon-btn" data-x aria-label="Đóng">' + svg('x') + '</button>' +
        '</div>' +
        '<div class="modal-body">' + (o.body || '') + '</div>' +
        '<div class="modal-foot">' +
          '<button class="btn btn-outline" data-x>' + (o.cancelText || 'Hủy') + '</button>' +
          '<button class="btn ' + (o.danger ? 'btn-danger' : 'btn-primary') + '" data-ok>' + (o.okText || 'Đồng ý') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
    var back = document.activeElement;
    function close() {
      m.remove();
      releaseScroll();
      if (back && back.isConnected) back.focus();
    }
    m.querySelectorAll('[data-x]').forEach(function (b) { b.addEventListener('click', close); });
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    m.querySelector('[data-ok]').addEventListener('click', function () {
      close();
      if (o.onOk) o.onOk();
    });
    document.body.style.overflow = 'hidden';
    m.querySelector('[data-ok]').focus();
    return m;
  }

  /* ---------- Trạng thái đang xử lý ----------
     Tạo PDF có dấu nhận diện, duyệt và công bố, lưu nhãn quyền đều là việc chạy trên máy chủ.
     Nút phải khóa lại và nói rõ đang làm gì, thay vì nhảy kết quả tức thì. */
  function busy(btn, text, ms, done) {
    if (!btn) return;
    var old = btn.innerHTML;
    var w = btn.offsetWidth;
    btn.style.minWidth = w + 'px';
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.innerHTML = '<span class="spin" aria-hidden="true"></span>' + (text || 'Đang xử lý…');
    setTimeout(function () {
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      btn.innerHTML = old;
      btn.style.minWidth = '';
      if (done) done();
    }, ms || 900);
  }

  /* ---------- Kiểm tra biểu mẫu ----------
     Ô ghi "bắt buộc nhập" mà bấm rỗng vẫn qua là lỗi hay gặp nhất của bản mô phỏng. */
  /* Gắn hoặc gỡ thông báo lỗi ngay dưới một ô — dùng được cho cả quy tắc chéo
     (ví dụ ngày hết hiệu lực phải sau ngày hiệu lực) chứ không riêng ô bắt buộc. */
  function fieldError(el, message) {
    if (!el) return;
    var field = el.closest('.field') || el.parentElement;
    var msg = field.querySelector('.err');
    if (!message) {
      el.removeAttribute('aria-invalid');
      if (msg) msg.remove();
      return;
    }
    el.setAttribute('aria-invalid', 'true');
    if (!msg) {
      msg = document.createElement('span');
      msg.className = 'err';
      field.appendChild(msg);
    }
    msg.textContent = message;
  }

  function checkField(el) {
    var val = (el.value || '').trim();
    if (!val) return el.getAttribute('data-msg-empty') || el.getAttribute('data-msg') || 'Mục này bắt buộc nhập.';
    var pat = el.getAttribute('data-pattern');
    if (pat && !(new RegExp(pat).test(val))) {
      return el.getAttribute('data-msg-pattern') || el.getAttribute('data-msg') || 'Nội dung chưa đúng định dạng.';
    }
    return '';
  }

  function validate(scope) {
    var ok = true, first = null;
    scope.querySelectorAll('[data-required]').forEach(function (el) {
      var err = checkField(el);
      fieldError(el, err);
      if (err) { ok = false; if (!first) first = el; }
    });
    if (first) first.focus();
    return ok;
  }

  /* Xóa lỗi khi người dùng sửa — nhưng chỉ khi nội dung đã thật sự hợp lệ,
     không xóa ngay lúc vừa gõ ký tự đầu trong khi định dạng vẫn sai. */
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!el.hasAttribute || !el.hasAttribute('data-required')) return;
    if (el.getAttribute('aria-invalid') !== 'true') return;
    if (!checkField(el)) fieldError(el, '');
  });

  /* ---------- Tabs ---------- */
  function initTabs(root) {
    (root || document).querySelectorAll('[role="tablist"]').forEach(function (list) {
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      function select(tab) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        });
      }
      list.addEventListener('click', function (e) {
        var t = e.target.closest('[role="tab"]');
        if (t) select(t);
      });
      list.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
        if (n < 0) return;
        e.preventDefault();
        var t = tabs[(n + tabs.length) % tabs.length];
        t.focus(); select(t);
      });
    });
  }

  function shownEl(el) {
    if (!el || el.hidden || el.closest('[hidden]')) return false;
    var cs = window.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }

  function markZone(href, links) {
    links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === href); });
    document.querySelectorAll('.zone-chips a, #nav-drawer .drawer-local a[href^="#"]').forEach(function (a) {
      var on = a.getAttribute('href') === href;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  /* ---------- Nav mục dính (chi tiết dự án) ---------- */
  function initSecnav() {
    var nav = document.querySelector('.secnav');
    if (!nav) return;
    // Chỉ nhận neo trong trang. Một href kiểu "trang.html?role=x" đưa thẳng vào querySelector
    // sẽ ném SyntaxError và làm chết cả phần khởi tạo còn lại của màn.
    var links = Array.prototype.slice.call(nav.querySelectorAll('ol a[href^="#"]'));
    var secs = links.map(function (a) {
      try { return document.getElementById(a.getAttribute('href').slice(1)); }
      catch (e) { return null; }
    }).filter(Boolean);
    if (!secs.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        markZone('#' + en.target.id, links);
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    secs.forEach(function (s) { obs.observe(s); });
    var grid = document.querySelector('.detail-grid');
    if (grid && !document.querySelector('.zone-chips')) {
      var chips = document.createElement('nav');
      chips.className = 'zone-chips';
      chips.setAttribute('aria-label', 'Khu vực nội dung');
      var row = document.createElement('div');
      row.className = 'zone-chips-row';
      links.forEach(function (a) {
        var c = document.createElement('a');
        c.setAttribute('href', a.getAttribute('href'));
        c.textContent = a.textContent.replace(/\s+/g, ' ').trim();
        if (a.classList.contains('on')) c.classList.add('on');
        row.appendChild(c);
      });
      chips.appendChild(row);
      var hint = document.createElement('p');
      hint.className = 'zone-chips-hint';
      hint.textContent = 'Vuốt để xem đủ khu vực';
      chips.appendChild(hint);
      grid.parentNode.insertBefore(chips, grid);
    }
  }

  /* Neo khu vực / tab nội trang — chỉ hiện trong hamburger (mobile). */
  function initLocalDrawer() {
    var drawer = document.getElementById('nav-drawer');
    if (!drawer) return;
    var old = drawer.querySelector('.drawer-local');
    if (old) old.remove();

    var title = '';
    var nodes = [];
    var sec = document.querySelector('.secnav');
    var list = document.querySelector('[role="tablist"]');
    if (sec) {
      title = 'Khu vực nội dung';
      Array.prototype.forEach.call(sec.querySelectorAll('ol a[href^="#"]'), function (a) {
        nodes.push({ kind: 'a', href: a.getAttribute('href'), label: a.textContent.replace(/\s+/g, ' ').trim() });
      });
    } else if (list && shownEl(list)) {
      title = list.getAttribute('aria-label') || 'Mục trên trang';
      Array.prototype.forEach.call(list.querySelectorAll('[role="tab"]'), function (t) {
        if (!shownEl(t)) return;
        nodes.push({ kind: 'tab', label: t.textContent.replace(/\s+/g, ' ').trim(), src: t });
      });
    }
    if (!nodes.length) return;

    var box = document.createElement('div');
    box.className = 'drawer-local';
    box.innerHTML = '<p class="micro muted drawer-local-h">' + title + '</p><nav aria-label="' + title + '"></nav>';
    var localNav = box.querySelector('nav');
    nodes.forEach(function (it, i) {
      var el;
      if (it.kind === 'a') {
        el = document.createElement('a');
        el.setAttribute('href', it.href);
        el.textContent = it.label;
        el.addEventListener('click', function () { closeDrawer(); });
      } else {
        el = document.createElement('button');
        el.type = 'button';
        el.textContent = it.label;
        el.setAttribute('data-i', String(i));
        if (it.src.getAttribute('aria-selected') === 'true') el.setAttribute('aria-current', 'true');
        el.addEventListener('click', function () {
          it.src.click();
          closeDrawer();
        });
      }
      localNav.appendChild(el);
    });

    var khac = Array.prototype.filter.call(drawer.querySelectorAll('.micro.muted'), function (p) {
      return p.textContent.replace(/\s+/g, ' ').trim() === 'Khác';
    })[0];
    if (khac) drawer.insertBefore(box, khac);
    else drawer.appendChild(box);

    if (list) {
      list.addEventListener('click', function () {
        requestAnimationFrame(function () {
          var btns = localNav.querySelectorAll('button');
          var tabs = Array.prototype.filter.call(list.querySelectorAll('[role="tab"]'), shownEl);
          for (var i = 0; i < btns.length; i++) {
            var on = tabs[i] && tabs[i].getAttribute('aria-selected') === 'true';
            if (on) btns[i].setAttribute('aria-current', 'true');
            else btns[i].removeAttribute('aria-current');
          }
        });
      });
    }
  }

  function pickSlideEl(root, sel, fallback) {
    if (sel && typeof sel !== 'string') return sel;
    var q = sel || fallback;
    if (!q) return null;
    return root.querySelector(q) || document.querySelector(q);
  }

  function rebindEl(el) {
    if (!el || !el.parentNode) return el;
    var n = el.cloneNode(true);
    el.parentNode.replaceChild(n, el);
    return n;
  }

  function readSlidePer(el) {
    var v = parseInt((window.getComputedStyle(el).getPropertyValue('--slide-per') || '1').trim(), 10);
    return v > 0 ? v : 1;
  }

  /* Nhiều ô một lúc, mỗi lần trượt lệch 1 ô. Honor rail không dùng nhánh này. */
  function bindMultiSlide(root, opts) {
    var itemSel = opts.item || '.reco-slide-item';
    var stage = root.querySelector('.reco-slide-stage') || root;
    var nodes = Array.prototype.slice.call(stage.querySelectorAll(itemSel));
    root.setAttribute('data-per', String(opts.per));
    var dotsEl = pickSlideEl(root, opts.dots, '.reco-slide-dots');
    var prev = rebindEl(pickSlideEl(root, opts.prev, '.reco-slide-prev'));
    var next = rebindEl(pickSlideEl(root, opts.next, '.reco-slide-next'));
    if (!nodes.length) {
      if (dotsEl) dotsEl.innerHTML = '';
      return { go: function () {}, index: function () { return 0; } };
    }

    var track = document.createElement('div');
    track.className = 'reco-slide-track';
    nodes.forEach(function (el) {
      el.classList.add('on');
      track.appendChild(el);
    });
    stage.insertBefore(track, stage.firstChild);

    var idx = 0;
    var dotCount = -1;
    function perView() { return Math.min(readSlidePer(root), nodes.length); }
    function maxIdx() { return Math.max(0, nodes.length - perView()); }
    function paintDots() {
      if (!dotsEl) return;
      var n = maxIdx() + 1;
      if (n !== dotCount) {
        dotCount = n;
        var html = '';
        for (var i = 0; i < n; i++) {
          html += '<button type="button" aria-label="Vị trí ' + (i + 1) + '"></button>';
        }
        dotsEl.innerHTML = html;
        dotsEl.hidden = n <= 1;
        dotsEl.querySelectorAll('button').forEach(function (b, i) {
          b.addEventListener('click', function (e) { e.stopPropagation(); go(i, false); });
        });
      }
      var btns = dotsEl.querySelectorAll('button');
      for (var d = 0; d < btns.length; d++) {
        var on = d === idx;
        btns[d].setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) btns[d].setAttribute('aria-current', 'true');
        else btns[d].removeAttribute('aria-current');
      }
    }
    function go(i, wrap) {
      var max = maxIdx();
      if (wrap) idx = max === 0 ? 0 : ((i % (max + 1)) + (max + 1)) % (max + 1);
      else idx = Math.max(0, Math.min(i, max));
      var p = perView();
      var gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap) || 16;
      var step = (stage.clientWidth + gap) / p;
      track.style.transform = 'translateX(-' + (idx * step) + 'px)';
      paintDots();
    }
    if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(idx - 1, true); });
    if (next) next.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(idx + 1, true); });
    var startX = 0, startY = 0, tracking = false;
    root.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.buttons !== 1) return;
      if (e.target.closest && e.target.closest('a, button')) return;
      tracking = true; startX = e.clientX; startY = e.clientY;
    });
    function endPointer(e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      go(dx < 0 ? idx + 1 : idx - 1, true);
    }
    root.addEventListener('pointerup', endPointer);
    root.addEventListener('pointercancel', function () { tracking = false; });
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { go(idx, false); });
      ro.observe(stage);
    }
    go(0, false);
    return { go: function (i) { go(i, false); }, index: function () { return idx; } };
  }

  /* Slider một thẻ / một tin: giữ mọi phần tử trong DOM, chỉ một cái có .on */
  function bindSlide(root, opts) {
    opts = opts || {};
    if (!root) return { go: function () {}, index: function () { return 0; } };
    if (opts.per) return bindMultiSlide(root, opts);
    var itemSel = opts.item || '.reco-slide-item';
    var items = root.querySelectorAll(itemSel);
    var dotsEl = pickSlideEl(root, opts.dots, '.reco-slide-dots');
    var prev = rebindEl(pickSlideEl(root, opts.prev, '.reco-slide-prev'));
    var next = rebindEl(pickSlideEl(root, opts.next, '.reco-slide-next'));
    var idx = 0;
    var n = items.length;
    function go(i) {
      if (!n) return;
      idx = (i + n) % n;
      for (var k = 0; k < n; k++) items[k].classList.toggle('on', k === idx);
      if (!dotsEl) return;
      var btns = dotsEl.querySelectorAll('button');
      for (var d = 0; d < btns.length; d++) {
        var on = d === idx;
        btns[d].setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) btns[d].setAttribute('aria-current', 'true');
        else btns[d].removeAttribute('aria-current');
      }
    }
    if (dotsEl) {
      var html = '';
      for (var i = 0; i < n; i++) {
        html += '<button type="button" aria-label="Mục ' + (i + 1) + '"' +
          (i === 0 ? ' aria-current="true" aria-pressed="true"' : ' aria-pressed="false"') + '></button>';
      }
      dotsEl.innerHTML = html;
      dotsEl.querySelectorAll('button').forEach(function (b, i) {
        b.addEventListener('click', function (e) { e.stopPropagation(); go(i); });
      });
    }
    if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(idx - 1); });
    if (next) next.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(idx + 1); });
    var startX = 0, startY = 0, tracking = false;
    root.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.buttons !== 1) return;
      tracking = true; startX = e.clientX; startY = e.clientY;
    });
    function endPointer(e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      go(dx < 0 ? idx + 1 : idx - 1);
    }
    root.addEventListener('pointerup', endPointer);
    root.addEventListener('pointercancel', function () { tracking = false; });
    go(0);
    return { go: go, index: function () { return idx; } };
  }

  /* ---------- Bộ lọc / chuyển chế độ xem / ghim ---------- */
  /* Gắn một lần cho cả phiên, bắt sự kiện nổi lên tài liệu.
     Gắn theo từng phần tử lúc dựng màn thì mọi nội dung vẽ bằng JS sau đó sẽ mất tác dụng —
     mà giờ hầu hết danh sách đều vẽ từ kho dữ liệu. */
  function initBits() {
    if (window.RECO_DATA) window.RECO_DATA.bindPins(document);
    /* Biểu tượng gợi ý nhét bằng mã, không viết tay vào từng chỗ — mười khu vực dùng chung một hình */
    document.querySelectorAll('[data-tip]').forEach(function (b) {
      if (!b.querySelector('svg')) b.insertAdjacentHTML('afterbegin', svg('info'));
    });
  }

  function installDelegation() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      /* Gợi ý (i): trỏ chuột là đủ trên máy tính, nhưng điện thoại không có trỏ chuột —
         bấm để bật/tắt. Bấm ra chỗ khác thì đóng, nên phải xử lý trước mọi nhánh dưới. */
      var tip = t.closest('[data-tip]');
      var tipWasOn = !!tip && tip.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('[data-tip][aria-expanded="true"]').forEach(function (x) {
        x.setAttribute('aria-expanded', 'false');
      });
      if (tip) { e.preventDefault(); tip.setAttribute('aria-expanded', String(!tipWasOn)); return; }

      var view = t.closest('[data-view]');
      if (view) {
        var target = document.getElementById(view.getAttribute('data-view-target'));
        if (target) {
          view.parentElement.querySelectorAll('[data-view]').forEach(function (b) {
            b.setAttribute('aria-pressed', String(b === view));
          });
          var mode = view.getAttribute('data-view');
          target.querySelectorAll('[data-mode]').forEach(function (el) {
            el.hidden = el.getAttribute('data-mode') !== mode;
          });
        }
        return;
      }

      var open = t.closest('[data-open]');
      if (open) { e.preventDefault(); openModal(open.getAttribute('data-open')); return; }

      var close = t.closest('[data-close]');
      if (close) {
        e.preventDefault();
        closeModal(close.closest('.modal'));
        var msg = close.getAttribute('data-close');
        if (msg && msg !== '1') toast(msg);
        return;
      }

      var tst = t.closest('[data-toast]');
      if (tst) {
        if (tst.tagName === 'A' && tst.getAttribute('href') === '#') e.preventDefault();
        toast(tst.getAttribute('data-toast'));
        return;
      }

      // Bấm ra nền của hộp thoại thì đóng
      if (t.classList && t.classList.contains('modal')) { closeModal(t); return; }

      // Cây thư mục
      var node = t.closest('.tnode');
      if (node) {
        if (node.hasAttribute('aria-expanded')) {
          var on = node.getAttribute('aria-expanded') === 'true';
          node.setAttribute('aria-expanded', String(!on));
          var kids = node.parentElement.querySelector('ul');
          if (kids) kids.hidden = on;
        }
        if (node.hasAttribute('data-sel')) {
          document.querySelectorAll('.tnode').forEach(function (x) { x.classList.remove('sel'); });
          node.classList.add('sel');
          var pane = document.getElementById(node.getAttribute('data-sel'));
          if (pane) {
            document.querySelectorAll('[data-treepane]').forEach(function (p) { p.hidden = true; });
            pane.hidden = false;
          }
        }
      }
    });
  }

  /* Màn chặn dành cho vai trò Khách hàng — nêu rõ đây là hạng mục bổ sung ngoài gói */
  function guestWall() {
    return '' +
      '<div class="wrap" style="padding:48px 0;max-width:640px">' +
        '<div class="card card-pad">' +
          '<span class="chip-gd2">Hạng mục bổ sung · ngoài gói đã báo giá</span>' +
          '<h1 style="font-size:1.5rem;margin:.75rem 0 .5rem">Khu vực này chỉ dành cho nhân viên RECO</h1>' +
          '<p class="small muted">Tài khoản Khách hàng chỉ xem được đúng phần nội dung mang nhãn Công khai mà ' +
            'nhân viên bán hàng đã chia sẻ cho chính mình — không duyệt cây thư mục, không tìm trong kho tài liệu, ' +
            'không thấy dự án chưa được chia sẻ.</p>' +
          '<p class="small muted mt-2">Vai trò này và nút gửi yêu cầu trên trang công khai là hai hạng mục ' +
            '<strong>ngoài gói 198.800.000 VNĐ</strong> — xem QD-053 và QD-055.</p>' +
          '<div class="row mt-3">' +
            '<a class="btn btn-primary" href="' + link('trang-gui-khach.html') + '">Mở trang khách nhận được</a>' +
            '<a class="btn btn-outline" href="' + link('trang-dau.html', { role: 'nvbh' }) + '">Quay lại vai trò nhân viên</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Dựng vỏ cho màn đang xem ---------- */
  function mount() {
    var body = document.body;
    var active = body.getAttribute('data-page') || '';
    var shell = body.getAttribute('data-shell') || 'app';   // app | plain | public

    // Dọn vỏ của lần dựng trước (bản gói dựng lại mỗi khi đổi màn)
    document.querySelectorAll('.proto, .topbar, .drawer, .scrim, .dock, .toasts, #proto-back')
      .forEach(function (el) { el.remove(); });
    body.classList.remove('proto-off');
    body.style.overflow = '';

    if (framed()) {
      body.insertAdjacentHTML('afterbegin', buildProto());
      var main = document.getElementById('page');
      if (main) main.outerHTML = deviceFrame();
      bindProto();
      watchFrame();
      return;
    }

    /* Khách hàng chỉ thấy trang gửi khách. Chặn ngay ở đây, trước khi bất kỳ màn nội bộ nào
       kịp vẽ nội dung — để lọt một lần là bản mô phỏng nói sai về mô hình quyền.
       Hai trang bản đồ mang vỏ `plain` nhưng liệt kê mã màn hình và bảng đối chiếu nội bộ,
       nên chặn theo tên trang chứ không chỉ theo vỏ. */
    if (role === 'khach' && (shell === 'app' || active === 'index' || active === 'sitemap')) {
      body.insertAdjacentHTML('afterbegin', buildProto());
      var inner = document.getElementById('page');
      if (inner) inner.innerHTML = guestWall();
      bindProto();
      return;
    }

    var html = buildProto();
    if (shell === 'app') html += buildTopbar(active);
    body.insertAdjacentHTML('afterbegin', html);
    if (shell === 'app') {
      body.insertAdjacentHTML('beforeend', buildDrawer(active) + buildDock(active));
    }
    if (bare) {
      body.classList.add('proto-off');
      // Lối quay lại thanh demo — chỉ hiện khi đang xem trực tiếp, không hiện trong khung thiết bị
      if (window.top === window.self) {
        var back = document.createElement('button');
        back.type = 'button';
        back.id = 'proto-back';
        back.className = 'proto-btn';
        back.textContent = 'Hiện thanh demo';
        back.style.cssText = 'position:fixed;right:12px;bottom:calc(74px + env(safe-area-inset-bottom));z-index:95;background:#09263c;color:#fff;border-color:#09263c;box-shadow:0 8px 22px rgb(8 39 67/.3)';
        back.addEventListener('click', function () { go({ bare: false }); });
        body.appendChild(back);
      }
    }

    // Gắn trạng thái vào mọi link nội bộ do trang tự viết
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (a.closest('.proto')) return;
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(h) || h.indexOf('role=') >= 0) return;
      a.setAttribute('href', link(h));
    });

    // Bản gói: mục trên cùng một trang cuộn tới nơi thay vì đổi hash (hash là địa chỉ màn)
    if (BUNDLE) {
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var id = a.getAttribute('href').slice(1);
        if (!id || PAGES[id]) return;
        a.addEventListener('click', function (e) {
          var t = document.getElementById(id);
          if (!t) return;
          e.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    applyRoles();
    bindProto();
    initTopbarPanels();
    initTabs();
    initSecnav();
    initLocalDrawer();
    initFilterSheets();
    initBits();

    var open = document.getElementById('nav-open');
    var close = document.getElementById('nav-close');
    var scrim = document.getElementById('nav-scrim');
    var more = document.getElementById('dock-more');
    var moreTop = document.getElementById('nav-more-top');
    if (open) open.addEventListener('click', openDrawer);
    if (close) close.addEventListener('click', closeDrawer);
    if (scrim) scrim.addEventListener('click', closeDrawer);
    if (more) more.addEventListener('click', function (e) { e.preventDefault(); openDrawer(); });
    if (moreTop) moreTop.addEventListener('click', openDrawer);
    // Focus trap trong drawer
    var drawer = document.getElementById('nav-drawer');
    if (drawer) {
      drawer.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !drawer.classList.contains('open')) return;
        var f = drawer.querySelectorAll('a[href],button:not([disabled])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    }
  }

  /* Đi tới chính màn đang xem với trạng thái mới */
  function go(opts) {
    var to = link(currentFile(), opts);
    if (BUNDLE && to === location.hash) { readState(); route(); return; }
    location.href = to;
  }

  function bindProto() {
    var sel = document.getElementById('proto-role');
    if (sel) sel.addEventListener('change', function () { go({ role: sel.value }); });
    document.querySelectorAll('.proto-devs [data-dev]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-dev');
        if (next === device) return;
        if (next === 'd') go({ dev: 'd', dropDev: true });
        else go({ dev: next });
      });
    });
    var bareBtn = document.getElementById('proto-bare');
    if (bareBtn) bareBtn.addEventListener('click', function () { go({ bare: true }); });
    var resetBtn = document.getElementById('proto-reset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      confirmBox({
        eyebrow: 'Thanh demo',
        title: 'Đặt lại dữ liệu demo?',
        body: '<p class="small muted">Mọi thay đổi trong phiên này — nội dung đã duyệt, đường dẫn đã tạo, đề nghị đã xử lý — ' +
              'sẽ trở về trạng thái ban đầu để anh/chị diễn lại kịch bản từ đầu.</p>',
        okText: 'Đặt lại',
        onOk: function () {
          window.RECO.store.reset();
          if (BUNDLE) { route(); } else { location.reload(); }
          toast('Đã đặt lại dữ liệu demo');
        }
      });
    });
  }

  /* Khung thiết bị dùng iframe trỏ về chính trang này. Một số nơi nhúng chặn iframe,
     nên nếu sau 2 giây khung vẫn rỗng thì hiện lời nhắc thay vì để trắng. */
  function watchFrame() {
    var f = document.getElementById('dev-frame');
    if (!f) return;
    var ok = false;
    f.addEventListener('load', function () { ok = true; });
    setTimeout(function () {
      if (ok) return;
      var note = document.getElementById('dev-fallback');
      if (note) note.hidden = false;
    }, 2000);
  }

  /* ---------- Định tuyến (chỉ ở bản gói một trang) ---------- */
  var pageSubs = [];
  function route() {
    var P = PAGES[page];
    var host = document.getElementById('app');
    if (!P || !host) return;

    // Gỡ mọi đăng ký của màn trước, tránh tích lũy trình nghe qua mỗi lần đổi hash
    pageSubs.splice(0).forEach(function (off) { try { off(); } catch (e) {} });

    document.title = P.title;
    document.body.setAttribute('data-page', P.nav || '');
    document.body.setAttribute('data-shell', P.shell || 'app');
    host.innerHTML = expand(P.html);

    sync();
    mount();

    // Mã riêng của từng màn — build ghi sẵn dưới dạng chuỗi, chạy sau khi DOM đã vào chỗ.
    // Ở chế độ khung thiết bị, mount() đã thay #page bằng iframe nên không còn phần tử
    // nào cho mã trang bám vào — chạy sẽ ném lỗi ở cả 20 màn.
    if (P.js && !framed()) {
      try { (new Function(expand(P.js)))(); }
      catch (e) { console.error('Lỗi mã của màn ' + page, e); }
    }

    var at = qs.get('at');
    var target = at && document.getElementById(at);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  /* Đồng bộ trạng thái đang đọc ra đối tượng công khai */
  function sync() {
    window.RECO.role = role;
    window.RECO.current = R;
    window.RECO.page = page;
  }

  window.RECO = Object.assign(window.RECO || {}, {
    role: role, roles: ROLES, current: R, page: page,
    svg: svg, link: link, toast: toast, asset: asset, assetBase: assetBase,
    openModal: openModal, closeModal: closeModal, applyRoles: applyRoles,
    confirm: confirmBox, guardLabel: guardLabel, busy: busy, validate: validate, fieldError: fieldError,
    copy: copy, copyWithToast: copyWithToast, confirmBar: confirmBar, today: today, now: now,
    download: download, downloadWithToast: downloadWithToast,
    /* Đọc tham số của màn ở cả bản nhiều trang (?q=) lẫn bản gói (#du-an?q=) */
    param: function (name) {
      var h = location.hash, i = h.indexOf('?');
      var fromHash = i >= 0 ? new URLSearchParams(h.slice(i + 1)).get(name) : null;
      return fromHash || new URLSearchParams(location.search).get(name) || '';
    },
    /* Màn đang được nhúng trong khung điện thoại / máy tính bảng — mã màn nên thoát sớm */
    get embedded() { return framed(); },
    search: search, norm: norm, trackRecent: trackRecent,
    bindSlide: bindSlide,
    renderBell: renderBell, roleOf: roleOf,
    /* Đăng ký vẽ lại theo kho, tự hủy khi bản gói chuyển sang màn khác.
       Dùng RECO.store.on trực tiếp sẽ tích lũy trình nghe qua mỗi lần đổi hash. */
    onPage: function (name, fn) {
      if (!window.RECO.store) return function () {};
      var off = window.RECO.store.on(name, fn);
      pageSubs.push(off);
      return off;
    },
    /* Vẽ lại vỏ + panel sau khi màn tự dựng lại nội dung */
    refresh: function (root) { applyRoles(root); initTabs(root); },
    /* Mã của từng màn gọi qua đây. Bản nhiều trang viết
       document.addEventListener('DOMContentLoaded', fn); build đổi thành RECO.run(fn). */
    run: function (fn) { fn(); }
  });

  function boot() {
    // Phím Escape đóng drawer, modal và gợi ý (i) — gắn một lần cho cả phiên
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeDrawer();
      document.querySelectorAll('.modal:not([hidden])').forEach(function (m) { closeModal(m); });
      document.querySelectorAll('[data-tip][aria-expanded="true"]').forEach(function (x) {
        x.setAttribute('aria-expanded', 'false');
      });
    });

    installDelegation();

    if (BUNDLE) {
      window.addEventListener('hashchange', function () { readState(); route(); });
      route();
    } else {
      mount();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
