let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
// usage #1
// const zipFolder = require('zip-a-folder');
// 
// class ZipAFolder {
// 
//     static main() {
//         zipFolder.zipFolder('/path/to/the/folder', '/path/to/archive.zip', function(err) {
//             if(err) {
//                 console.log('Something went wrong!', err);
//             }
//         });
//     }
// }
// 
// ZipAFolder.main();
// zip-a-folder.zipFolder(srcFolder, zipFilePath, callback)
describe('test zip_a_folder', function() {
    it('test zip-a-folder.zipFolder', function(done) {
describe('test zip_a_folder', function() {
    it('test zip-a-folder.zipFolder', function(done) {
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
    })
    // the test above fails with the following error:
    //   fs is not defined
    // fixed test:
    it('test zip-a-folder.zipFolder', function(done) {
