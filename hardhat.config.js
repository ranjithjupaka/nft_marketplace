require("@nomiclabs/hardhat-waffle");
require("dotenv").config()

const PRIVATE_KEY = "e50a0c3a48e73db79cca36b764a7d00449d2e53b7d8a0e17bf4bc2c4ff42fe99"

module.exports = {
  defaultNetwork:"polygon_mumbai",
  networks:{
     hardhat:{},
     polygon_mumbai:{
      url:"https://polygon-mumbai.g.alchemy.com/v2/smDlhSOhj5A14QcZY29zd1eovNJVMvp4",
      accounts:[`0x${PRIVATE_KEY}`]
     }
  },
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
