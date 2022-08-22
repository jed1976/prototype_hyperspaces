import { interpret } from "../third_party/robot/machine.js";
import { toggleMachine } from "./toggle.js";


const machine = toggleMachine("collapsed", () => ({
  id: "accordion",
  name: "Accordion",
  template: {
    element: "div"
  }
}));

const service = interpret(machine, () => {
  window.dispatchEvent(new CustomEvent(`${service.context.id}:${service.machine.current}`, { detail: service }));
});


window.addEventListener("accordion:expanded", event => console.log(event.detail));
window.addEventListener("accordion:collapsed", event => console.log(event.detail));


service.send("toggle");

setTimeout(() => service.send("toggle"), 1000);

