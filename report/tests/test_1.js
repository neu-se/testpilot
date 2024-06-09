let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
        describe('test zip_a_folder', function() {
    it('test zip-a-folder', function(done) {
        const srcFolder = './test-folder';
        const zipFilePath = './test-folder.zip';

        // Create a test folder with some files
        fs.mkdirSync(srcFolder);
        fs.writeFileSync(`${srcFolder}/file1.txt`, 'Hello World!');
        fs.writeFileSync(`${srcFolder}/file2.txt`, 'Hello Again');

        zip_a_folder.zip(srcFolder, zipFilePath)
            .then(() => {
                // Check if the zip file exists
                assert(fs.existsSync(zipFilePath));

                // Check the contents of the zip file
                const zip = new require('jszip')();
                return zip.loadAsync(fs.readFileSync(zipFilePath));
            })
            .then(zip => {
                assert(zip.file('file1.txt'));
                assert(zip.file('file2.txt'));
                done();
            })
            .catch(err => {
                console.error(err);
                done(err);
            });

        // Clean up
        after(() => {
            fs.unlinkSync(zipFilePath);
            fs.rmdirSync(srcFolder, { recursive: true });
        });
    });
});
