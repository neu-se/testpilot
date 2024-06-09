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
describe('test zip_a_folder', function() {
    it('test zip-a-folder.zip', function(done) {
