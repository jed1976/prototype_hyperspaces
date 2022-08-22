function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import isArray from './isArray';
import is_logic from './is_logic';
import get_operator from './get_operator';
import arrayUnique from './arrayUnique';

function uses_data(logic) {
  var collection = [];

  if (is_logic(logic)) {
    var op = get_operator(logic);
    var values = logic[op];

    if (!isArray(values)) {
      values = [values];
    }

    if (op === 'var') {
      // This doesn't cover the case where the arg to var is itself a rule.
      collection.push(values[0]);
    } else {
      // Recursion!
      values.forEach(function (val) {
        collection.push.apply(collection, _toConsumableArray(uses_data(val)));
      });
    }
  }

  return arrayUnique(collection);
}

export default uses_data;