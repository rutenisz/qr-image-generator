/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
  .prompt([{ message: "Type in your URL: ", name: "URL" }])
  .then((answers) => {
    const url = answers.URL;

    // generate qr code image
    const qr_svg = qr.image(url, { type: "png" });
    const qrStream = fs.createWriteStream("qr_img.png");
    qr_svg.pipe(qrStream);

    // save url to a text file
    fs.writeFile("URL.txt", url, (err) => {
      if (err) throw err;
      console.log("The file has been saved to URL.txt!");
    });

    // notify user when qr code image is saved
    qrStream.on("finish", () => {
      console.log("The QR code image has been saved as qr_img.png!");
    });

    // handle errors in writing qr code image
    qrStream.on("error", (err) => {
      console.error("Error writing QR code image", err);
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.error("Prompt couldn't be rendered in the current environment");
    } else {
      console.error("An error occurred: ", error);
    }
  });
