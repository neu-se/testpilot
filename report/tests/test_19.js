let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
        describe('test zip_a_folder', function() {
    it('test zip-a-folder.zipFolder', function(done) {
        const fs = require('fs'); // Add this line to define fs
        const srcFolder = './test-folder';
        const zipFilePath = './test-archive.zip';
        
        zip_a_folder.zipFolder(srcFolder, zipFilePath, function(err) {
            if (err) {
                assert.fail(err);
            } else {
                assert.ok(fs.existsSync(zipFilePath));
                fs.unlinkSync(zipFilePath);
                done();
            }
        });
    });
});
