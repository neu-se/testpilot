let mocha = require('mocha');
let assert = require('assert');
let zip_a_folder = require('zip-a-folder');
let fs = require('fs');

describe('test zip_a_folder', function() {
  let folderPath = './testFolder';
  let zipPath = './testFolder.zip';

  before(function(done) {
    // Create a test folder with some files
    fs.mkdirSync(folderPath);
    fs.writeFileSync(`${folderPath}/file1.txt`, 'Hello World!');
    fs.writeFileSync(`${folderPath}/file2.txt`, 'Hello Again!');
    done();
  });

  after(function(done) {
    // Clean up the test folder and zip file
    fs.rmdirSync(folderPath, { recursive: true });
    fs.unlinkSync(zipPath);
    done();
  });

  it('test zip-a-folder', function(done) {
    zip_a_folder.zipFolder(folderPath, zipPath, function(err) {
      assert.ifError(err);
      assert.ok(fs.existsSync(zipPath));
      done();
    });
  });
});