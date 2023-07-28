/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
const { exec } = require('child_process');
const fs = require('fs');

function gitTag(unpacked, parsed, version) {
  console.log(`"${unpacked}/resources/app.asar"`);

  exec(`cd "${__dirname}/dist" && git add "${unpacked}/resources/app.asar"`, (error, stdout, stderr) => {
    if (error) {
      console.log('Error while adding a file');
      return;
    }

    if (stderr) {
      console.log(`Stderr while trying to add the file: ${stderr}`);
    }

    console.log('File added succesfully');

    exec(`cd "${__dirname}/dist" && git commit -m "."`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log('Error while commiting');
      }

      exec(`cd "${__dirname}/dist" && git tag -a v${version} -m "POS version: ${parsed.join('.')}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          console.log(`Some error while trying to add tag v${parsed.join('.')}`);
          console.log(`Error: ${stderr || error}`);
          return;
        }

        console.log(`Tag ${version} added succesfully!`);

        exec(`cd "${__dirname}/dist" && git push --tag`, (error, stdout, stderr) => {
          if (error || stderr) {
            console.log(`Error message: ${error || stderr}`);
          }

          switch (true) {
            case +parsed[1] >= 9:
              parsed.splice(0, 2, [+parsed[0] + 1, 0]);
              parsed = parsed.join('.');
              break;
            case +parsed[2] >= 4:
              parsed.splice(1, 2, [+parsed[1] + 1, 0]);
              parsed = parsed.join('.');
              break;
            default:
              parsed = [...parsed.slice(0, 2), +parsed[2] + 1].join('.');
          }

          fs.readFile(`${__dirname}/package.json`, 'utf-8', (err, data) => {
            if (err) {
              console.log('Error while reading package.json');
              return;
            }

            const obj = JSON.parse(data);
            obj.version = parsed;

            fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(obj, null, 2));
            console.log(`Current version of the app updated: ${parsed}`);
          });
        });
      });
    });
  });
}

function addTag() {
  if (!fs.existsSync(`${__dirname}/package.json`)) {
    console.log('Can\'t reach the package.json');
    return;
  }

  const { version } = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, 'utf-8'));
  const parsed = version.split('.');
  const dir = fs.readdirSync(`${__dirname}/dist`);
  const unpacked = dir.find((file) => file.match('icon') === null && file.indexOf('.') === -1);

  if (!unpacked) {
    console.log('Error: Compiled incorrect');
    return;
  }

  gitTag(unpacked, parsed, version);
}

function removeTags() {
  exec(`cd "${__dirname}/dist" && git tag`, (error, stdout, stderr) => {
    if (error || stderr) {
      console.log('Some error occured while trying to get the tags');
      return;
    }

    const tagArr = stdout.split('\n').filter(Boolean);

    tagArr.forEach((cur, idx) => {
      exec(`cd "${__dirname}/dist" && git tag -d ${cur}`, (error, stdout, stderr) => {
        if (error || stderr) {
          console.log(`Some error occured while trying to remive this tag ${cur}`);
          return;
        }

        console.log(`This tag has been removed succesfully: ${cur}`);

        if (idx + 1 >= tagArr.length) {
          console.log('Last tag has been removed');
        }
      });
    });
  });
}

switch (true) {
  case process.env.MODE === '1':
    addTag();
    break;
  case process.env.MODE === '2':
    removeTags();
    break;
  default:
    console.log('Please start script from npm');
}
