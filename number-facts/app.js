// part1
const baseUrl = "http://numbersapi.com";
const favNum = 8;

axios
  .get(`${baseUrl}/${favNum}?json`)
  .then((response) => {
    console.log(`${response.data.text}`);
  })
  .catch((err) => {
    console.log(`${err}`);
  });

// part2
const favNums = [3, 4, 8, 11];
Promise.all(favNums.map((num) => axios.get(`${baseUrl}/${num}?json`))).then(
  (facts) => {
    facts.forEach((fact) => {
      $("body").append(`<p>${fact.data.text}</p>`);
    });
  }
);

// part 3
let facts = [];

for (let i = 1; i <= 4; i++) {
  facts.push(axios.get(`${baseUrl}/${favNum}?json`));
}

Promise.all(facts).then((facts) => {
  facts.forEach((fact) => {
    $("body").append(`<p>${fact.data.text}</p>`);
  });
});
