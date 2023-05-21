# Tag Cloud Generator

This repository contains a Node.js module for generating tag clouds based on data from a CSV file. (csv file is located in root directory tweetsData.csv)

## Folder Structure

The project repository has the following folder structure:

- `utils/`: Contains the code for generating tag clouds.
- `tests/`: Contains the test files for the project.
- `routes/`: Contains the files for the project routing.conatins /gettagclouds route. and threshold (feel free to modify - once you modify ``` npm run start```).
- `app.js`: Entry file for the Project.
- `README.md`: Provides information about the project.

## Installation

To run this project locally, follow these steps:

1. Clone the repository or download the source code.
2. Open a terminal and navigate to the project directory.
3. Run the following command to install the project dependencies:

   ```npm install```

## To start the project, run the following command:
```npm run start```

The project will start on port 3005. You can access it in your browser using the URL http://localhost:3005.

To checck if the server is up open http://localhost:3005/gettagclouds you should see a json.

## Testing
To run the tests for this project, execute the following command:

```npm run test```

This command will run the test files located in the tests/ directory.


