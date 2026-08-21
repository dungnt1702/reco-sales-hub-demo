/* Tab nội trang, modal hạng mục, lọc phạm vi — dùng chung ba hub Báo giá / Vận hành / Bản đồ. */
(function () {
  function $$ (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function catalog () {
    return (window.HUB_ITEMS || {});
  }

  function showPane (id) {
    if (!id) return;
    var panes = $$('[data-hub-pane]');
    if (!panes.length) return;
    var ok = false;
    panes.forEach(function (p) {
      var on = p.getAttribute('data-hub-pane') === id;
      p.hidden = !on;
      if (on) ok = true;
    });
    if (!ok) return;
    $$('[data-pane]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-pane') === id ? 'true' : 'false');
    });
  }

  function paneOfHash (hash) {
    if (!hash) return null;
    if (document.querySelector('[data-hub-pane="' + hash + '"]')) return hash;
    var el = document.getElementById(hash);
    if (el) {
      var p = el.closest('[data-hub-pane]');
      if (p) return p.getAttribute('data-hub-pane');
    }
    var btn = document.querySelector('[data-item="' + hash + '"]');
    if (btn) {
      var p2 = btn.closest('[data-hub-pane]');
      if (p2) return p2.getAttribute('data-hub-pane');
    }
    return null;
  }

  function escape (s) {
    return String(s || '').replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function fillModal (item, fallback) {
    var tag = document.getElementById('m-hub-tag');
    var title = document.getElementById('m-hub-t');
    var body = document.getElementById('m-hub-body');
    var cost = document.getElementById('m-hub-cost');
    var links = document.getElementById('m-hub-links');
    if (!title || !body) return;
    var it = item || {};
    if (tag) tag.textContent = it.tag || (fallback && fallback.tag) || 'Chi tiết';
    title.textContent = it.title || (fallback && fallback.title) || '';
    body.innerHTML = it.body || (fallback && fallback.body) || '';
    if (cost) {
      if (it.days || it.cost || it.list || it.after) {
        cost.hidden = false;
        cost.innerHTML =
          (it.days ? '<div><span class="k">' + escape(it.daysLabel || 'Ngày công') + '</span><span class="v">' + escape(it.days) + '</span></div>' : '') +
          (it.cost ? '<div><span class="k">' + escape(it.costLabel || 'Chi phí trước VAT') + '</span><span class="v">' + escape(it.cost) + '</span></div>' : '') +
          (it.list ? '<div><span class="k">' + escape(it.listLabel || 'Giá gốc') + '</span><span class="v">' + escape(it.list) + '</span></div>' : '') +
          (it.after ? '<div><span class="k">' + escape(it.afterLabel || 'Sau ưu đãi') + '</span><span class="v">' + escape(it.after) + '</span></div>' : '');
      } else {
        cost.hidden = true;
        cost.innerHTML = '';
      }
    }
    if (links) {
    var rows = (it.links && it.links.length) ? it.links : ((fallback && fallback.links) || []);
      links.innerHTML = rows.map(function (l) {
        return '<a class="btn btn-quiet btn-sm" href="' + escape(l.href) + '">' + escape(l.label) + '</a>';
      }).join(' ');
      links.hidden = !rows.length;
    }
  }

  function fallbackFromBtn (btn) {
    if (!btn) return {};
    var name = btn.querySelector('.tname');
    var title = name && name.querySelector('b') ? name.querySelector('b').textContent : (btn.textContent || '').trim();
    var d = name && name.querySelector('.d') ? name.querySelector('.d').textContent : '';
    var m = name && name.querySelector('.m') ? name.querySelector('.m').textContent : '';
    var scope = btn.getAttribute('data-scope');
    var tag = ({ gd1: 'Giai đoạn 1', part: 'Một phần ở GĐ1', bs: 'Ngoài gói', gd2: 'Giai đoạn 2' })[scope] || 'Chi tiết';
    var body = '';
    if (d) body += '<p class="small">' + escape(d) + '</p>';
    if (m) body += '<p class="micro muted mt-2">' + escape(m) + '</p>';
    var href = btn.getAttribute('data-screen');
    var label = btn.getAttribute('data-screen-label');
    return {
      tag: tag,
      title: title,
      body: body,
      links: href ? [{ href: href, label: label || 'Mở màn hình' }] : []
    };
  }

  function openItem (id) {
    var item = catalog()[id];
    var btn = document.querySelector('[data-item="' + id + '"]');
    fillModal(item, fallbackFromBtn(btn));
    if (window.RECO && RECO.openModal) RECO.openModal('m-hub');
  }

  function applyHash () {
    var hash = (location.hash || '').replace(/^#/, '');
    var pane = paneOfHash(hash);
    if (pane) showPane(pane);
    if (!hash) return;
    if (document.querySelector('[data-item="' + hash + '"]') || catalog()[hash]) {
      openItem(hash);
      return;
    }
    var el = document.getElementById(hash);
    if (el && !el.closest('.modal')) {
      requestAnimationFrame(function () { el.scrollIntoView({ block: 'start' }); });
    }
  }

  function applyScope () {
    var box = document.getElementById('scope-filters');
    if (!box) return;
    var on = {};
    $$('#scope-filters input[data-scope]').forEach(function (inp) {
      on[inp.getAttribute('data-scope')] = inp.checked;
    });
    $$('[data-scope-row]').forEach(function (row) {
      var sc = row.getAttribute('data-scope-row');
      row.hidden = !on[sc];
    });
    $$('.grp').forEach(function (grp) {
      var rows = $$('[data-scope-row]', grp);
      if (!rows.length) return;
      var vis = rows.some(function (r) { return !r.hidden; });
      grp.hidden = !vis;
    });
  }

  function bindScope () {
    var box = document.getElementById('scope-filters');
    if (!box) return;
    box.addEventListener('change', applyScope);
    var all = document.getElementById('scope-all');
    var none = document.getElementById('scope-none');
    if (all) all.addEventListener('click', function () {
      $$('#scope-filters input[data-scope]').forEach(function (inp) { inp.checked = true; });
      applyScope();
    });
    if (none) none.addEventListener('click', function () {
      $$('#scope-filters input[data-scope]').forEach(function (inp) { inp.checked = false; });
      applyScope();
    });
    applyScope();
  }

  function bind () {
    $$('[data-pane]').forEach(function (b) {
      if (b.tagName === 'A') return;
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-pane');
        showPane(id);
        if (history.replaceState) history.replaceState(null, '', '#' + id);
        else location.hash = id;
      });
    });
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-item]');
      if (!btn) return;
      var nested = e.target.closest('a[href]');
      if (nested && nested !== btn) return;
      e.preventDefault();
      var id = btn.getAttribute('data-item');
      if (history.replaceState) history.replaceState(null, '', '#' + id);
      else location.hash = id;
      openItem(id);
    });
    $$('#m-hub [data-x]').forEach(function (x) {
      x.addEventListener('click', function () {
        if (window.RECO && RECO.closeModal) RECO.closeModal('m-hub');
      });
    });
    var modal = document.getElementById('m-hub');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal && window.RECO && RECO.closeModal) RECO.closeModal(modal);
      });
    }
    window.addEventListener('hashchange', applyHash);
    bindScope();
    applyHash();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
