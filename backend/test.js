const response = await fetch(
  "https://youtu.be/FTzC_e5FQZA?si=fvB1dI9LTJZOuJ44"
);

const html = await response.text();

console.log(html);