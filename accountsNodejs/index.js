import inquirer from "inquirer";
import fs from "fs";
import chalk from "chalk";
import { type } from "os";

console.log(chalk.blue('iniciando code'));
main();

function main() {
    console.clear()

    inquirer.prompt({
        type: "list",
        message: "escolha uma opção:",
        choices: ["criar conta", "ver saldo", "sacar", "depositar", "sair"]
    }
    ).then((resposta) => {
        console.log(resposta[""])
    }).catch(err => console.log(err))
    // Código principal
}
