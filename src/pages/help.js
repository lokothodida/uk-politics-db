export const HelpPage = (db) => ({
  data() {
    return {
      tables: [],
    };
  },
  template: `<div>
    <h1 class="title">Help</h1>

    <h2 class="subtitle">List of all Tables</h2>

    <div v-for="table in tables">
        <h3><code>{{table.name}}</code></h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Column</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in table.values">
                    <td>{{row[1]}}</td>
                    <td>{{row[2]}}</td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>`,

  mounted() {
    this.tables = [].concat(this.load("table"), this.load("view"));
  },

  methods: {
    load(tableType) {
      const tableNames = db.exec(
        "SELECT DISTINCT(tbl_name) FROM sqlite_master WHERE type = ?",
        [tableType],
      );

      return tableNames[0].values.map(([name]) => {
        const results = db.exec(`PRAGMA TABLE_INFO(${name})`);
        return {
          name: name,
          ...results[0],
        };
      });
    },
  },
});
