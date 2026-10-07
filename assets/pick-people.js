/* RECO Data-SalesHub — hộp "Chọn người dùng" dùng chung (QD-141, spec-00 V-14, reco-devops#393).

   Mọi chỗ gán một người vào một vị trí mở cùng một hộp: tìm theo tên (bỏ dấu) hoặc mã nhân viên,
   lọc Khối KD / Phòng / Chức danh, mỗi dòng có họ tên · chức danh · phòng · mã NV và chip "Đang giữ".
   Đang giữ vị trí khác KHÔNG chặn chọn (kiêm nhiệm luôn được phép). Chỉ người đã ở chính vị trí
   này ("Đã gán") hoặc vướng điều kiện riêng của vị trí (mờ, kèm lý do) mới không chọn được.

   Dựng bằng DOM + textContent — không ghép chuỗi HTML từ dữ liệu người dùng. */
(function () {
  'use strict';

  /* Người mẫu — tên và mã giả (QD-072). Hai "Nguyễn Văn An" khác chức danh, khác phòng. */
  var PEOPLE = [
    { id: 'p01', name: 'Nguyễn Văn An', title: 'Chuyên viên kinh doanh', dept: 'Phòng KD 3', block: 'Dự án Hà Nội', code: 'RC00123', also: [], holds: [] },
    { id: 'p02', name: 'Nguyễn Văn An', title: 'Trưởng phòng kinh doanh', dept: 'Phòng KD 7', block: 'Dự án Tỉnh', code: 'RC00456', also: ['Phòng KD 9'], holds: ['Trưởng phòng KD · Phòng KD 7', 'Trưởng phòng KD · Phòng KD 9'] },
    { id: 'p03', name: 'Trần Thị Bình', title: 'Thư ký kinh doanh', dept: 'Back Office', block: 'Khối Văn phòng', code: 'RC00159', also: [], holds: ['Thư ký KD · toàn công ty'] },
    { id: 'p04', name: 'Hoàng Anh Tuấn', title: 'Giám đốc kinh doanh', dept: 'Phòng KD 1', block: 'Dự án Hà Nội', code: 'RC00021', also: [], holds: ['Quản lý khối Dự án Hà Nội', 'Giám đốc dự án · Celestine', 'Giám đốc dự án · La Perle', 'Giám đốc dự án · Palmy'] },
    { id: 'p05', name: 'Phạm Hải Đăng', title: 'Trưởng phòng kinh doanh', dept: 'Phòng KD 3', block: 'Dự án Hà Nội', code: 'RC00087', also: [], holds: ['Trưởng phòng KD · Phòng KD 3'] },
    { id: 'p06', name: 'Lê Thu Hà', title: 'Chuyên viên kinh doanh', dept: 'Phòng KD 3', block: 'Dự án Hà Nội', code: 'RC00134', also: [], holds: [] },
    { id: 'p07', name: 'Đỗ Bảo Ngọc', title: '', dept: 'Phòng Marketing', block: 'Khối Văn phòng', code: '', also: [], holds: [] },
    { id: 'p08', name: 'Vũ Kim Chi', title: 'Chuyên viên nhân sự', dept: 'Phòng HCNS', block: 'Khối Văn phòng', code: 'RC00045', also: [], holds: ['HCNS · toàn công ty'] },
    { id: 'p09', name: 'Ngô Thanh Bình', title: 'Chuyên viên kinh doanh', dept: 'Phòng KD 7', block: 'Dự án Tỉnh', code: 'RC00211', also: ['Phòng KD 3'], holds: [] },
    { id: 'p10', name: 'Trần Minh Quang', title: 'Tổng giám đốc', dept: 'Ban TGĐ', block: 'Khối Điều hành', code: 'RC00001', also: [], holds: ['Tổng giám đốc'] },
    { id: 'p11', name: 'Bùi Thị Lan', title: 'Chuyên viên kinh doanh', dept: 'Phòng KD 9', block: 'Dự án Tỉnh', code: 'RC00302', also: [], holds: [] },
    { id: 'p12', name: 'Đinh Quốc Huy', title: 'Phó phòng kinh doanh', dept: 'Phòng KD 1', block: 'Dự án Hà Nội', code: 'RC00099', also: [], holds: [] },
    { id: 'p13', name: 'Lý Minh Châu', title: 'Chuyên viên kinh doanh', dept: 'Phòng KD 5', block: 'Cho thuê', code: 'RC00377', also: [], holds: [] },
    { id: 'p14', name: 'Mai Xuân Trường', title: 'Chuyên viên kinh doanh', dept: 'Phòng KD 5', block: 'Cho thuê', code: 'RC00378', also: [], holds: [] }
  ];
  var PAGE = 8;
  var MAX_CHIPS = 3;

  function fold(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function uniq(list) { return list.filter(function (v, i) { return v && list.indexOf(v) === i; }).sort(function (a, b) { return a.localeCompare(b, 'vi'); }); }
  function deptText(p) {
    return [p.dept].concat(p.also.map(function (d) { return 'kiêm ' + d; })).join(' · ');
  }
  function describe(p) {
    return [p.name, p.title || 'Chưa có chức danh', deptText(p), p.code].filter(Boolean).join(' · ');
  }

  /* o: { title, mode: 'single'|'multi', confirm: (n) => string, assigned: [id], blocked: {id: lý do},
          only: [tên phòng] (trưởng phòng chỉ thấy phòng mình), onConfirm: (people) => void } */
  function pickPeople(o) {
    var assigned = o.assigned || [];
    var blocked = o.blocked || {};
    var pool = PEOPLE.filter(function (p) {
      return !o.only || o.only.indexOf(p.dept) >= 0 || p.also.some(function (d) { return o.only.indexOf(d) >= 0; });
    });
    var picked = [];
    var shown = PAGE;
    var state = { q: '', block: '', dept: '', title: '' };

    var old = document.getElementById('m-pick');
    if (old) old.remove();
    var m = el('div', 'modal pp');
    m.id = 'm-pick';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'm-pick-t');
    var box = el('div', 'modal-box pp-box');
    var head = el('div', 'modal-head');
    var h = el('div');
    h.appendChild(el('span', 'eyebrow', 'Chọn người dùng'));
    var h3 = el('h3', null, o.title);
    h3.id = 'm-pick-t';
    h.appendChild(h3);
    var x = el('button', 'icon-btn');
    x.type = 'button';
    x.setAttribute('aria-label', 'Đóng hộp thoại');
    x.innerHTML = RECO.svg('x');
    head.appendChild(h);
    head.appendChild(x);

    var body = el('div', 'modal-body pp-body');
    var search = el('input', 'inp');
    search.type = 'search';
    search.maxLength = 100;
    search.placeholder = 'Tìm theo tên hoặc mã nhân viên';
    search.setAttribute('aria-label', 'Tìm theo tên hoặc mã nhân viên');
    var filters = el('div', 'pp-filters');
    function select(label, key, values) {
      var s = el('select', 'inp');
      s.setAttribute('aria-label', label);
      var all = el('option', null, 'Mọi ' + label.toLowerCase());
      all.value = '';
      s.appendChild(all);
      values.forEach(function (v) {
        var n = pool.filter(function (p) {
          return key === 'block' ? p.block === v : key === 'dept' ? (p.dept === v || p.also.indexOf(v) >= 0) : p.title === v;
        }).length;
        var opt = el('option', null, v + ' (' + n + ')');
        opt.value = v;
        s.appendChild(opt);
      });
      s.addEventListener('change', function () { state[key] = s.value; shown = PAGE; draw(true); });
      filters.appendChild(s);
      return s;
    }
    var sBlock = select('Khối', 'block', uniq(pool.map(function (p) { return p.block; })));
    var sDept = select('Phòng', 'dept', uniq(pool.reduce(function (a, p) { return a.concat([p.dept], p.also); }, []).filter(function (d) { return !o.only || o.only.indexOf(d) >= 0; })));
    var sTitle = select('Chức danh', 'title', uniq(pool.map(function (p) { return p.title; })));
    var clear = el('button', 'pp-clear');
    clear.type = 'button';
    var chips = el('ul', 'pp-picked');
    chips.setAttribute('aria-label', 'Đã chọn');
    var list = el('div', 'pp-list');
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', o.title);
    if (o.mode === 'multi') list.setAttribute('aria-multiselectable', 'true');
    body.appendChild(search);
    body.appendChild(filters);
    body.appendChild(clear);
    body.appendChild(chips);
    body.appendChild(list);

    var foot = el('div', 'modal-foot');
    var cancel = el('button', 'btn btn-outline', 'Huỷ');
    cancel.type = 'button';
    var ok = el('button', 'btn btn-primary');
    ok.type = 'button';
    foot.appendChild(cancel);
    foot.appendChild(ok);

    box.appendChild(head);
    box.appendChild(body);
    box.appendChild(foot);
    m.appendChild(box);
    document.body.appendChild(m);
    var back = document.activeElement;
    document.body.style.overflow = 'hidden';

    function close() {
      m.remove();
      if (!document.querySelector('.modal:not([hidden])')) document.body.style.overflow = '';
      if (back && back.isConnected) back.focus();
    }
    function matches(p) {
      var q = fold(state.q.trim());
      if (q && fold(p.name).indexOf(q) < 0 && fold(p.code).indexOf(q) < 0) return false;
      if (state.block && p.block !== state.block) return false;
      if (state.dept && p.dept !== state.dept && p.also.indexOf(state.dept) < 0) return false;
      if (state.title && p.title !== state.title) return false;
      return true;
    }
    function stateOf(p) {
      if (assigned.indexOf(p.id) >= 0) return { kind: 'assigned', text: 'Đã gán' };
      if (blocked[p.id]) return { kind: 'blocked', text: blocked[p.id] };
      return { kind: 'available', text: '' };
    }
    function toggle(p) {
      if (stateOf(p).kind !== 'available') return;
      var i = picked.indexOf(p);
      if (o.mode === 'single') picked = i >= 0 ? [] : [p];
      else if (i >= 0) picked.splice(i, 1);
      else picked.push(p);
      draw(false);
    }
    function row(p) {
      var st = stateOf(p);
      var sel = picked.indexOf(p) >= 0;
      var b = el('button', 'pp-row' + (sel ? ' is-on' : '') + (st.kind !== 'available' ? ' is-off' : ''));
      b.type = 'button';
      b.setAttribute('role', 'option');
      b.setAttribute('aria-selected', sel ? 'true' : 'false');
      b.setAttribute('aria-disabled', st.kind !== 'available' ? 'true' : 'false');
      b.setAttribute('aria-label', [describe(p), st.text].filter(Boolean).join(' — '));
      b.dataset.state = st.kind;
      var mark = el('span', 'pp-mark' + (o.mode === 'single' ? ' is-radio' : ''));
      mark.setAttribute('aria-hidden', 'true');
      if (sel) mark.innerHTML = RECO.svg('check');
      var txt = el('span', 'pp-txt');
      var line1 = el('span', 'pp-l1');
      line1.appendChild(el('b', null, p.name));
      if (st.text) line1.appendChild(el('span', 'pp-st', st.text));
      txt.appendChild(line1);
      txt.appendChild(el('span', 'pp-l2', [p.title || 'Chưa có chức danh', deptText(p), p.code].filter(Boolean).join(' · ')));
      if (p.holds.length) {
        var c = el('span', 'pp-holds');
        p.holds.slice(0, MAX_CHIPS).forEach(function (hd) { c.appendChild(el('span', 'pp-hold', 'Đang giữ: ' + hd)); });
        if (p.holds.length > MAX_CHIPS) {
          var more = el('span', 'pp-hold', '+' + (p.holds.length - MAX_CHIPS));
          more.title = p.holds.slice(MAX_CHIPS).join(', ');
          c.appendChild(more);
        }
        txt.appendChild(c);
      }
      b.appendChild(mark);
      b.appendChild(txt);
      b.addEventListener('click', function () { toggle(p); });
      return b;
    }
    var timer = null;
    function draw(withPause) {
      var active = ['q', 'block', 'dept', 'title'].filter(function (k) { return state[k]; }).length;
      clear.hidden = active === 0;
      clear.textContent = 'Bỏ lọc (' + active + ')';
      chips.textContent = '';
      chips.hidden = o.mode !== 'multi' || picked.length === 0;
      picked.forEach(function (p) {
        var li = el('li', 'pp-chip');
        var name = el('span', null, p.name);
        name.title = describe(p);
        var rm = el('button', 'pp-chip-x');
        rm.type = 'button';
        rm.setAttribute('aria-label', 'Bỏ chọn ' + p.name);
        rm.innerHTML = RECO.svg('x');
        rm.addEventListener('click', function () { toggle(p); });
        li.appendChild(name);
        li.appendChild(rm);
        chips.appendChild(li);
      });
      ok.disabled = picked.length === 0;
      ok.textContent = o.confirm(picked.length);

      function fill() {
        list.textContent = '';
        list.removeAttribute('aria-busy');
        var rows = pool.filter(matches).sort(function (a, b) { return a.name.localeCompare(b.name, 'vi') || a.code.localeCompare(b.code); });
        if (!rows.length) {
          var empty = el('div', 'pp-empty');
          empty.appendChild(el('p', 'muted', active ? 'Không có người phù hợp.' : 'Chưa có người dùng đang hoạt động nào nhận được vị trí này.'));
          if (active) {
            var reset = el('button', 'btn btn-outline btn-sm', 'Bỏ lọc');
            reset.type = 'button';
            reset.addEventListener('click', resetFilters);
            empty.appendChild(reset);
          }
          list.appendChild(empty);
          return;
        }
        rows.slice(0, shown).forEach(function (p) { list.appendChild(row(p)); });
        if (rows.length > shown) {
          var more = el('button', 'pp-more', 'Xem thêm (' + (rows.length - shown) + ')');
          more.type = 'button';
          more.addEventListener('click', function () { shown += PAGE; draw(false); });
          list.appendChild(more);
        }
      }
      if (!withPause) { fill(); return; }
      /* V-13: nhịp chờ "Đang lọc…" mỗi lần đổi tìm hoặc lọc */
      list.textContent = '';
      list.setAttribute('aria-busy', 'true');
      list.appendChild(el('div', 'pp-empty muted', 'Đang lọc…'));
      clearTimeout(timer);
      timer = setTimeout(fill, 300);
    }
    function resetFilters() {
      state = { q: '', block: '', dept: '', title: '' };
      search.value = '';
      sBlock.value = '';
      sDept.value = '';
      sTitle.value = '';
      shown = PAGE;
      draw(true);
    }

    search.addEventListener('input', function () { state.q = search.value; shown = PAGE; draw(true); });
    clear.addEventListener('click', resetFilters);
    list.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var rows = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
      var i = rows.indexOf(document.activeElement);
      var next = rows[e.key === 'ArrowDown' ? i + 1 : Math.max(i - 1, 0)];
      if (next) { e.preventDefault(); next.focus(); }
    });
    m.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    x.addEventListener('click', close);
    cancel.addEventListener('click', close);
    ok.addEventListener('click', function () {
      var chosen = picked.slice();
      RECO.busy(ok, 'Đang gán…', 600, function () {
        close();
        if (o.onConfirm) o.onConfirm(chosen);
      });
    });

    draw(false);
    search.focus();
    return m;
  }

  window.RECO = Object.assign(window.RECO || {}, { pickPeople: pickPeople, PICK_PEOPLE: PEOPLE, describePerson: describe });
})();
