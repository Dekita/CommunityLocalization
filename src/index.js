// 
// author: dekitarpg@gmail.com <3
// system: create custom localization file for hogwarts legacy :)
// 

const stringify = require("json-stringify-pretty-compact");
const {join, dirname, basename, extname, normalize} = require('path');
const {writeFile, lstat, copyFile} = require('fs').promises;
const { execFileSync } = require('node:child_process');
const utils = require('./utils');
const ONLY_ENUS = false; // only process enUS for testing/speed

// actual logic
(async() =>  {
    
    console.log(`Generating new localization files`);
    
    // const UNREALPAK = join(__dirname, '../libs/unrealpak/UnrealPak.exe');
    const UNREALPAK = join(__dirname, '../libs/unrealpak/UnrealPak-Without-Compression.bat');
    const PARSELTONGUE = join(__dirname, '../libs/parseltongue/parseltongue.exe');
    // path for json file containing all default icons
    const default_loc_dir = join(__dirname, "../localization/default");
    const custom_loc_dir = join(__dirname, "../localization/custom");
    const modpath = `zCommunityLocalizationMod/Phoenix/Content/Localization/WIN64`;

    // read/process default localization
    const default_localization = {};
    for await (const readpath of utils.getFiles(default_loc_dir)) {
        if (extname(readpath) !== '.bin') continue;
        const filepath = readpath.replace(default_loc_dir, '');
        const filename = basename(filepath, extname(filepath));
        if (ONLY_ENUS && filename !== 'MAIN-enUS') continue;
        console.log(`exporting json from bin file: ${filename}`);
        execFileSync(PARSELTONGUE, [readpath], { cwd: '.' });
        const jsonpath = `${readpath.replace('.bin', '')}-modified`;
        default_localization[filename] = require(jsonpath);
    }

    // read/process custom localization
    const custom_localization = {};
    for await (const readpath of utils.getFiles(custom_loc_dir)) {
        if (extname(readpath) !== '.json') continue;
        const filepath = readpath.replace(default_loc_dir, '');
        const filename = basename(filepath, extname(filepath));
        console.log(`loading custom json from: ${filename}`);
        custom_localization[filename] = require(filepath);
    }

    // create combined localization for output
    const combined_localization = {...default_localization};
    for (const dkey of Object.keys(combined_localization)) {
        // dkey = localization key. eg: MAIN-enUS | SUB-zhTW
        for (const ckey of Object.keys(custom_localization)) {
            if (!custom_localization[ckey][dkey]) continue;
            // ckey = name of new loc entry. eg: ExampleTestEntry
            combined_localization[dkey][ckey] = custom_localization[ckey][dkey];
            console.log(`added ${dkey}-${ckey}: ${combined_localization[dkey][ckey]}`);
        }
    }

    // output final localiztions
    for (const key of Object.keys(combined_localization)) {
        const output_file = join(__dirname, `../output/${key}.json`);
        console.log(`writing output: ${output_file}`);
        // sort the json to make it alphabetical
        // dont think its required, but default is alpha, 
        // so replicated to keep in line with default standards.
        const sorter = (a, b) => a.localeCompare(b);
        const unordered = {...combined_localization[key]};
        const sorted_keys = Object.keys(unordered).sort(sorter);
        const ordered = sorted_keys.reduce((obj, key) => { 
            obj[key] = unordered[key]; 
            return obj;
        }, {})
        // write json file to output dir
        await writeFile(output_file, JSON.stringify(ordered, null, 2));
        // create bin file from output json
        execFileSync(PARSELTONGUE, [output_file], { cwd: '.' });
        // copy bin file into mod directory
        const newbin = output_file.replace('.json', '-modified.bin');
        await copyFile(newbin, join(__dirname, `../output/${modpath}/${key}.bin`));
    }

    console.log('finalizing: zCommunityLocalizationMod.pak');
    const twopac = '../../output/zCommunityLocalizationMod';
    execFileSync(UNREALPAK, [twopac], { cwd: '.' });

})();
// 
// dekitarpg@gmail.com
// 