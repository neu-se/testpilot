let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
        describe('test zip_a_folder', function() {
    it('test zip-a-folder.zip', function(done) {
        const fs = require('fs'); // add this line to require fs
        const srcFolder = './test-folder';
        const zipFilePath = './test-archive.zip';

        zip_a_folder.zip(srcFolder, zipFilePath).then(() => {
            assert.ok(fs.existsSync(zipFilePath));
            done();
        }).catch((err) => {
            done(err);
        });
    });
});
