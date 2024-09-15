import inquirer from "inquirer";
import fs from "fs";
import chalk from "chalk";


console.log(chalk.blue('iniciando code'));
main();

function main() {
    console.clear()

    inquirer.prompt({
        type: "list",
        message: "escolha uma opção:",
        choices: ["criar conta", "ver saldo", "sacar", "depositar", "sair"]
    }
    ).then((res) => {
        let resposta = res[""]

        if (resposta == "criar conta") {
            console.clear()
            criarConta()
        }

    }).catch(err => console.log(err))

}



function criarConta() {
    console.log(chalk.bgBlue.black("Criar conta"))
    inquirer.prompt({
        name: "resposta",
        message: "Digite um nome para sua Conta :"
    }).then((res) => {
        let resposta = res["resposta"];

        console.log(resposta)
    })
}