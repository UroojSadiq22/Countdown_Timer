#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { differenceInSeconds } from "date-fns";

console.log(chalk.magenta("\n Welcome to Countdown Timer \n"));

await new Promise((resolve) => {
  setTimeout(resolve, 2000);
});

async function main() {
  let countdown = await inquirer.prompt({
    name: "countdownchoice",
    type: "list",
    message: chalk.yellowBright(
      "Do you want to start your timer in minutes or seconds?"
    ),
    choices: ["minutes", "seconds"],
  });

  let input: { userInput: number };

  if (countdown.countdownchoice === "seconds") {
    input = await inquirer.prompt({
      name: "userInput",
      type: "number",
      message: chalk.greenBright("Enter the amount of seconds"),
      validate: (response) => {
        if (isNaN(response)) {
          return "Please enter a valid number";
        } else if (response > 60) {
          return "amount must be less than 60";
        } else {
          return true;
        }
      },
    });
  } else {
    input = await inquirer.prompt({
      name: "userInput",
      type: "number",
      message: chalk.greenBright("Enter the amount of minutes"),
      validate: (response) => {
        if (isNaN(response)) {
          return "Please enter a valid number";
        } else if (response <= 0) {
          return "amount must be greater than 0";
        } else {
          return true;
        }
      },
    });
  }

  let response = input.userInput;

  function startTimer(value: number) {
    let initialTime: number;

    if (countdown.countdownchoice === "seconds") {
      initialTime = new Date().getTime() + value * 1000; // Add the inputted seconds
    } else {
      initialTime = new Date().getTime() + value * 60 * 1000; // Add the inputted minutes
    }
    const timer = setInterval(async () => {
      const currentTime = new Date().getTime();
      const timeDifference = Math.round((initialTime - currentTime) / 1000); // Calculate the difference

      if (timeDifference <= 0) {
        clearInterval(timer);
        console.log(chalk.redBright("Timer has Expired \n"));

        let startAgain = await inquirer.prompt({
          type: "confirm",
          name: "continue",
          message: chalk.yellowBright("Do you want to continue?"),
        });

        if (startAgain.continue) {
          main();
        }
        return;
      }

      let minute: number, second: number;

      if (countdown.countdownchoice === "seconds") {
        minute = Math.floor((timeDifference % (3600 * 24)) / 3600);
        second = Math.floor(timeDifference % 60);
      } else {
        minute = Math.floor(timeDifference / 60);
        second = Math.floor(timeDifference % 60);
      }
      console.log(
        `${minute.toString().padStart(2, "0")} : ${second
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);
  }

  startTimer(response);
}

main();
