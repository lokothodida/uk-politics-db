const examples = {
  "2019 General Election Vote Share": `SELECT
	sum(votes) as value,
    party as label,
    colour
FROM general_elections, parties
WHERE date = '2019' AND party = parties.id
GROUP BY party
ORDER BY value DESC;`,
};

export const ExamplesPage = {
  data() {
    return {
      examples,
    };
  },
  name: "ExamplesPage",
  template: `<div>
      <h1 class="title">Examples</h1>

      <div class="content">
        <ul>
          <li v-for="(query, name) in examples">
            <router-link :to="url(query)">{{name}}</router-link>
          </li>
        </ul>
      </div>
    </div>`,

  methods: {
    url(query) {
      return {
        name: "home",
        query: {
          query: encodeURIComponent(query),
        },
      };
    },
  },
};
