import { crawlAllGreenhouseCompanies } from "./adapters/greenhouse.js";

await crawlAllGreenhouseCompanies();

console.log("Greenhouse crawl complete");
process.exit(0);