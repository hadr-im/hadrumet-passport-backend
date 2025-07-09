const fs = require('fs').promises;

async function readJSONFile(filePath){
    try{
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    }catch(err){
        console.log(`Error reading JSON file at ${filePath}`);
        console.error(err);
        return [];
    }
}

async function writeJSONFile(filePath, data){
    try{
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    }catch(err){
        console.log(`Error writing JSON file at ${filePath}`);
        console.error(err);
    }
}

module.exports = {
    readJSONFile,
    writeJSONFile
}