import "https://www.unpkg.com/codemirror@5.62.3/lib/codemirror.js";
import "https://www.unpkg.com/codemirror@5.62.3/mode/sql/sql.js";

export const CodeEditor = {
  props: [
    "mode",
  ],

  data() {
    return {
      instance: null,
    };
  },

  template: `<textarea>{{$attrs.value}}</textarea>`,

  mounted() {
    this.instance = CodeMirror.fromTextArea(this.$el, {
      lineNumbers: true,
      mode: this.mode,
    });
    this.instance.on("changes", () => {
      this.$emit("input", this.instance.getValue());
    });
  },
};
