let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
        describe('test zip_a_folder', function() {
    it('test zip-a-folder.zipFolder', function(done) {
        const fs = require('fs');
        const srcFolder = './test-folder';
        const zipFilePath = './test-archive.zip';

        // Create a test folder and add some files to it
        fs.mkdirSync(srcFolder);
        fs.writeFileSync(`${srcFolder}/file1.txt`, 'Hello World!');
        fs.writeFileSync(`${srcFolder}/file2.txt`, 'Hello Again');

        zip_a_folder.zipFolder(srcFolder, zipFilePath, function(err) {
            if (err) {
                assert.fail(err);
            } else {
                // Check if the zip file exists
                fs.access(zipFilePath, fs.constants.F_OK, (err) => {
                    assert.ifError(err);
                    done();
                });
            }
        });
    });
});
