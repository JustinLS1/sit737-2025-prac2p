const express= require("express");
const app= express();
const fs = require('fs');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'add-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

// Endpoint for Calculate
app.get("/calculate", (req, res) => {
    const { operation, n1, n2 } = req.query;

    // Parse the numbers from query parameters
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);

    // Check if numbers are valid
    if (isNaN(num1) || isNaN(num2)) {
        logger.error("Incorrectly defined number");
        return res.status(400).json({ error: "Incorrectly defined number" });
    }

    let result;

    // Four different operations 'Addition, Subtraction, Multiplication & Division'
    switch (operation) {
        case "add":
            result = num1 + num2;
            break;
        case "subtract":
            result = num1 - num2;
            break;
        case "multiply":
            result = num1 * num2;
            break;
        case "divide":
            if (num2 === 0) {
                logger.error("Invalid Demonimator");
                return res.status(400).json({ error: "Cannot use Zero as a denominator" });
            }
            result = num1 / num2;
            break;
        default:
            logger.error("Invalid operation");
            return res.status(400).json({ error: "Invalid operation" });
    }

    // Console Log
    logger.info(`Operation: ${operation}, Numbers: ${num1}, ${num2}, Result: ${result}`);

    // Show result
    res.send(`Operation Type: ${operation}<br>Result: ${result}`);
});

const port=3040;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
})