const hlt = require("./hlt");
const logging = require("./hlt/logging");
const Niffler = require("./niffler");
const game = new hlt.Game();
const args = require("yargs").argv;
const niffler = new Niffler(logging, args);

game.initialize().then(async () => {
    await game.ready("KeithBotBINARY_SPACE");
    logging.info(process.argv);
    logging.info(`My Player ID is ${game.myId}.`);

    while (true) {
        await game.updateFrame();
        const commandQueue = niffler.getNextMoves("BINARY_SPACE", game);
        await game.endTurn(commandQueue);
    }
});
