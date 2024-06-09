let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
// class zip-a-folder()
// class ZipAFolder {
//     static async zip(srcFolder, zipFilePath) {
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
// 
//     static zipFolder(srcFolder, zipFilePath, callback) {
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
// }
describe('test zip_a_folder', function() {
    it('test zip-a-folder', function(done) {
describe('test zip_a_folder', function() {
    it('test zip-a-folder', function(done) {
        const srcFolder = './test-folder';
        const zipFilePath = './test-folder.zip';

        // Create a test folder with some files
        fs.mkdirSync(srcFolder);
        fs.writeFileSync(`${srcFolder}/file1.txt`, 'Hello World!');
        fs.writeFileSync(`${srcFolder}/file2.txt`, 'Hello Again');

        zip_a_folder.zip(srcFolder, zipFilePath)
            .then(() => {
                // Check if the zip file exists
                assert(fs.existsSync(zipFilePath));

                // Check the contents of the zip file
                const zip = new require('jszip')();
                return zip.loadAsync(fs.readFileSync(zipFilePath));
            })
            .then(zip => {
                assert(zip.file('file1.txt'));
                assert(zip.file('file2.txt'));
                done();
            })
            .catch(err => {
                console.error(err);
                done(err);
            });

        // Clean up
        after(() => {
            fs.unlinkSync(zipFilePath);
            fs.rmdirSync(srcFolder, { recursive: true });
        });
    });
});
    })
    // the test above fails with the following error:
    //   fs is not defined
    // fixed test:
    it('test zip-a-folder', function(done) {
