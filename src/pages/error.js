export const ErrorPage = {
  props: [
    "message",
  ],

  template: `<div>
        <h1 class="title">Unexpected Error!</h1>
        <p><code>{{message}}</code></p>
    </div>`,
};
