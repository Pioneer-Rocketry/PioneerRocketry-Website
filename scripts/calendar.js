
function repairEvent(event) {
    // Default values for missing fields
    const defaults = {
      id: null,
      groupId: null,
      allDay: false,
      start: null,
      end: null,
      daysOfWeek: null,
      startTime: null,
      endTime: null,
      startRecur: null,
      endRecur: null,
      title: "Untitled Event",
      url: null,
      interactive: true,
      className: null,
      classNames: null,
      editable: false,
      startEditable: false,
      durationEditable: false,
      resourceEditable: false,
      resourceId: null,
      resourceIds: null,
      display: null,
      overlap: false,
      constraint: null,
      color: "#000000",
      backgroundColor: "#000000",
      borderColor: "#000000",
      textColor: "#000000",
      rrule: null,
      duration: null,
    };

    // Ensure each property has a valid value, or use default
    for (const key in defaults) {
      if (
        !event.hasOwnProperty(key) ||
        event[key] === "" ||
        event[key] === "null"
      ) {
        event[key] = defaults[key];
      }
    }

    // Convert strings to boolean where necessary
    event.allDay = event.allDay === "true";
    event.interactive = event.interactive === "true";
    event.editable = event.editable === "true";
    event.startEditable = event.startEditable === "true";
    event.durationEditable = event.durationEditable === "true";
    event.resourceEditable = event.resourceEditable === "true";
    event.overlap = event.overlap === "true";

    // Convert daysOfWeek from string to array if necessary
    if (typeof event.daysOfWeek === "string") {
      try {
        event.daysOfWeek = JSON.parse(event.daysOfWeek);
      } catch (e) {
        event.daysOfWeek = null;
      }
    }

    // Convert classNames and resourceIds from string to array if necessary
    if (typeof event.classNames === "string") {
      try {
        event.classNames = JSON.parse(event.classNames);
      } catch (e) {
        event.classNames = null;
      }
    }
    if (typeof event.resourceIds === "string") {
      try {
        event.resourceIds = JSON.parse(event.resourceIds);
      } catch (e) {
        event.resourceIds = null;
      }
    }
    console.log(event)
    return event;
  }

  function repairEvents(events) {
    return events.map(repairEvent);
  }



  let calendar;
  document.addEventListener("DOMContentLoaded", function () {
    



    fetch("https://api.pioneerrocketry.com/calendar/get_all", {
      method: "GET",
      headers: { // Add this header to pull all data
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        const repairedEvents = repairEvents(data.result.events);

        const calendarEl = document.getElementById("calendar");
        calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          timeZone: "local",
          events: repairedEvents,
          themeSystem: "bootstrap5",
          height: "100%",
          contentHeight: "auto",
          expandRows: true,
        });
        console.log(repairedEvents);
        console.log("rendering calendar");
        calendar.render();
      })
      .catch((error) => {
        
        console.error("Error:", error)
        console.warn("Rendering Empty Calendar")
        const calendarEl = document.getElementById("calendar");
        calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          timeZone: "local",
          events: [],
          themeSystem: "bootstrap5",
          height: "100%",
          contentHeight: "auto",
          expandRows: true,
        });
        calendar.render();
      });

    document
      .getElementById("createEventSubmit")
      .addEventListener("click", async function (event) {
        console.log("form submitted");
        event.preventDefault(); // Prevent default form submission

        // Gather basic event data
        const formData = new FormData(
          document.getElementById("createEventForm")
        );
        const basicEventData = {
          title: formData.get("eventTitle"),
          start: formData.get("eventStartDate"),
          end: formData.get("eventEndDate"),
          description: formData.get("eventDescription"),
          // Add more basic fields as needed based on your form
        };

        // Gather advanced event data
        const advancedEventData = {
          id: formData.get("eventId"),
          groupId: formData.get("eventGroupId"),
          allDay: formData.get("eventAllDay") === "true",
          start: formData.get("eventStart"),
          end: formData.get("eventEnd"),
          daysOfWeek: formData.get("eventDaysOfWeek")
            ? JSON.parse(formData.get("eventDaysOfWeek"))
            : null,
          startTime: formData.get("eventStartTime"),
          endTime: formData.get("eventEndTime"),
          startRecur: formData.get("eventStartRecur"),
          endRecur: formData.get("eventEndRecur"),
          title: formData.get("eventTitle"),
          url: formData.get("eventUrl"),
          interactive: formData.get("eventInteractive") === "true",
          className: formData.get("eventClassName"),
          classNames: formData.get("eventClassNames")
            ? JSON.parse(formData.get("eventClassNames"))
            : null,
          editable: formData.get("eventEditable") === "true",
          startEditable: formData.get("eventStartEditable") === "true",
          durationEditable:
            formData.get("eventDurationEditable") === "true",
          resourceEditable:
            formData.get("eventResourceEditable") === "true",
          resourceId: formData.get("eventResourceId"),
          resourceIds: formData.get("eventResourceIds")
            ? JSON.parse(formData.get("eventResourceIds"))
            : null,
          display: formData.get("eventDisplay"),
          overlap: formData.get("eventOverlap") === "true",
          constraint: formData.get("eventConstraint"),
          color: formData.get("eventColor"),
          backgroundColor: formData.get("eventBackgroundColor"),
          borderColor: formData.get("eventBorderColor"),
          textColor: formData.get("eventTextColor"),
          rrule: formData.get("eventRrule"),
          duration: formData.get("eventDuration"),
          // Add more advanced fields as needed based on your form
        };

        const user = {
          name: window.user.name,
          email: window.user.email,
          id: window.user.id
        }

        // Combine basic and advanced data into a single object
        const eventData = { ...basicEventData, ...advancedEventData, ...user };
        console.log(eventData);
        try {
          // Send data to the backend for insertion into the database
          const response = await fetch("https://api.pioneerrocketry.com/calendar/create_event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          });

          if (!response.ok) {
            throw new Error("Failed to insert event");
          }

          // Handle success response
          console.log("New Event Inserted Successfully");

          // Optionally, close the modal or reset the form
          $("#createEventModal").modal("hide");
          this.reset(); // Reset the form fields
        } catch (error) {
          // Handle error
          console.error("Error inserting event:", error.message);
          // Optionally, display an error message to the user
        }
      });
  });
