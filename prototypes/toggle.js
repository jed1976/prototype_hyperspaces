import { createMachine, state, transition } from "../third_party/robot/machine.js";

export const toggleMachine = (initial, context = () => ({})) => createMachine(initial, {
  collapsed: state(
    transition("toggle", "expanded")
  ),
  expanded: state(
    transition("toggle", "collapsed")
  )
}, context);
