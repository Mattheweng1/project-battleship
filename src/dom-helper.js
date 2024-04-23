const eventLog = document.getElementById("eventLog");

// Log messages in Event Log

function logErrorEvent(errMsg) {
  const errorEvents = document.querySelectorAll(".errorEvent");
  const oldErrorEvent = [...errorEvents].find((errorEvent) => {
    return errorEvent.innerText === errMsg;
  });
  if (oldErrorEvent) {
    eventLog.prepend(oldErrorEvent);
    flashClassEvent("errorEvent");
  } else {
    const newErrorEvent = document.createElement("div");
    newErrorEvent.classList.add("event");
    newErrorEvent.classList.add("errorEvent");
    newErrorEvent.textContent = errMsg;
    eventLog.prepend(newErrorEvent);
    flashClassEvent("errorEvent");
  }
}

function logTurnEvent(turn, msg) {
  const newTurnEvent = document.createElement("div");
  newTurnEvent.classList.add("event");
  newTurnEvent.classList.add("turnEvent");
  newTurnEvent.innerText = turn + "  :  " + msg;
  eventLog.prepend(newTurnEvent);
  flashClassEvent("turnEvent");
}

function logInfoEvent(msg) {
  const newInfoEvent = document.createElement("div");
  newInfoEvent.classList.add("event");
  newInfoEvent.classList.add("infoEvent");
  newInfoEvent.innerText = msg;
  eventLog.prepend(newInfoEvent);
  flashClassEvent("infoEvent");
}

// Flash Event Log messages

function flashClassEvent(className) {
  const firstClassEvent = document.querySelector("." + className);
  eventLog.prepend(firstClassEvent);
  firstClassEvent.classList.add("flash");
  setTimeout(() => {
    firstClassEvent.classList.remove("flash");
  }, 100);
  firstClassEvent.scrollIntoView(false);
}

export { logErrorEvent, logTurnEvent, logInfoEvent, flashClassEvent };
