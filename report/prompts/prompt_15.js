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
