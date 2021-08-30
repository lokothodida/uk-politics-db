import "codemirror/lib/codemirror.js";
import "codemirror/mode/sql/sql.js";

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
