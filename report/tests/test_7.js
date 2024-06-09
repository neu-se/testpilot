let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
        describe('test zip_a_folder', function() {
    it('test zip-a-folder.zip', function(done) {
        const srcFolder = './test_folder';
        const zipFilePath = './archive.zip';

        zip_a_folder.zip(srcFolder, zipFilePath).then(() => {
            assert.ok(fs.existsSync(zipFilePath));
            fs.unlinkSync(zipFilePath);
            done();
        }).catch((err) => {
            done(err);
        });
    });
});
