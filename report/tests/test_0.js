let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
describe('test zip_a_folder', function() {
    it('test zip-a-folder', function(done) {
        let folderPath = './testFolder';
let zipPath = './testFolder.zip';

before(function() {
  // Create a test folder with some files
  fs.mkdirSync(folderPath);
  fs.writeFileSync(`${folderPath}/file1.txt`, 'Hello World!');
  fs.writeFileSync(`${folderPath}/file2.txt`, 'Hello Again!');
});

after(function() {
  // Clean up the test folder and zip file
  fs.rmdirSync(folderPath, { recursive: true });
  fs.unlinkSync(zipPath);
});

it('test zip-a-folder', function(done) {
  zip_a_folder.zipFolder(folderPath, zipPath, function(err) {
    assert.ifError(err);
    assert.ok(fs.existsSync(zipPath));
    done();
  });
});
    })
})