let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
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
        const zipFilePath = './test-folder.zip';

        // Create a test folder with some files
        fs.mkdirSync(srcFolder);
        fs.writeFileSync(`${srcFolder}/file1.txt`, 'Hello World!');
        fs.writeFileSync(`${srcFolder}/file2.txt`, 'Hello Again');

        zip_a_folder.zipFolder(srcFolder, zipFilePath, function(err) {
            if (err) {
                done(err);
            } else {
                // Check if the zip file exists
                fs.access(zipFilePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        // Check if the zip file is not empty
                        fs.stat(zipFilePath, (err, stats) => {
                            if (err) {
                                done(err);
                            } else if (stats.size === 0) {
                                done(new Error('Zip file is empty'));
                            } else {
                                done();
                            }
                        });
                    }
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
