!(function (e) {
    function i(e) {
        return e.toISOString().replace(/-|:|\.\d+/g, "");
    }
    function d(e) {
        return e.end ? i(e.end) : i(new Date(e.start.getTime() + 6e4 * e.duration));
    }
    function n(o, e, a) {
        var t = document.createElement("div");
        return (
            (t.innerHTML = '<label for="checkbox-for-' + a + '" class="add-to-calendar-checkbox">Pick a Calendar</label>'),
            (t.innerHTML += '<input name="add-to-calendar-checkbox" class="add-to-calendar-checkbox" id="checkbox-for-' + a + '" type="checkbox">'),
            Object.keys(o).forEach(function (e) {
                t.innerHTML += o[e];
            }),
            (t.className = "add-to-calendar"),
            void 0 !== e && (t.className += " " + e),
            document.getElementById("ouical-css") || document.getElementsByTagName("head")[0].appendChild(r()),
            (t.id = a),
            t
        );
    }
    var c = {
            google: function (e) {
                var o = i(e.start),
                    a = d(e);
                return (
                    '<a class="icon-google" target="_blank" href="' +
                    encodeURI(
                        [
                            "https://www.google.com/calendar/render",
                            "?action=TEMPLATE",
                            "&text=" + (e.title || ""),
                            "&dates=" + (o || ""),
                            "/" + (a || ""),
                            "&details=" + (e.description || ""),
                            "&location=" + (e.address || ""),
                            "&sprop=&sprop=name:",
                        ].join("")
                    ) +
                    '">Google</a>'
                );
            },
            yahoo: function (e) {
                var o = e.end ? (e.end.getTime() - e.start.getTime()) / 6e4 : e.duration,
                    a = (o < 600 ? "0" + Math.floor(o / 60) : Math.floor(o / 60) + "") + (o % 60 < 10 ? "0" + (o % 60) : (o % 60) + ""),
                    t = i(new Date(e.start - 6e4 * e.start.getTimezoneOffset())) || "";
                return (
                    '<a class="icon-yahoo" target="_blank" href="' +
                    encodeURI(["http://calendar.yahoo.com/?v=60&view=d&type=20", "&title=" + (e.title || ""), "&st=" + t, "&dur=" + (a || ""), "&desc=" + (e.description || ""), "&in_loc=" + (e.address || "")].join("")) +
                    '">Yahoo!</a>'
                );
            },
            ics: function (e, o, a) {
                var t = i(e.start),
                    n = d(e);
                let icsMSG = encodeURI("data:text/calendar;charset=utf8," + [
                      "BEGIN:VCALENDAR",
                      "VERSION:2.0",
                      "BEGIN:VEVENT",
                      "URL:" + document.URL,
                      "DTSTART:" + (t || ""),
                      "DTEND:" + (n || ""),
                      "SUMMARY:" + (e.title || ""),
                      "DESCRIPTION:" + (e.description || ""),
                      "LOCATION:" + (e.address || ""),
                      "END:VEVENT",
                      "END:VCALENDAR",
                  ].join("\n"))

                let blob = new Blob([icsMSG], { type: 'text/calendar;charset=utf-8' });
                return (`<a class="${o}" target="_blank" download="Calendar-event.ics" href="${icsMSG}">${a}</a>`);
            },
            ical: function (e) {
                return this.ics(e, "icon-ical", "iCal");
            },
            outlook: function (e) {
                return this.ics(e, "icon-outlook", "Outlook");
            },
        },
        r = function () {
            var e = document.createElement("style");
            return (
                (e.id = "ouical-css"),
                (e.innerHTML =
                    "#add-to-calendar-checkbox-label{cursor:pointer}.add-to-calendar-checkbox~a{display:none}.add-to-calendar-checkbox:checked~a{display:block;width:150px;margin-left:20px}input[type=checkbox].add-to-calendar-checkbox{position:absolute;top:-9999px;left:-9999px}.add-to-calendar-checkbox~a:before{width:16px;height:16px;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAQCAYAAACIoli7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0MzJCRDU2NUE1MDIxMUUyOTY1Q0EwNTkxNEJDOUIwNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0MzJCRDU2NkE1MDIxMUUyOTY1Q0EwNTkxNEJDOUIwNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQzMkJENTYzQTUwMjExRTI5NjVDQTA1OTE0QkM5QjA0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQzMkJENTY0QTUwMjExRTI5NjVDQTA1OTE0QkM5QjA0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+1Gcb3QAACh1JREFUeNrEWAtw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);margin-right:.5em;content:' '}.icon-ical:before{background-position:-68px 0}.icon-outlook:before{}.icon-yahoo:before{background-position:-36px +4px}.icon-google:before{background-position:-52px 0}"),
                e
            );
        };
    e.createCalendar = function (e) {
        var o, a, t;
        if (void 0 !== (o = e).data && void 0 !== o.data.start && (void 0 !== o.data.end || void 0 !== o.data.duration))
            return n(
                ((t = e.data), { google: c.google(t), yahoo: c.yahoo(t), ical: c.ical(t), outlook: c.outlook(t) }),
                (function (e) {
                    if (e.options && e.options.class) return e.options.class;
                })(e),
                (a = e).options && a.options.id ? a.options.id : Math.floor(1e6 * Math.random())
            );
        console.log("Event details missing.");
    };
})(this);
