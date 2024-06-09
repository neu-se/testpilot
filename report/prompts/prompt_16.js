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
// zipFolder(srcFolder, zipFilePath, callback) {
//         // folder double check
//         fs.access(srcFolder, fs.constants.F_OK, (notExistingError) => {
//             if (notExistingError) {
//                 return callback(notExistingError);
//             }
//             fs.access(path.dirname(zipFilePath), fs.constants.F_OK, (notExistingError) => {
//                 if (notExistingError) {
//                     return callback(notExistingError);
//                 }
//                 var output = fs.createWriteStream(zipFilePath);
//                 var zipArchive = archiver('zip');
// 
//                 output.on('close', function() {
//                     callback();
//                 });
// 
//                 zipArchive.pipe(output);
//                 zipArchive.directory(srcFolder, false);
//                 zipArchive.finalize();
//             });
//         });
//     }
describe('test zip_a_folder', function() {
    it('test zip-a-folder.zipFolder', function(done) {
describe('test zip_a_folder', function() {
    it('test zip-a-folder.zipFolder', function(done) {
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
    })
    // the test above fails with the following error:
    //   fs is not defined
    // fixed test:
    it('test zip-a-folder.zipFolder', function(done) {
