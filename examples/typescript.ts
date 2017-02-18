import * as sekvens from "../build/sekvens";

sekvens.from(0)
  .to(100, 100)
  .on((value) => console.log(value)).go();
