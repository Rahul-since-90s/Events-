import React, { useState, useEffect } from "react";
import data from "../../src/data/data.json";

export default function Events() {
  const [showEvent, setShowEvent] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  

  useEffect(() => {
    const storedEventIds = localStorage.getItem("selectedEvents");
    console.log('storedEventIds:', storedEventIds);
    if (storedEventIds) {
      const eventIds = JSON.parse(storedEventIds);
      const events = data.filter((event) => eventIds.includes(event.eventId));
      setSelectedEvents(events);
      setShowEvent(true);
    }
  }, []);
  useEffect(() => {
    if (window.localStorage.getItem("selectedEvents"))
      setSelectedEvents(JSON.parse(window.localStorage.getItem("selectedEvents")));
      console.log(JSON.parse(window.localStorage.getItem("selectedEvents")))
  }, []);

  useEffect(() => {
    window.localStorage.setItem("selectedEvents", JSON.stringify(selectedEvents));
  }, [selectedEvents]);
  const handleSelectEvent = (id) => {
    const event = data.find((event) => event.eventId === id);
    const selectedEventTimings = selectedEvents.map((selectedEvent) => ({
      start: selectedEvent.start_time,
      end: selectedEvent.end_time,
    }));
  
    if (
      !selectedEvents.find((selectedEvents) => selectedEvents.eventId === id)
    ) {
      if (
        !selectedEventTimings.some((timing) => {
          return (
            (timing.start >= event.start_time && timing.start < event.end_time) ||
            (timing.end > event.start_time && timing.end <= event.end_time) ||
            (timing.start <= event.start_time && timing.end >= event.end_time)
          );
        })
      ) 
      if (selectedEvents.length < 3) {
        setSelectedEvents([...selectedEvents, event]);
        setShowEvent(true);
      } else {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
    }else {
      alert("You have already selected an event with the same timings.");
    }
  };

  const handleDeselectEvent = (id) => {
    const updatedEvents = selectedEvents.filter(
      (event) => event.eventId !== id
    );
    setSelectedEvents(updatedEvents);
    if (updatedEvents.length === 0) {
      setShowEvent(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <section>
      <div className="container-fluid banner">
        <div className="container">
          <div className="row">
            <div className="bannerdiv">
            <div className="col-md-12">
            
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-5 mb-5">
        <div className="container">
          <div className="row">
            <div className="text-center event-details-color">Event Details</div>
            <div className="col-md-6">
              {data.map((event, index) => (
                <ul key={index}>
                  <li>
                    <div className="event-card">
                      <h4 className="text-center">{event.event_name}</h4>
                      <div className="card-body text-start">
                        <div className="card-title">
                          <h5>{event.event_category}</h5>
                          <div className="event-date">
                            <p className="card-link">
                              Start Time <span>{event.start_time}</span>
                            </p>
                            <p href="#" className="card-link">
                              End Time <span>{event.end_time}</span>
                            </p>
                          </div>
                          <button
                            className="btn btn-primary w-50"
                            onClick={() => handleSelectEvent(event.eventId)}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              ))}
            </div>
            <div className="col-md-6">
              {showEvent && selectedEvents.length > 0
                ? selectedEvents.map((event, index) => (
                    <div key={index} className="event-details">
                      <div>
                        <h4 className="text-center event-details-color">
                          Event Details
                        </h4>
                        <div className="card-body text-start">
                          <div className="card-title">
                            <h5 className="event-header-color">
                              {event.event_details_header}
                            </h5>
                            <p>{event.event_details}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary w-50"
                        onClick={() => handleDeselectEvent(event.eventId)}
                      >
                        Deselect
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <div
          className="alert fade alert-simple alert-info alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show"
          role="alert"
          data-brk-library="component__alert"
        >
          <button
            type="button"
            className="close font__size-18"
            data-dismiss="alert"
            onClick={handleCloseAlert}
          >
            <span aria-hidden="true">
              <i className="fa fa-times blue-cross"></i>
            </span>
            <span className="sr-only">Close</span>
          </button>
          <i className="start-icon  fa fa-info-circle faa-shake animated"></i>
          <strong className="font__weight-semibold">Heads up!</strong> You can
          only select a maximum of 3 events.
        </div>
      )}
    </section>
  );
}
