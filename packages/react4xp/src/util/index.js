const print = require("q-i").print;

module.exports = {
  makeVerboseLogger: (VERBOSE) => (VERBOSE)
    ? (item, label) => {
      if (typeof item === 'object') {
        if (label) {
          console.log(label + ":");
        }
        print(item, {maxItems: Infinity});

      } else {
        console.log((label ? label + ": " : "") + JSON.stringify(item) + " (" + typeof item) + ")"
      }
    }
    : () => {}
}
