import fs from "node:fs";
import { demoji, enmoji } from "./demoji";

const method = process.argv[2];

const source = fs.readFileSync("./index.ejo");

let string: string;
if (method === "text") {
    string = demoji(source.toString());
} else {
    string = enmoji(source.toString());
}

fs.writeFileSync("./index.ejo", string);

console.log("Done!");
