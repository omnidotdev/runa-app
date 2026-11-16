---
"@omnidotdev/runa-app": patch
---

Fix several calendar and due date issues:

- All-day due dates now show on the same day for everyone, whatever their time zone, and no longer show up as a timed "7:00 AM" for teammates in other zones
- Dragging a timed task to another day on the calendar keeps its time
- The assignee filter now shows the tasks assigned to the selected people (it previously showed none) on the board, list, and calendar
- The calendar hides tasks in columns you have hidden, matching the board
- Overdue highlighting rolls over at midnight on a page left open, and the calendar marks the right day as today
- Regenerating a calendar feed link now asks for confirmation first, since it stops the current link from working
