import jsonLogic from "../../third_party/json-logic-js/dist/json_logic.esm.js";

/** Overwrites the default `jsonLogic.is_logic` function to be more exhaustive. */
jsonLogic.is_logic = function (logic) {
  return (
    logic.constructor.name === "Object" &&
    logic !== null &&
    (!logic.element && !logic.attribute && !logic.collection && !logic.content)
  );
}

export { jsonLogic }
