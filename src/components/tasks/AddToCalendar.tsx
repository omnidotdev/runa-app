import dayjs from "dayjs";
import { CalendarPlusIcon } from "lucide-react";

import { dueHasTime } from "@/lib/util/dueDate";

/**
 * "Add to calendar" for a single task's due date: a downloadable `.ics`
 * (Apple/Outlook/any) and a Google Calendar template link. All client-side and
 * read-only (adding to your own calendar needs no edit permission). All-day due
 * dates become an all-day event; a timed due date (see `dueHasTime`) becomes a
 * one-hour timed event. Distinct from the subscribe feed: this is a one-off add
 * of a single task, not a live subscription.
 */
const AddToCalendar = ({
  title,
  dueDate,
}: {
  title: string;
  dueDate: string | Date;
}) => {
  const timed = dueHasTime(dueDate);
  const start = dayjs(dueDate);

  // ICS: all-day uses VALUE=DATE (DTEND = next day); timed uses a floating
  // local datetime with a 1h duration. Floating (no Z) so it lands on the
  // viewer's wall-clock, matching how Runa renders the due date.
  const icsDate = (value: dayjs.Dayjs) => value.format("YYYYMMDD");
  const icsDateTime = (value: dayjs.Dayjs) => value.format("YYYYMMDDTHHmmss");
  const escapeText = (value: string) =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/[,;]/g, (c) => `\\${c}`)
      .replace(/\n/g, "\\n");

  const dtStart = timed
    ? `DTSTART:${icsDateTime(start)}`
    : `DTSTART;VALUE=DATE:${icsDate(start)}`;
  const dtEnd = timed
    ? `DTEND:${icsDateTime(start.add(1, "hour"))}`
    : `DTEND;VALUE=DATE:${icsDate(start.add(1, "day"))}`;

  const downloadIcs = () => {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Runa//Task//EN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}@runa.omni.dev`,
      // DTSTAMP must be UTC; derive from the ISO string (no dayjs utc plugin)
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      dtStart,
      dtEnd,
      `SUMMARY:${escapeText(title)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.slice(0, 40) || "task"}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const googleDates = timed
    ? `${icsDateTime(start)}/${icsDateTime(start.add(1, "hour"))}`
    : `${icsDate(start)}/${icsDate(start.add(1, "day"))}`;
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title,
  )}&dates=${googleDates}`;

  const linkClass =
    "rounded-md border px-2 py-0.5 text-base-600 text-xs hover:bg-accent dark:text-base-300";

  return (
    <div className="flex items-center gap-1.5">
      <CalendarPlusIcon className="size-3.5 text-muted-foreground" />
      <button type="button" onClick={downloadIcs} className={linkClass}>
        .ics
      </button>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} no-underline`}
      >
        Google
      </a>
    </div>
  );
};

export default AddToCalendar;
