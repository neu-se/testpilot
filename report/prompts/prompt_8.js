let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
// usage #1
// const { zip } = require('zip-a-folder');
// 
// class ZipAFolder {
// 
//     static async main() {
//         await zip('/path/to/the/folder', '/path/to/archive.zip');
//     }
// }
// 
// ZipAFolder.main();
// zip-a-folder.zip(srcFolder, zipFilePath) async
// async zip(srcFolder, zipFilePath) {
//         const targetBasePath = path.dirname(zipFilePath);
// 
//         if (targetBasePath === srcFolder) {
//             throw new Error('Source and target folder must be different.');
//         }
//         return new Promise((resolve, reject) => {
//             ZipAFolder.zipFolder(srcFolder, zipFilePath, err => {
//                 if (err) {
//                     reject(err);
//                 }
//                 resolve();
//             });
//         });
//     }
describe('test zip_a_folder', function() {
    it('test zip-a-folder.zip', function(done) {
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
    })
    // the test above fails with the following error:
    //   fs is not defined
    // fixed test:
    it('test zip-a-folder.zip', function(done) {
