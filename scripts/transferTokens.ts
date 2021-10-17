import { getAllTokens } from "./helpers/getTokens";

async function main() {
  await getAllTokens();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
