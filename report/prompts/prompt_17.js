let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
// zip-a-folder.zipFolder(srcFolder, zipFilePath, callback)
describe('test zip_a_folder', function() {
    it('test zip-a-folder.zipFolder', function(done) {
let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');

describe('test zip_a_folder', function() {
    it('test zip-a-folder.zipFolder', function(done) {
        let srcFolder = './test_folder'; // replace with your source folder
        let zipFilePath = './test_folder.zip'; // replace with your desired zip file path

        zip_a_folder.zipFolder(srcFolder, zipFilePath, function(err) {
            if (err) {
                assert.fail(err);
            } else {
                assert.ok(fs.existsSync(zipFilePath));
                fs.unlinkSync(zipFilePath); // remove the zip file after test
                done();
            }
        });
    });
});
    })
    // the test above fails with the following error:
    //   Invalid syntax
    // fixed test:
    it('test zip-a-folder.zipFolder', function(done) {
