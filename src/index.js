import "./index.scss"

console.log("is root js file");

$(document).ready(function () {
  console.log("dom is loaded, jQuery is worked");
});

console.log("env variable", process.env.NODE_ENV)
