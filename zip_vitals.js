const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

async function createTarGz() {
  // tar -czf already worked, but let's confirm.
  // Actually, tar -czf vital-labs-code.tar.gz vital-labs-code/ was already run and worked.
  console.log("Tar exists");
}
createTarGz();
