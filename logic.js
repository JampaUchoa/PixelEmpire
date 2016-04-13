  setInterval(calendar, 1000);
  year = 0;
  food = 100;
  gold = 0;
  population = 20;
  function calendar() { // handles events
    year = year + 1 / 15 // updates year
    $("#year").text("Year: "+ Math.floor(year))

  }
