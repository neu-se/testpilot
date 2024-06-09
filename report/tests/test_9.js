let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
let fs = require('fs'); // Add this line to require the fs module
let unzip = require('unzip');

describe('test zip_a_folder', function() {
    it('test zip-a-folder.zip', function(done) {
        let srcFolder = './test-folder';
        let zipFilePath = './test-folder.zip';

        // Create a test folder with some files
        fs.mkdirSync(srcFolder);
        fs.writeFileSync(`${srcFolder}/file1.txt`, 'Hello, world!');
        fs.writeFileSync(`${srcFolder}/file2.txt`, 'This is a test.');

        // Zip the folder
        zip_a_folder.zip(srcFolder, zipFilePath).then(() => {
            // Check if the zip file exists
            assert.ok(fs.existsSync(zipFilePath));

            // Unzip the file to a temporary folder
            let unzipFolder = './unzip-folder';
            fs.mkdirSync(unzipFolder);
            fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: unzipFolder }));

            // Check if the files are correctly unzipped
            assert.ok(fs.existsSync(`${unzipFolder}/file1.txt`));
            assert.ok(fs.existsSync(`${unzipFolder}/file2.txt`));

            // Clean up
            fs.rmSync(zipFilePath, { force: true });
            fs.rmdirSync(unzipFolder, { recursive: true });
            fs.rmdirSync(srcFolder, { recursive: true });

            done();
        }).catch((err) => {
            console.error(err);
            done(err);
        });
    });
});