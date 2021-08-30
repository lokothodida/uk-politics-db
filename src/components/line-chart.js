import "chart.js";

export const LineChart = {
  props: ["height", "width", "title", "data"],

  template: `<canvas :height="height" :width="width"></canvas>`,

  mounted() {
    const groupedData = {};

    this.data.map((item) => {
      const dataSet = groupedData[item.series];
      if (!dataSet) {
        groupedData[item.series] = [];
      }

      groupedData[item.series].push(item);
    });

    const dataSets = [];
    let labels = [];
    let countedLabels = false;

    for (const seriesName in groupedData) {
      const series = groupedData[seriesName];

      if (!countedLabels) {
        labels = series.map((item) => item.x);
        countedLabels = true;
      }

      dataSets.push({
        data: series.map((item) => item.y),
        label: series[0].series,
        borderColor: series[0].colour,
        tension: 0,
        fill: false,
      });
    }

    new Chart(this.$el.getContext("2d"), {
      type: "line",
      data: {
        labels: labels,
        datasets: dataSets,
      },
    });
  },
};
