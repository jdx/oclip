import { DenonConfig } from "https://deno.land/x/denon@2.4.4/mod.ts";

const config: DenonConfig = {
  scripts: {
    test: {
      cmd: "deno test",
      watch: true,
    },
  },
};

export default config;
