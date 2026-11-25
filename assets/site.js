// Quick request form: composes a WhatsApp message from the fields and opens it.
// Nothing is stored or sent by this website.
(function () {
  var L = {
    fr: { hello: "Bonjour,", trip: "Excursion", date: "Date souhaitée", people: "Voyageurs", note: "Message", flex: "dates flexibles", end: "Pouvez-vous me confirmer les disponibilités ?" },
    en: { hello: "Hello,", trip: "Excursion", date: "Preferred date", people: "Travellers", note: "Message", flex: "flexible dates", end: "Could you confirm availability?" }
  };
  function fmt(d, lang) {
    if (!d) return "";
    var p = d.split("-");
    return lang === "fr" ? p[2] + "/" + p[1] + "/" + p[0] : d;
  }
  document.querySelectorAll("form.ask").forEach(function (form) {
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
      var t = new Date();
      dateInput.min = t.toISOString().slice(0, 10);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var lang = form.dataset.lang === "en" ? "en" : "fr";
      var l = L[lang];
      var f = new FormData(form);
      var lines = [l.hello, ""];
      if (f.get("trip")) lines.push(l.trip + " : " + f.get("trip"));
      lines.push(l.date + " : " + (fmt(f.get("date"), lang) || l.flex));
      if (f.get("people")) lines.push(l.people + " : " + f.get("people"));
      if ((f.get("note") || "").trim()) lines.push(l.note + " : " + f.get("note").trim());
      lines.push("", l.end);
      var url = "https://wa.me/" + form.dataset.wa + "?text=" + encodeURIComponent(lines.join("\n"));
      var w = window.open(url, "_blank", "noopener");
      if (!w) window.location.href = url;
    });
  });
})();

// Animated route maps: draw when scrolled into view, replay on demand.
(function () {
  var maps = document.querySelectorAll("[data-map]");
  if (!maps.length) return;
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function play(fig) {
    fig.classList.remove("go");
    void fig.offsetWidth;
    fig.classList.add("go");
    if (!still) fig.querySelectorAll("animateMotion").forEach(function (a) { try { a.beginElement(); } catch (e) {} });
  }
  maps.forEach(function (fig) {
    fig.classList.add("armed");
    var btn = fig.querySelector(".m-replay");
    if (btn) btn.addEventListener("click", function () { play(fig); });
  });
  if (still || !("IntersectionObserver" in window)) { maps.forEach(play); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { play(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.35 });
  maps.forEach(function (fig) { io.observe(fig); });
})();
