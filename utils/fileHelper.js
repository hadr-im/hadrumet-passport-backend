const fs = require('fs');

async function readJSONFile(filePath){
    try{
        const data = await fs.readJson(filePath);
        return data;
    }catch(err){
        console.log(`Error reading JSON file at ${filePath}`);
        return [];
    }
}

async function writeJSONFile(filePath, data){
    try{
        fs.writeFile(filePath, JSON.stringify(data, null));
    }catch(err){
        console.log(`Error writing JSON file at ${filePath}`);
    }
}


module.exports = {
    readJSONFile,
    writeJSONFile
}