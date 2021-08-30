import "chart.js";

export const PieChart = {
  props: ["height", "width", "title", "data"],

  template: `<canvas :height="height" :width="width"></canvas>`,

  mounted() {
    const labels = this.data.map((item) => item.label);
    const data = this.data.map((item) => item.value);
    const colour = this.data.map((item) => item.colour);

    new Chart(this.$el.getContext("2d"), {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          label: this.title,
          data: data,
          backgroundColor: colour,
          hoverOffset: 4,
        }],
      },
    });
  },
};
